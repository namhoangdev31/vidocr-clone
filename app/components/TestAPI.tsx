'use client'

import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { apiClient } from '../lib/api'

export default function TestAPI() {
  const { accessToken, serverUser } = useAuthStore()
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testAPI = async () => {
    if (!accessToken) {
      setError('Không có access token')
      return
    }

    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      // Test API call với access token
      const result = await apiClient.get('/user/profile', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      
      setResponse(result.data)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Lỗi API')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Test API Integration</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-700">Thông tin User:</h3>
          <div className="bg-gray-50 p-3 rounded text-sm">
            <p><strong>Access Token:</strong> {accessToken ? 'Có' : 'Không có'}</p>
            <p><strong>Server User:</strong> {serverUser ? serverUser.name : 'Chưa có'}</p>
            <p><strong>Email:</strong> {serverUser?.email || 'N/A'}</p>
            <p><strong>Roles:</strong> {serverUser?.roles?.join(', ') || 'N/A'}</p>
          </div>
        </div>

        <button
          onClick={testAPI}
          disabled={loading || !accessToken}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Đang test...' : 'Test API Call'}
        </button>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
            <strong>Lỗi:</strong> {error}
          </div>
        )}

        {response && (
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <h4 className="font-medium text-green-800 mb-2">Response:</h4>
            <pre className="text-xs text-green-700 overflow-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
