'use client'

import { useState } from 'react'
import { SubtitlePanel } from './index'

export default function SubtitleDemo() {
  const [jobId, setJobId] = useState('demo-job-123')
  const [messages, setMessages] = useState<string[]>([])

  const addMessage = (message: string) => {
    setMessages(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const handleSubtitleImported = (success: boolean) => {
    if (success) {
      addMessage('✅ Import phụ đề thành công!')
    } else {
      addMessage('❌ Import phụ đề thất bại!')
    }
  }

  const handleSubtitleExported = (format: string) => {
    addMessage(`📤 Export phụ đề ${format} thành công!`)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Phụ đề Component Demo</h1>
        
        {/* Job ID Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Job ID:</label>
          <input
            type="text"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 w-full max-w-md"
            placeholder="Nhập Job ID..."
          />
        </div>

        {/* Messages Log */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Messages Log:</h2>
          <div className="bg-gray-800 rounded-lg p-4 max-h-40 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-gray-400">Chưa có messages...</p>
            ) : (
              <div className="space-y-1">
                {messages.map((message, index) => (
                  <div key={index} className="text-sm font-mono">
                    {message}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Subtitle Panel */}
        <div className="bg-gray-800 rounded-lg">
          <SubtitlePanel
            jobId={jobId}
            onSubtitleImported={handleSubtitleImported}
            onSubtitleExported={handleSubtitleExported}
          />
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Hướng dẫn sử dụng:</h3>
          <ul className="text-sm space-y-1">
            <li>• Nhập Job ID để test export phụ đề</li>
            <li>• Click "Xuất phụ đề" để test export (cần API backend)</li>
            <li>• Click "Nhập phụ đề" để mở modal import</li>
            <li>• Chọn file phụ đề để test import (cần API backend)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
