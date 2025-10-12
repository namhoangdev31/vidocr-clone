'use client'

import { useState } from 'react'
import { CreditCard, Shield, CheckCircle } from 'lucide-react'
import { apiClient } from '@/app/lib/api'

type PointPackage = {
  id: string
  amount: number
  bonus: number
  label: string
}

const pointPackages: PointPackage[] = [
  { id: '1', amount: 100000, bonus: 5, label: '100.000 ₫ (+5%)' },
  { id: '2', amount: 200000, bonus: 10, label: '200.000 ₫ (+10%)' },
  { id: '3', amount: 500000, bonus: 30, label: '500.000 ₫ (+30%)' },
  { id: '4', amount: 2000000, bonus: 35, label: '2.000.000 ₫ (+35%)' },
  { id: '5', amount: 5000000, bonus: 40, label: '5.000.000 ₫ (+40%)' },
  { id: '6', amount: 10000000, bonus: 50, label: '10.000.000 ₫ (+50%)' },
]

type PaymentMethod = 'ACB' | 'PayPal'

interface NapPointProps {
  onClose?: () => void
}

export default function NapPoint({ onClose }: NapPointProps) {
  const [selectedPackage, setSelectedPackage] = useState<PointPackage>(pointPackages[0])
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('ACB')
  const [billCode, setBillCode] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [copyMessage, setCopyMessage] = useState<string | null>(null)

  const totalPoints = Math.floor(selectedPackage.amount + (selectedPackage.amount * selectedPackage.bonus / 100))

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyMessage(`${label} đã được copy!`)
      setTimeout(() => setCopyMessage(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleCreateDeposit = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      const response = await apiClient.post('/payment/deposit', {
        money: selectedPackage.amount
      })

      const data = response.data
      setBillCode(data.bill_code)
      setSuccess(`Deposit created successfully! Bill code: ${data.bill_code}`)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create deposit')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckBill = async () => {
    if (!billCode) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await apiClient.get(`/payment/check-bill?bill_code=${billCode}`)
      const data = response.data

      if (data.status === 'completed') {
        setSuccess(`Payment completed! You received ${data.points} points.`)
      } else if (data.status === 'failed') {
        setError('Payment failed. Please try again.')
      } else {
        setSuccess('Payment is still pending. Please wait...')
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to check bill status')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Add Points / Nạp Point</h1>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
              >
                Close
              </button>
            )}
          </div>

          {/* Amount Selection */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-300 mb-4">AMOUNT / SỐ TIỀN CẦN NẠP</h2>
            <div className="grid grid-cols-3 gap-4">
              {pointPackages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedPackage.id === pkg.id
                      ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600 text-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-semibold">{pkg.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Bonus Information */}
          <div className="mb-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">Khác</h3>
            <p className="text-sm text-gray-300">
              Get an extra 50% bonus up to 50,000 Point on your first payment! (based on IP)<br />
              Nhận một thêm 50% up to 100,000 Point cho lần thành toán đầu tiên theo IP
            </p>
          </div>

          {/* Payment Methods */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-300 mb-4">PAYMENT METHODS / PHƯƠNG THỨC THANH TOÁN</h2>
            <div className="space-y-3">
              <label className="flex items-center p-4 border border-gray-700 rounded-lg cursor-pointer hover:border-gray-600">
                <input
                  type="radio"
                  name="payment"
                  value="ACB"
                  checked={paymentMethod === 'ACB'}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="mr-3 text-blue-500"
                />
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded mr-3 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-300">ACB</span>
                </div>
              </label>
              
              <label className="flex items-center p-4 border border-gray-700 rounded-lg cursor-pointer hover:border-gray-600">
                <input
                  type="radio"
                  name="payment"
                  value="PayPal"
                  checked={paymentMethod === 'PayPal'}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="mr-3 text-blue-500"
                />
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded mr-3 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">PP</span>
                  </div>
                  <span className="text-gray-300">PayPal</span>
                </div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-8">
            <button
              onClick={handleCreateDeposit}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-600 mr-4"
            >
              {isLoading ? 'Creating...' : 'Create Deposit'}
            </button>
            
            {billCode && (
              <button
                onClick={handleCheckBill}
                disabled={isLoading}
                className="px-6 py-3 bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-600"
              >
                {isLoading ? 'Checking...' : 'Check Bill Status'}
              </button>
            )}
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-4 bg-green-900/20 border border-green-500/30 rounded-lg text-green-300">
              {success}
            </div>
          )}
          
          {copyMessage && (
            <div className="mb-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg text-blue-300 text-sm">
              {copyMessage}
            </div>
          )}
        </div>
      </div>

      {/* Payment Summary */}
      <div className="w-96 bg-gray-800 border-l border-gray-700 p-6">
        <div className="mb-6">
          {/* Amount Display Card */}
          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-4">
              </div>
              <div className="text-white font-bold text-xl">{selectedPackage.amount.toLocaleString()}</div>
              <div className="text-gray-400 ml-2">VND</div>
            </div>
          </div>
          
          <div className="text-lg font-semibold text-white">
            Total Points / Tổng {totalPoints.toLocaleString()} Points
          </div>
        </div>

        {/* QR Code */}
        <div className="mb-6">
          <div className="w-48 h-48 bg-white rounded-lg mx-auto flex items-center justify-center border-2 border-gray-300">
            {billCode ? (
              <div className="text-center p-4">
                {/* QR Code Pattern */}
                <div className="w-32 h-32 bg-gray-100 rounded mb-3 flex items-center justify-center">
                  <div className="grid grid-cols-8 gap-1">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-sm ${
                          Math.random() > 0.5 ? 'bg-black' : 'bg-white'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-gray-600 text-xs font-medium">{billCode}</div>
                <div className="text-gray-500 text-xs mt-1">Scan để thanh toán</div>
              </div>
            ) : (
              <div className="text-center p-4">
                <div className="w-32 h-32 bg-gray-100 rounded mb-3 flex items-center justify-center">
                  <div className="text-gray-400 text-xs text-center">
                    QR Code<br />
                    sẽ hiển thị<br />
                    sau khi tạo deposit
                  </div>
                </div>
                <div className="text-gray-500 text-xs">Nhấn "Create Deposit" để tạo QR</div>
              </div>
            )}
          </div>
        </div>

        {/* Bank Transfer Details */}
        <div className="mb-6 p-4 bg-gray-700 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Thông tin chuyển khoản</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Số tài khoản:</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-mono">60854611</span>
                <button
                  onClick={() => handleCopy('60854611', 'Số tài khoản')}
                  className="text-blue-400 hover:text-blue-300 text-xs"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Tên tài khoản:</span>
              <div className="flex items-center gap-2">
                <span className="text-white">PHAM THE VUONG</span>
                <button
                  onClick={() => handleCopy('PHAM THE VUONG', 'Tên tài khoản')}
                  className="text-blue-400 hover:text-blue-300 text-xs"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Số tiền:</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">{selectedPackage.amount.toLocaleString()} VND</span>
                <button
                  onClick={() => handleCopy(selectedPackage.amount.toString(), 'Số tiền')}
                  className="text-blue-400 hover:text-blue-300 text-xs"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Nội dung:</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-mono">{billCode || 'NAP09125'}</span>
                <button
                  onClick={() => handleCopy(billCode || 'NAP09125', 'Nội dung')}
                  className="text-blue-400 hover:text-blue-300 text-xs"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Information */}
        <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
          <div className="flex items-center mb-2">
            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
            <span className="text-green-300 font-semibold">Safe & Secure Payment</span>
          </div>
          <p className="text-sm text-gray-300 mb-3">
            100% secure checkout powered by ACB & PayPal
          </p>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-5 bg-blue-600 rounded text-xs flex items-center justify-center text-white">VISA</div>
            <div className="w-8 h-5 bg-red-600 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <div className="w-8 h-5 bg-gray-600 rounded text-xs flex items-center justify-center text-white">ACB</div>
            <div className="w-8 h-5 bg-blue-500 rounded text-xs flex items-center justify-center text-white">PP</div>
          </div>
        </div>
      </div>

      {/* Right Navigation */}
      <div className="w-16 bg-gray-800 border-l border-gray-700 flex flex-col items-center py-6">
        <div className="space-y-6">
          <button className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600">
            <span className="text-xs text-gray-300">XUẤT BẢN</span>
          </button>
          <button className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600">
            <span className="text-xs text-gray-300">TẠO MỚI</span>
          </button>
          <button className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600">
            <span className="text-xs text-gray-300">LỒNG TIẾNG</span>
          </button>
          <button className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600">
            <span className="text-xs text-gray-300">TIẾN TRÌNH</span>
          </button>
          <button className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600">
            <span className="text-xs text-gray-300">CÀI ĐẶT</span>
          </button>
          <button className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600">
            <span className="text-xs text-gray-300">ÂM THANH</span>
          </button>
          <button className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600">
            <span className="text-xs text-gray-300">KHUNG & LOGO</span>
          </button>
          <button className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600">
            <span className="text-xs text-gray-300">PHỤ ĐỀ</span>
          </button>
          <button className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600">
            <span className="text-xs text-gray-300">NGƯỜI DÙNG</span>
          </button>
          <button className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600">
            <span className="text-xs text-gray-300">HỖ TRỢ</span>
          </button>
        </div>
        
        <div className="mt-auto">
          <button className="text-xs text-gray-400 hover:text-gray-300">ENGLISH</button>
        </div>
      </div>
    </div>
  )
}
