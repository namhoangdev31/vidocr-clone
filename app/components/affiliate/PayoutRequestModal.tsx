"use client";

import React, { useState } from "react";
import { useAffiliateData } from "@/app/hooks/useAffiliateData";

interface PayoutRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PayoutRequestModal: React.FC<PayoutRequestModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    commissions,
    createWithdrawRequest,
    loading,
    getSettingAsNumber,
    stats,
  } = useAffiliateData();

  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "bank">("bank");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Get minimum withdraw amount from settings
  const minWithdrawAmount = getSettingAsNumber("min_withdraw_amount") || 100000;

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleSubmit = async () => {
    const requestAmount = parseFloat(amount);
    setErrorMessage("");

    if (!amount || isNaN(requestAmount)) {
      setErrorMessage("Vui lòng nhập số tiền hợp lệ");
      return;
    }

    if (requestAmount < minWithdrawAmount) {
      setErrorMessage(
        `Số tiền tối thiểu là ${formatCurrency(minWithdrawAmount)}`
      );
      return;
    }

    if (requestAmount > stats?.availableCommission!) {
      setErrorMessage("Số tiền yêu cầu vượt quá số dư hiện tại");
      return;
    }

    const availableCommissions = commissions
      .filter((c) => c.status === "available")
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

    let totalAmount = 0;
    const selectedCommissionIds: string[] = [];

    for (const commission of availableCommissions) {
      if (totalAmount + commission.amount <= requestAmount) {
        selectedCommissionIds.push(commission.id);
        totalAmount += commission.amount;
      }
      if (totalAmount >= requestAmount) break;
    }

    if (totalAmount < requestAmount) {
      setErrorMessage("Không đủ hoa hồng khả dụng để tạo yêu cầu rút tiền này");
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await createWithdrawRequest({
        amount: totalAmount, // Use actual total from selected commissions
        commissionIds: selectedCommissionIds,
      });

      if (result.success) {
        alert(
          `Đã gửi yêu cầu rút tiền ${formatCurrency(
            totalAmount
          )} thành công! Yêu cầu sẽ được xử lý trong vòng 3-5 ngày làm việc.`
        );
        onClose();
        setAmount("");
        setErrorMessage("");
      } else {
        setErrorMessage(
          result.error || "Có lỗi xảy ra khi tạo yêu cầu rút tiền"
        );
      }
    } catch (error) {
      setErrorMessage("Có lỗi xảy ra khi tạo yêu cầu rút tiền");
      console.error("Error creating withdraw request:", error);
    } finally {
      setIsSubmitting(false);
    }
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
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Số dư hiện tại:</span>
              <span className="text-lg font-bold text-green-400">
                {formatCurrency(stats?.availableCommission || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">
                Số hoa hồng khả dụng:
              </span>
              <span className="text-sm font-medium text-blue-400">
                {commissions.filter((c) => c.status === "available").length} hoa
                hồng
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-red-400 text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-sm text-gray-300 mb-2">
            Số tiền muốn rút (tối thiểu {formatCurrency(minWithdrawAmount)})
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Nhập số tiền..."
            min={minWithdrawAmount}
            max={stats?.availableCommission!}
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <label className="block text-sm text-gray-300 mb-2">
            Phương thức thanh toán
          </label>
          <div className="space-y-2">
            {/* Bank Transfer Option */}
            <label className="flex items-center p-3 bg-gray-700 rounded-lg">
              <input
                type="radio"
                name="paymentMethod"
                value="bank"
                checked={paymentMethod === "bank"}
                onChange={(e) => setPaymentMethod(e.target.value as "bank")}
                className="mr-3"
                disabled={isSubmitting}
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

        {/* Info Note */}
        <div className="mb-6">
          <div className="flex items-start p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="w-5 h-5 text-yellow-400 mr-2 mt-0.5">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-yellow-200">
                Yêu cầu rút tiền sẽ được xử lý trong vòng 3-5 ngày làm việc.
              </p>
              <p className="text-xs text-yellow-300 mt-1">
                Số tiền sẽ được chuyển đến tài khoản ngân hàng đã đăng ký trong
                hồ sơ của bạn.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || loading.createWithdrawRequest}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting || loading.createWithdrawRequest ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang xử lý...
              </>
            ) : (
              "Gửi Yêu Cầu"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
