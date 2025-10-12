// Minimal WebM muxer for a single video track (VP8/VP9) using EBML.
// Note: Video-only. No audio. Intended for use with WebCodecs EncodedVideoChunk.

type ChunkInfo = {
  timestampUs: number
  data: Uint8Array
  key: boolean
}

function u8(...nums: number[]) { return new Uint8Array(nums) }
function strToU8(s: string) { return new TextEncoder().encode(s) }

// Write a variable-length integer (vint) used in EBML element sizes and IDs
function writeVint(value: number): Uint8Array {
  // Only supporting lengths up to 8 bytes is typical; small sizes usually fit 1-2 bytes
  if (value < 0x7F) return u8(0x80 | value)
  if (value < 0x3FFF) return new Uint8Array([0x40 | (value >> 8), value & 0xFF])
  if (value < 0x1F_FFFF) return new Uint8Array([0x20 | (value >> 16), (value >> 8) & 0xFF, value & 0xFF])
  if (value < 0x0F_FF_FF_FF) return new Uint8Array([0x10 | (value >> 24), (value >> 16) & 0xFF, (value >> 8) & 0xFF, value & 0xFF])
  // Fallback 8 bytes
  const out = new Uint8Array(9)
  out[0] = 0x01
  for (let i = 7; i >= 0; i--) { out[8 - i] = (value >> (i * 8)) & 0xFF }
  return out
}

function writeId(id: number): Uint8Array {
  // EBML element IDs are variable length; here we assume given as full bytes value
  if (id <= 0xFF) return u8(id)
  if (id <= 0xFFFF) return u8((id >> 8) & 0xFF, id & 0xFF)
  if (id <= 0xFFFFFF) return u8((id >> 16) & 0xFF, (id >> 8) & 0xFF, id & 0xFF)
  return u8((id >> 24) & 0xFF, (id >> 16) & 0xFF, (id >> 8) & 0xFF, id & 0xFF)
}

function writeUint(value: number, bytes: number): Uint8Array {
  const out = new Uint8Array(bytes)
  for (let i = bytes - 1; i >= 0; i--) { out[i] = value & 0xFF; value >>= 8 }
  return out
}

function writeFloat64(value: number): Uint8Array {
  const buf = new ArrayBuffer(8)
  new DataView(buf).setFloat64(0, value)
  return new Uint8Array(buf)
}

function el(id: number, data: Uint8Array): Uint8Array {
  const header = new Uint8Array(writeId(id).length + writeVint(data.length).length)
  header.set(writeId(id), 0)
  header.set(writeVint(data.length), writeId(id).length)
  const out = new Uint8Array(header.length + data.length)
  out.set(header, 0)
  out.set(data, header.length)
  return out
}

function concat(parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((n, p) => n + p.length, 0)
  const out = new Uint8Array(total)
  let off = 0
  for (const p of parts) { out.set(p, off); off += p.length }
  return out
}

export class SimpleWebMWriter {
  private parts: Uint8Array[] = []
  private clusterParts: Uint8Array[] = []
  private clusterTimecodeMs = 0
  private timecodeScale = 1_000_000 // 1ms units
  private width: number
  private height: number
  private codecId: 'V_VP8' | 'V_VP9'

  constructor(width: number, height: number, codecId: 'V_VP8' | 'V_VP9' = 'V_VP8') {
    this.width = width
    this.height = height
    this.codecId = codecId
    this.writeHeader()
    this.startCluster(0)
  }

  private writeHeader() {
    // EBML header
    const ebml = el(0x1A45DFA3, concat([
      el(0x4286, writeUint(1, 1)), // EBMLVersion
      el(0x42F7, writeUint(1, 1)), // EBMLReadVersion
      el(0x42F2, writeUint(4, 1)), // EBMLMaxIDLength
      el(0x42F3, writeUint(8, 1)), // EBMLMaxSizeLength
      el(0x4282, strToU8('webm')), // DocType
      el(0x4287, writeUint(2, 1)), // DocTypeVersion
      el(0x4285, writeUint(2, 1)), // DocTypeReadVersion
    ]))

    // Segment (unknown size => 0xFF...)
    const segmentHeader = concat([
      writeId(0x18538067), // Segment
      new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF])
    ])

    // Info
    const info = el(0x1549A966, concat([
      el(0x2AD7B1, writeUint(this.timecodeScale, 4)), // TimecodeScale
      el(0x4D80, strToU8('vidocr')), // MuxingApp
      el(0x5741, strToU8('vidocr-webcodecs')), // WritingApp
    ]))

    // Tracks
    const video = el(0xE0, concat([
      el(0xB0, writeUint(this.width, 2)),
      el(0xBA, writeUint(this.height, 2)),
    ]))
    const trackEntry = el(0xAE, concat([
      el(0xD7, writeUint(1, 1)), // TrackNumber
      el(0x73C5, writeUint(1, 1)), // TrackUID
      el(0x83, writeUint(1, 1)), // TrackType video
      el(0x86, strToU8(this.codecId)), // CodecID
      video,
    ]))
    const tracks = el(0x1654AE6B, trackEntry)

    this.parts.push(ebml, segmentHeader, info, tracks)
  }

  private startCluster(timecodeMs: number) {
    this.clusterTimecodeMs = Math.max(0, Math.floor(timecodeMs))
    const clusterHeader = el(0x1F43B675, el(0xE7, writeUint(this.clusterTimecodeMs, 2)))
    this.clusterParts.push(clusterHeader)
  }

  addChunk(chunk: ChunkInfo) {
    const timestampMs = Math.round(chunk.timestampUs / 1000)
    if (timestampMs - this.clusterTimecodeMs > 5000) {
      // Flush current cluster to parts
      this.parts.push(concat(this.clusterParts))
      this.clusterParts = []
      this.startCluster(timestampMs)
    }
    const relTime = timestampMs - this.clusterTimecodeMs
    const trackNumberVint = u8(0x81) // track 1
    const timecode = writeUint((relTime & 0xFFFF), 2)
    const flags = u8(chunk.key ? 0x80 : 0x00)
    const simpleBlockData = concat([trackNumberVint, timecode, flags, chunk.data])
    const simpleBlock = concat([writeId(0xA3), writeVint(simpleBlockData.length), simpleBlockData])
    this.clusterParts.push(simpleBlock)
  }

  finalize(): Blob {
    if (this.clusterParts.length) this.parts.push(concat(this.clusterParts))
    const data = concat(this.parts)
    // Convert to an ArrayBuffer slice to satisfy BlobPart typing with strict libs
    const arrBuf = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer
    return new Blob([arrBuf], { type: 'video/webm' })
  }
}
