'use client'

import { useState, useRef, useCallback } from 'react'

export default function CreatePage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Supported video formats
  const supportedFormats = [
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/wmv',
    'video/flv',
    'video/webm',
    'video/mkv',
    'video/m4v'
  ]

  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Handle file validation
  const validateFile = (file: File) => {
    if (!supportedFormats.includes(file.type)) {
      alert('Định dạng file không được hỗ trợ. Vui lòng chọn file video hợp lệ.')
      return false
    }
    
    // Check file size (max 500MB)
    const maxSize = 500 * 1024 * 1024 // 500MB
    if (file.size > maxSize) {
      alert('Kích thước file quá lớn. Vui lòng chọn file nhỏ hơn 500MB.')
      return false
    }
    
    return true
  }

  // Simulate upload progress
  const simulateUpload = async (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)
    
    // Create video preview URL
    const previewUrl = URL.createObjectURL(file)
    setVideoPreview(previewUrl)
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i)
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    
    setIsUploading(false)
  }

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (!validateFile(file)) return
    
    setUploadedFile(file)
    await simulateUpload(file)
  }

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [])

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  // Handle click to browse files
  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  // Remove uploaded file
  const removeFile = () => {
    setUploadedFile(null)
    setVideoPreview(null)
    setUploadProgress(0)
    setIsUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  return (
    <div className="bg-gray-900 px-8 py-8 min-h-full">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-3 text-center">
            Video Subtitle Translation Editor
          </h1>
          <p className="text-lg text-gray-400 text-center">
            Upload your video and configure translation settings
          </p>
        </div>

        {/* File Upload Section */}
        <div className="space-y-8">
          {/* Upload Area */}
          <div className={`w-full h-96 border-2 border-dashed rounded-lg bg-gray-800 bg-opacity-50 flex flex-col items-center justify-center p-8 transition-colors cursor-pointer ${
            isDragOver 
              ? 'border-blue-500 bg-blue-500 bg-opacity-10' 
              : 'border-gray-600 hover:border-gray-500'
          }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
          >
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {!uploadedFile ? (
              <div className="flex flex-col items-center space-y-6">
                {/* Upload Icon */}
                <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
                  isDragOver ? 'bg-blue-600' : 'bg-gray-600'
                }`}>
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                
                {/* Text */}
                <div className="text-center">
                  <h3 className="text-xl font-medium text-white mb-3">
                    {isDragOver ? 'Drop your video file here' : 'Drop your video file here'}
                  </h3>
                  <p className="text-lg text-gray-400">
                    or click to browse files
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Supports: MP4, AVI, MOV, WMV, FLV, WebM, MKV (Max: 500MB)
                  </p>
                </div>
                
                {/* Cloud Service Options */}
                <div className="flex flex-wrap gap-6 justify-center">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6.28 6.28a.75.75 0 00-1.06 1.06L8.94 11H3a1 1 0 100 2h5.94l-3.72 3.66a.75.75 0 101.06 1.06L11 13l4.72 4.72a.75.75 0 101.06-1.06L13.06 13H19a1 1 0 100-2h-5.94l3.72-3.66a.75.75 0 00-1.06-1.06L11 11L6.28 6.28z"/>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-500">Google Drive</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.71 6.71a1 1 0 00-1.42 0l-4 4a1 1 0 000 1.42l4 4a1 1 0 001.42-1.42L4.42 11H20a1 1 0 000-2H4.42l3.29-3.29a1 1 0 000-1.42z"/>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-500">Dropbox</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25 4.83 4.83 0 01-7.72 0 4.83 4.83 0 01-3.77 4.25 4.83 4.83 0 000 6.62 4.83 4.83 0 013.77 4.25 4.83 4.83 0 017.72 0 4.83 4.83 0 013.77-4.25 4.83 4.83 0 000-6.62z"/>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-500">TikTok</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-500">YouTube</span>
                  </div>
                </div>
              </div>
            ) : (
              /* File Uploaded Display */
              <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                {/* Video Preview */}
                {videoPreview && !isUploading && (
                  <div className="w-64 h-36 bg-black rounded-lg overflow-hidden">
                    <video 
                      src={videoPreview} 
                      controls 
                      className="w-full h-full object-cover"
                      preload="metadata"
                    />
                  </div>
                )}

                {/* Upload Progress */}
                {isUploading && (
                  <div className="w-full max-w-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">Uploading...</span>
                      <span className="text-sm text-gray-300">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* File Info */}
                <div className="text-center">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-lg font-medium text-white">{uploadedFile.name}</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {formatFileSize(uploadedFile.size)}
                  </p>
                </div>

                {/* Action Buttons */}
                {!isUploading && (
                  <div className="flex gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleBrowseClick()
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Change File
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile()
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Language Settings */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-white">Language Settings</h3>
              <label className="flex items-center gap-2">
                <div className="relative">
                  <input type="checkbox" className="sr-only" />
                  <div className="w-3 h-3 bg-gray-600 border border-gray-500 rounded-sm"></div>
                </div>
                <span className="text-sm text-gray-300">Auto-detect</span>
              </label>
            </div>
            
            <div className="flex items-end gap-4">
              {/* Source Language */}
              <div className="flex-1">
                <label className="block text-sm text-gray-300 mb-2">Source Language</label>
                <button className="w-full bg-gray-600 rounded-lg px-4 py-3 flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🇨🇳</span>
                    <span>Chinese</span>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              
              {/* Switch Button */}
              <div className="pb-3">
                <button className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
              </div>
              
              {/* Target Language */}
              <div className="flex-1">
                <label className="block text-sm text-gray-300 mb-2">Target Language</label>
                <button className="w-full bg-gray-600 rounded-lg px-4 py-3 flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🇻🇳</span>
                    <span>Vietnamese</span>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* AI Model Selection */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Lựa chọn mô hình AI</h3>
            <div className="relative">
              <button className="w-full bg-gray-600 rounded-lg px-4 py-3 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <span className="text-gray-300">Model AI:</span>
                  <span>ChatGPT 4.1 Giá Rẻ (1 ký tự trên dưới 1 token)</span>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Options (Hidden by default, shows on click) */}
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-600 rounded-lg shadow-lg border border-gray-500 z-10 hidden">
                <button className="w-full px-4 py-3 text-left text-white hover:bg-gray-500 rounded-t-lg">
                  ChatGPT 4.1 Giá Rẻ (1 ký tự trên dưới 1 token)
                </button>
                <button className="w-full px-4 py-3 text-left text-white hover:bg-gray-500 flex items-center justify-between">
                  <span>ChatGPT 4o Giá Rẻ (1 ký tự trên dưới 1 token)</span>
                  <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">Popular</span>
                </button>
                <button className="w-full px-4 py-3 text-left text-white hover:bg-gray-500">
                  ChatGPT 5 Giá Rẻ (1 ký tự trên dưới 1 token)
                </button>
                <button className="w-full px-4 py-3 text-left text-white hover:bg-gray-500">
                  ChatGPT 4 Giá Rẻ (1 ký tự trên dưới 8 token)
                </button>
                <button className="w-full px-4 py-3 text-left text-white hover:bg-gray-500">
                  Dịch Theo Ngữ Cảnh Dài (1 ký tự dịch bằng 20 token)
                </button>
                <button className="w-full px-4 py-3 text-left text-white hover:bg-gray-500">
                  ChatGPT o1 Mini (1 ký tự trên dưới 8 token)
                </button>
                <button className="w-full px-4 py-3 text-left text-white hover:bg-gray-500">
                  ChatGPT o3 Mini (1 ký tự trên dưới 6 token)
                </button>
                <button className="w-full px-4 py-3 text-left text-white hover:bg-gray-500">
                  ChatGPT 4o (1 ký tự trên dưới 12 token)
                </button>
                <button className="w-full px-4 py-3 text-left text-white hover:bg-gray-500">
                  ChatGPT 4.1 (1 ký tự trên dưới 12 token)
                </button>
                <button className="w-full px-4 py-3 text-left text-white hover:bg-gray-500 rounded-b-lg">
                  ChatGPT 5 (1 ký tự trên dưới 12 token)
                </button>
              </div>
            </div>
          </div>

          {/* Translation Options */}
          <div className="bg-gray-800 rounded-lg p-8">
            <h3 className="text-xl font-medium text-white mb-8">Translation Options</h3>
            
            {/* Translation Method Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button className="flex items-center gap-3 px-6 py-3 bg-blue-600 rounded-lg text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm">Soft Sub (.SRT)</span>
              </button>
              <button className="flex items-center gap-3 px-6 py-3 bg-gray-600 rounded-lg text-gray-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm">Hard Sub</span>
              </button>
              <button className="flex items-center gap-3 px-6 py-3 bg-gray-600 rounded-lg text-gray-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0a2 2 0 002-2h14a2 2 0 012 2v0" />
                </svg>
                <span className="text-sm">Text Translation</span>
              </button>
              <button className="flex items-center gap-3 px-6 py-3 bg-gray-600 rounded-lg text-gray-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8.464 8.464a5 5 0 000 7.072M5.636 5.636a9 9 0 000 12.728" />
                </svg>
                <span className="text-sm">Audio Dubbing</span>
              </button>
              <button className="flex items-center gap-3 px-6 py-3 bg-gray-600 rounded-lg text-gray-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <span className="text-sm">Audio Dubbing V2</span>
              </button>
            </div>

            {/* Advanced Tools */}
            <div className="mb-8">
              <h4 className="text-lg font-medium text-white mb-6">Advanced Tools</h4>
              
              <div className="grid grid-cols-2 gap-6">
                {/* Toggle Switches */}
                <label className="flex items-center gap-4 p-4 rounded-lg">
                  <div className="relative">
                    <div className="w-12 h-7 bg-gray-600 rounded-full">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-1 left-1 transition-transform transform"></div>
                    </div>
                  </div>
                  <span className="text-gray-300">Remove original text</span>
                </label>
                
                <label className="flex items-center gap-4 p-4 rounded-lg">
                  <div className="relative">
                    <div className="w-12 h-7 bg-gray-600 rounded-full">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-1 left-1 transition-transform transform"></div>
                    </div>
                  </div>
                  <span className="text-gray-300">Remove background music</span>
                </label>
                
                <label className="flex items-center gap-4 p-4 rounded-lg">
                  <div className="relative">
                    <div className="w-12 h-7 bg-gray-600 rounded-full">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-1 left-1 transition-transform transform"></div>
                    </div>
                  </div>
                  <span className="text-gray-300">Merge captions</span>
                </label>
                
                <label className="flex items-center gap-4 p-4 rounded-lg">
                  <div className="relative">
                    <div className="w-12 h-7 bg-gray-600 rounded-full">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-1 left-1 transition-transform transform"></div>
                    </div>
                  </div>
                  <span className="text-gray-300">Merge open captions</span>
                </label>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-lg text-gray-400">
                    {uploadedFile ? formatFileSize(uploadedFile.size) : '0 MB'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-lg text-gray-400">990 Points/min</span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  onClick={removeFile}
                  disabled={!uploadedFile}
                >
                  Cancel
                </button>
                <button 
                  className={`px-8 py-3 rounded-lg transition-colors ${
                    uploadedFile && !isUploading
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!uploadedFile || isUploading}
                >
                  {isUploading ? 'Processing...' : 'Start Translation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}