'use client'

import { useState, DragEvent, ChangeEvent } from 'react'

type UploadDropzoneProps = {
  onUpload: (file: File) => void
}

export function UploadDropzone({ onUpload }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0]
    if (!file.type.includes('video')) {
      alert('Please select an MP4 or supported video file.')
      return
    }
    onUpload(file)
  }

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setIsDragging(false)
    handleFiles(event.dataTransfer.files)
  }

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files)
  }

  return (
    <label
      className={`flex flex-col items-center justify-center h-full rounded-xl border-2 border-dashed transition-colors cursor-pointer ${
        isDragging ? 'border-sky-500 bg-sky-500/10' : 'border-slate-700 bg-slate-900'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input type="file" accept="video/mp4,video/*" className="hidden" onChange={handleInputChange} />
      <div className="text-center max-w-xs">
        <div className="mt-8 text-3xl">🎬</div>
        <p className="mt-4 text-lg font-semibold text-white">Select or drop a video file</p>
        <p className="mt-2 text-sm text-slate-400">Supports MP4 and common video formats</p>
        <p className="mt-8 px-4 py-2 inline-flex rounded-full bg-slate-800 text-slate-200 text-sm">Browse files</p>
      </div>
    </label>
  )
}
