'use client'

import { useState } from 'react'

export default function PaymentPage() {
  const [selectedAmount, setSelectedAmount] = useState('100000')
  const [selectedPayment, setSelectedPayment] = useState('acb')

  const amountOptions = [
    { value: '100000', label: '100.000 đ', bonus: '+5%', highlighted: true },
    { value: '200000', label: '200.000 đ', bonus: '+10%' },
    { value: '500000', label: '500.000 đ', bonus: '+30%' },
    { value: '2000000', label: '2.000.000 đ', bonus: '+35%', highlighted: true },
    { value: '5000000', label: '5.000.000 đ', bonus: '+40%' },
    { value: '10000000', label: '10.000.000 đ', bonus: '+50%' }
  ]

  const calculateTotalPoints = (amount: string) => {
    const baseAmount = parseInt(amount)
    let bonusPercent = 0
    
    switch (amount) {
      case '100000': bonusPercent = 5; break
      case '200000': bonusPercent = 10; break
      case '500000': bonusPercent = 30; break
      case '2000000': bonusPercent = 35; break
      case '5000000': bonusPercent = 40; break
      case '10000000': bonusPercent = 50; break
    }
    
    return Math.floor(baseAmount * (1 + bonusPercent / 100))
  }

  // Generate VietQR URL
  const generateQRCode = (amount: string) => {
    const bankId = "970416" // ACB Bank ID
    const accountNo = "60854611"
    const template = "compact2"
    const amountValue = parseInt(amount)
    const description = "NAP09125"
    const accountName = "PHAM THE VUONG"
    
    return `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${amountValue}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(accountName)}`
  }

  return (
    <div className="min-h-screen bg-gray-900 px-48 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Amount Selection */}
          <div className="col-span-2">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">
                Add Points/ Nạp Point
              </h1>
              <p className="text-sm text-gray-400">
                AMOUNT/ SỐ TIỀN CẦN NẠP
              </p>
            </div>

            {/* Amount Options */}
            <div className="mb-8">
              <div className="grid grid-cols-3 gap-4 mb-8">
                {amountOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedAmount(option.value)}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      selectedAmount === option.value
                        ? option.highlighted
                          ? 'bg-yellow-500/10 border-yellow-500 text-white'
                          : 'bg-blue-500/10 border-blue-500 text-white'
                        : 'bg-gray-800 border-gray-600 text-white hover:border-gray-500'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold mb-1">{option.label}</div>
                      <div className="text-sm text-yellow-400">{option.bonus}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Other Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Khác</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Get an extra 50% bonus up to 50,000 Point on your first payment! (based on IP) 
                  Nhận một thêm 50% up to 100,000 Point cho lần thành toán đầu tiên theo IP
                </p>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  PAYMENT METHODS/ PHƯƠNG THỨC THANH TOÁN
                </h3>
                
                <div className="space-y-4">
                  {/* ACB Option */}
                  <label className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedPayment === 'acb' 
                      ? 'bg-blue-500/10 border-blue-500' 
                      : 'bg-gray-800 border-gray-600 hover:border-gray-500'
                  }`}>
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedPayment === 'acb' ? 'border-blue-500' : 'border-gray-500'
                      }`}>
                        {selectedPayment === 'acb' && (
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                        )}
                      </div>
                      
                      <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </div>
                      
                      <span className="text-white font-medium">ACB</span>
                    </div>
                    
                    <input
                      type="radio"
                      name="payment"
                      value="acb"
                      checked={selectedPayment === 'acb'}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="sr-only"
                    />
                  </label>

                  {/* PayPal Option */}
                  <label className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedPayment === 'paypal' 
                      ? 'bg-blue-500/10 border-blue-500' 
                      : 'bg-gray-800 border-gray-600 hover:border-gray-500'
                  }`}>
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedPayment === 'paypal' ? 'border-blue-500' : 'border-gray-500'
                      }`}>
                        {selectedPayment === 'paypal' && (
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                        )}
                      </div>
                      
                      <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.421c-.962-.518-2.69-.624-4.888-.624H9.78a.641.641 0 0 0-.633.525l-.694 4.404-.069.434c.014-.02.03-.038.049-.054a.641.641 0 0 1 .484-.21h2.19c4.298 0 7.664-1.747 8.647-6.797.03-.149.054-.294.077-.437-.045-.204-.108-.403-.189-.594z"/>
                        </svg>
                      </div>
                      
                      <span className="text-white font-medium">PayPal</span>
                    </div>
                    
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={selectedPayment === 'paypal'}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Summary */}
          <div className="col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 sticky top-8">
              {/* Amount Display */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full"></div>
                  <span className="text-lg font-medium text-white">
                    {parseInt(selectedAmount).toLocaleString()}
                  </span>
                </div>
                <span className="text-gray-400">VND</span>
              </div>

              {/* Total Points */}
              <div className="border-t border-gray-600 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Points/ Tổng Points</span>
                  <span className="text-lg font-bold text-white">
                    {calculateTotalPoints(selectedAmount).toLocaleString()} Points
                  </span>
                </div>
              </div>

              {/* QR Code and Bank Info */}
              <div className="mb-6">
                <div className="flex gap-4">
                  {/* QR Code */}
                  <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center p-2">
                    <img 
                      src={generateQRCode(selectedAmount)}
                      alt="VietQR Code" 
                      className="w-full h-full object-contain rounded"
                      onError={(e) => {
                        // Fallback if QR fails to load
                        e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='176' height='176' viewBox='0 0 176 176'%3E%3Crect width='176' height='176' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%236b7280'%3EQR Code%3C/text%3E%3C/svg%3E`
                      }}
                    />
                  </div>
                  
                  {/* Bank Details */}
                  <div className="flex-1">
                    <div className="space-y-2 text-sm">
                      <div className="text-gray-400">Số tài khoản: 60854611</div>
                      <div className="text-red-400 font-medium">Tên tài khoản: PHAM THE VUONG</div>
                      <div className="space-y-1">
                        <div className="text-gray-400">Số tiền: {parseInt(selectedAmount).toLocaleString()} VND</div>
                        <div className="text-gray-400">Nội dung: NAP09125</div>
                        <div className="text-xs text-gray-500 mt-2">
                          Ngân hàng: ACB (970416)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Info */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-4 h-4">
                  <svg className="w-full h-full text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-white font-medium text-sm">Safe & Secure Payment</div>
                  <div className="text-gray-400 text-xs">100% secure checkout powered by ACB & PayPal</div>
                </div>
              </div>

              {/* Payment Icons */}
              <div className="flex gap-2 justify-center">
                <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M1.5 4.5h21v15h-21z"/>
                  </svg>
                </div>
                <div className="w-8 h-6 bg-red-600 rounded flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M1.5 4.5h21v15h-21z"/>
                  </svg>
                </div>
                <div className="w-8 h-6 bg-blue-800 rounded flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M1.5 4.5h21v15h-21z"/>
                  </svg>
                </div>
                <div className="w-8 h-6 bg-gray-600 rounded flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M1.5 4.5h21v15h-21z"/>
                  </svg>
                </div>
                <div className="w-8 h-6 bg-blue-700 rounded flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M1.5 4.5h21v15h-21z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}