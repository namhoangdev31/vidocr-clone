'use client'

import { useState } from 'react'
import { useGlossary } from '@/app/hooks/useGlossary'
import { CreateGlossaryRequest, GlossaryEntry } from '@/app/lib/api/videoTranslationService'

interface GlossaryManagerProps {
  isOpen: boolean
  onClose: () => void
  onGlossarySelected?: (glossaryId: string) => void
}

export default function GlossaryManager({
  isOpen,
  onClose,
  onGlossarySelected
}: GlossaryManagerProps) {
  const { glossaries, createGlossary, isLoading, error } = useGlossary()
  
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newGlossary, setNewGlossary] = useState<CreateGlossaryRequest>({
    name: '',
    description: '',
    sourceLang: 'en',
    targetLang: 'vi',
    entries: [],
    isPublic: false
  })
  const [newEntry, setNewEntry] = useState<GlossaryEntry>({
    source: '',
    target: '',
    priority: 1
  })

  const handleCreateGlossary = async () => {
    if (!newGlossary.name || newGlossary.entries.length === 0) {
      alert('Vui lòng nhập tên glossary và ít nhất một entry')
      return
    }

    const result = await createGlossary(newGlossary)
    if (result) {
      setShowCreateForm(false)
      setNewGlossary({
        name: '',
        description: '',
        sourceLang: 'en',
        targetLang: 'vi',
        entries: [],
        isPublic: false
      })
    }
  }

  const addEntry = () => {
    if (newEntry.source && newEntry.target) {
      setNewGlossary(prev => ({
        ...prev,
        entries: [...prev.entries, newEntry]
      }))
      setNewEntry({ source: '', target: '', priority: 1 })
    }
  }

  const removeEntry = (index: number) => {
    setNewGlossary(prev => ({
      ...prev,
      entries: prev.entries.filter((_, i) => i !== index)
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-medium text-white">Quản lý Glossary</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Create New Glossary Button */}
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-medium text-white">Glossaries hiện có</h4>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {showCreateForm ? 'Hủy' : 'Tạo Glossary mới'}
            </button>
          </div>

          {/* Create Form */}
          {showCreateForm && (
            <div className="bg-gray-700 rounded-lg p-4 space-y-4">
              <h5 className="text-md font-medium text-white">Tạo Glossary mới</h5>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Tên glossary</label>
                  <input
                    type="text"
                    value={newGlossary.name}
                    onChange={(e) => setNewGlossary(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-gray-600 text-white rounded-lg px-3 py-2"
                    placeholder="Tên glossary"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Mô tả</label>
                  <input
                    type="text"
                    value={newGlossary.description}
                    onChange={(e) => setNewGlossary(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-gray-600 text-white rounded-lg px-3 py-2"
                    placeholder="Mô tả"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Ngôn ngữ nguồn</label>
                  <select
                    value={newGlossary.sourceLang}
                    onChange={(e) => setNewGlossary(prev => ({ ...prev, sourceLang: e.target.value }))}
                    className="w-full bg-gray-600 text-white rounded-lg px-3 py-2"
                  >
                    <option value="en">English</option>
                    <option value="vi">Vietnamese</option>
                    <option value="zh">Chinese</option>
                    <option value="ja">Japanese</option>
                    <option value="ko">Korean</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Ngôn ngữ đích</label>
                  <select
                    value={newGlossary.targetLang}
                    onChange={(e) => setNewGlossary(prev => ({ ...prev, targetLang: e.target.value }))}
                    className="w-full bg-gray-600 text-white rounded-lg px-3 py-2"
                  >
                    <option value="en">English</option>
                    <option value="vi">Vietnamese</option>
                    <option value="zh">Chinese</option>
                    <option value="ja">Japanese</option>
                    <option value="ko">Korean</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newGlossary.isPublic}
                    onChange={(e) => setNewGlossary(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="rounded"
                  />
                  <label className="text-sm text-gray-300">Public</label>
                </div>
              </div>

              {/* Add Entry */}
              <div className="border-t border-gray-600 pt-4">
                <h6 className="text-sm font-medium text-white mb-3">Thêm từ vựng</h6>
                <div className="grid grid-cols-4 gap-3">
                  <input
                    type="text"
                    value={newEntry.source}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, source: e.target.value }))}
                    className="bg-gray-600 text-white rounded-lg px-3 py-2"
                    placeholder="Từ nguồn"
                  />
                  <input
                    type="text"
                    value={newEntry.target}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, target: e.target.value }))}
                    className="bg-gray-600 text-white rounded-lg px-3 py-2"
                    placeholder="Từ đích"
                  />
                  <input
                    type="number"
                    value={newEntry.priority}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                    className="bg-gray-600 text-white rounded-lg px-3 py-2"
                    placeholder="Ưu tiên"
                    min="1"
                    max="10"
                  />
                  <button
                    onClick={addEntry}
                    className="bg-green-600 text-white rounded-lg px-3 py-2 hover:bg-green-700"
                  >
                    Thêm
                  </button>
                </div>
              </div>

              {/* Entries List */}
              {newGlossary.entries.length > 0 && (
                <div className="border-t border-gray-600 pt-4">
                  <h6 className="text-sm font-medium text-white mb-3">Danh sách từ vựng</h6>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {newGlossary.entries.map((entry, index) => (
                      <div key={index} className="flex items-center gap-3 bg-gray-600 rounded-lg px-3 py-2">
                        <span className="text-white flex-1">{entry.source}</span>
                        <span className="text-gray-300">→</span>
                        <span className="text-white flex-1">{entry.target}</span>
                        <span className="text-gray-400 text-sm">P{entry.priority}</span>
                        <button
                          onClick={() => removeEntry(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleCreateGlossary}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-500"
                >
                  {isLoading ? 'Đang tạo...' : 'Tạo Glossary'}
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-3">
              <div className="text-red-300 text-sm">{error}</div>
            </div>
          )}

          {/* Glossaries List */}
          <div className="space-y-3">
            {glossaries.map((glossary) => (
              <div key={glossary.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-white">{glossary.name}</h5>
                    <p className="text-sm text-gray-400">{glossary.description}</p>
                    <div className="text-xs text-gray-500 mt-1">
                      {glossary.sourceLang} → {glossary.targetLang} • {glossary.entries.length} entries
                      {glossary.isPublic && ' • Public'}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onGlossarySelected?.(glossary.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Chọn
                    </button>
                    <button className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700">
                      Xem
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {glossaries.length === 0 && !showCreateForm && (
            <div className="text-center py-8 text-gray-400">
              Chưa có glossary nào. Tạo glossary đầu tiên của bạn!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
