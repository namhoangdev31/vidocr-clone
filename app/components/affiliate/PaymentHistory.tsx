"use client";

import React, { useState } from "react";
import { PayoutRequestModal } from "./PayoutRequestModal";

interface Payment {
  amount: string;
  date: string;
  method: string;
  status: "completed" | "pending" | "failed";
}

export const PaymentHistory: React.FC = () => {
  const [payments] = useState<Payment[]>([
    {
      amount: "$450.00",
      date: "2024-01-01",
      method: "PayPal",
      status: "completed",
    },
    {
      amount: "$380.00",
      date: "2023-12-01",
      method: "Bank Transfer",
      status: "completed",
    },
    {
      amount: "$520.00",
      date: "2023-11-01",
      method: "PayPal",
      status: "completed",
    },
    {
      amount: "$290.00",
      date: "2023-10-01",
      method: "Bank Transfer",
      status: "pending",
    },
    {
      amount: "$340.00",
      date: "2023-09-01",
      method: "PayPal",
      status: "completed",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusBadge = (status: "completed" | "pending" | "failed") => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
            Hoàn Thành
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
            Đang Xử Lý
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
            Thất Bại
          </span>
        );
      default:
        return null;
    }
  };

  const handleRequestPayout = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      {/* Header with Request Payout Button */}
      <div className="px-6 py-6 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Lịch Sử Chi Trả</h3>
        <button
          onClick={handleRequestPayout}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Yêu Cầu Chi Trả
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-[257px]">
                Số Tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-[309px]">
                Ngày
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-[352px]">
                Phương Thức
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-[329px]">
                Trạng Thái
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {payments.map((payment, index) => (
              <tr key={index} className="hover:bg-gray-750">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-base font-medium text-white">
                    {payment.amount}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-base text-gray-400">{payment.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-base text-gray-400">
                    {payment.method}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(payment.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="px-6 py-4 border-t border-gray-700 bg-gray-750">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Tổng số giao dịch: {payments.length}
          </div>
          <div className="text-sm font-medium text-white">
            Tổng đã chi trả:{" "}
            {payments
              .filter((p) => p.status === "completed")
              .reduce(
                (sum, p) => sum + parseFloat(p.amount.replace("$", "")),
                0
              )
              .toFixed(2)}
            $
          </div>
        </div>
      </div>

      {/* Payout Request Modal */}
      <PayoutRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentBalance={2450.0}
      />
    </div>
  );
};
