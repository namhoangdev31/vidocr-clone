"use client";

import React, { useState } from "react";

interface PayoutRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
}

export const PayoutRequestModal: React.FC<PayoutRequestModalProps> = ({
  isOpen,
  onClose,
  currentBalance = 2450.0,
}) => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "bank">(
    "paypal"
  );

  const handleSubmit = () => {
    const requestAmount = parseFloat(amount);

    if (!amount || requestAmount < 50) {
      alert("Số tiền tối thiểu là $50");
      return;
    }

    if (requestAmount > currentBalance) {
      alert("Số tiền yêu cầu vượt quá số dư hiện tại");
      return;
    }

    // Logic gửi yêu cầu chi trả
    alert(
      `Đã gửi yêu cầu chi trả $${requestAmount} qua ${
        paymentMethod === "paypal" ? "PayPal" : "Chuyển khoản ngân hàng"
      }`
    );
    onClose();
    setAmount("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-[448px] max-w-[90vw] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-medium text-white">Yêu Cầu Chi Trả</h3>
        </div>

        {/* Current Balance */}
        <div className="mb-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Số dư hiện tại:</span>
              <span className="text-lg font-bold text-green-400">
                ${currentBalance.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-sm text-gray-300 mb-2">
            Số tiền muốn rút (tối thiểu $50)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Nhập số tiền..."
            min="50"
            max={currentBalance}
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <label className="block text-sm text-gray-300 mb-2">
            Phương thức thanh toán
          </label>
          <div className="space-y-2">
            {/* PayPal Option */}
            <label className="flex items-center p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === "paypal"}
                onChange={(e) => setPaymentMethod(e.target.value as "paypal")}
                className="mr-3"
              />
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-500 rounded mr-2 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.832c-.196-.196-.4-.359-.617-.489a6.075 6.075 0 0 0-1.706-.41c-.49-.044-.999-.044-1.524 0H9.609c-.524 0-.968.382-1.05.9L7.49 11.772c-.013.081-.021.264-.021.345 0 .264.172.264.264.264h2.22c4.456 0 8.008-2.132 8.956-7.454z" />
                  </svg>
                </div>
                <span className="text-white">PayPal</span>
              </div>
            </label>

            {/* Bank Transfer Option */}
            <label className="flex items-center p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="bank"
                checked={paymentMethod === "bank"}
                onChange={(e) => setPaymentMethod(e.target.value as "bank")}
                className="mr-3"
              />
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-500 rounded mr-2 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <span className="text-white">Chuyển khoản ngân hàng</span>
              </div>
            </label>
          </div>
        </div>

        {/* Info Notice */}
        <div className="mb-6">
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3">
            <div className="flex items-start">
              <svg
                className="w-4 h-4 text-yellow-400 mt-0.5 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-yellow-200">
                Yêu cầu chi trả sẽ được xử lý trong vòng 3-5 ngày làm việc.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Gửi Yêu Cầu
          </button>
        </div>
      </div>
    </div>
  );
};
