#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

// Copy @ffmpeg/core-mt dist files from node_modules to public/ffmpeg if present
function copyCoreMt() {
  const pkgRoot = path.resolve(__dirname, '..')
  const localServerSrc = path.join(pkgRoot, 'FFmpegWasmLocalServer', 'public', 'js', 'ffmpeg')
  const destBase = path.join(pkgRoot, 'public', 'ffmpeg')
  fs.mkdirSync(destBase, { recursive: true })

  // Prefer core-mt package if present
  const coreMtSrc = path.join(pkgRoot, 'node_modules', '@ffmpeg', 'core-mt', 'dist', 'umd')
  const coreSrc = path.join(pkgRoot, 'node_modules', '@ffmpeg', 'ffmpeg', 'dist', 'umd')

  let copied = 0
  // Priority 0: If local server assets exist, copy them first
  if (fs.existsSync(localServerSrc)) {
    const localFiles = [
      'ffmpeg-core-mt.js',
      'ffmpeg-core-mt.wasm',
      'ffmpeg-core-mt.worker.js',
      'ffmpeg-core.js',
      'ffmpeg-core.wasm',
      'ffmpeg-core.worker.js',
    ]
    for (const f of localFiles) {
      const s = path.join(localServerSrc, f)
      const d = path.join(destBase, f)
      if (fs.existsSync(s)) {
        fs.copyFileSync(s, d)
        console.log('[postinstall] Copied (local server)', f, 'to public/ffmpeg')
        copied++
      }
    }
  }

  if (fs.existsSync(coreMtSrc)) {
    const files = ['ffmpeg-core-mt.js', 'ffmpeg-core-mt.wasm', 'ffmpeg-core-mt.worker.js']
    for (const f of files) {
      const s = path.join(coreMtSrc, f)
      const d = path.join(destBase, f)
      if (fs.existsSync(s)) {
        fs.copyFileSync(s, d)
        console.log('[postinstall] Copied', f, 'to public/ffmpeg')
        copied++
      }
    }
  }

  // Fallback: some installs only include @ffmpeg/ffmpeg UMD build (named ffmpeg.js)
  if (fs.existsSync(coreSrc)) {
    const tryFiles = [
      { src: 'ffmpeg-core.js', alt: 'ffmpeg.js' },
      { src: 'ffmpeg-core.wasm', alt: 'ffmpeg.wasm' },
      { src: 'ffmpeg-core.worker.js', alt: 'ffmpeg-core.worker.js' },
    ]
    for (const t of tryFiles) {
      const s1 = path.join(coreSrc, t.src)
      const s2 = path.join(coreSrc, t.alt)
      const dest = path.join(destBase, t.src)
      if (fs.existsSync(s1)) {
        fs.copyFileSync(s1, dest)
        console.log('[postinstall] Copied', t.src, 'to public/ffmpeg')
        copied++
      } else if (fs.existsSync(s2)) {
        fs.copyFileSync(s2, dest)
        console.log('[postinstall] Copied', t.alt, '->', t.src, 'to public/ffmpeg')
        copied++
      }
    }
  }

  if (copied === 0) {
    console.log('[postinstall] No ffmpeg files found in node_modules to copy')
  }
}

try {
  copyCoreMt()
} catch (err) {
  console.error('[postinstall] Failed to copy core-mt:', err)
  process.exitCode = 0 // don't fail install
}
