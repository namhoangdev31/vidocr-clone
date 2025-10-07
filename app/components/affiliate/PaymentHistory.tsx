"use client";

import React, { useState } from "react";
import { PayoutRequestModal } from "./PayoutRequestModal";
import { useAffiliateData } from "@/app/hooks/useAffiliateData";

interface Payment {
  amount: string;
  date: string;
  method: string;
  status: "pending" | "success" | "rejected";
}

export const PaymentHistory: React.FC = () => {
  const { withdrawRequests, loading, errors, stats } = useAffiliateData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const payments: Payment[] = withdrawRequests.map((request) => ({
    amount: formatCurrency(request.amount),
    date: formatDate(request.requestedAt),
    method: "Chuyển khoản ngân hàng",
    status: request.status,
  }));

  const displayPayments = payments.length > 0 ? payments : [];

  const getStatusBadge = (status: "pending" | "success" | "rejected") => {
    switch (status) {
      case "success":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
            Thành Công
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
            Đang Xử Lý
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
            Bị Từ Chối
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

      {/* Loading State */}
      {loading.withdrawRequests && (
        <div className="overflow-x-auto">
          <table className="w-full">
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
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-700 rounded w-20"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-700 rounded w-24"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-700 rounded w-32"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-6 bg-gray-700 rounded-full w-20"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Error State */}
      {errors.withdrawRequests && !loading.withdrawRequests && (
        <div className="px-6 py-8 text-center">
          <p className="text-red-400 mb-2">Không thể tải lịch sử chi trả</p>
          <p className="text-sm text-gray-400">{errors.withdrawRequests}</p>
        </div>
      )}

      {/* Table - Show when not loading and no errors */}
      {!loading.withdrawRequests && !errors.withdrawRequests && (
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
              {displayPayments.length > 0 ? (
                displayPayments.map((payment, index) => (
                  <tr key={index} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-base font-medium text-white">
                        {payment.amount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-base text-gray-400">
                        {payment.date}
                      </div>
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
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    Chưa có lịch sử chi trả nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Footer */}
      {!loading.withdrawRequests && !errors.withdrawRequests && (
        <div className="px-6 py-4 border-t border-gray-700 bg-gray-750">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              Tổng số giao dịch: {displayPayments.length}
            </div>
            <div className="text-sm font-medium text-white">
              Tổng đã chi trả:{" "}
              {formatCurrency(
                displayPayments
                  .filter((p) => p.status === "success")
                  .reduce((sum, p) => {
                    // Extract number from VND formatted string
                    const amount = parseFloat(p.amount.replace(/[^\d]/g, ""));
                    return sum + amount;
                  }, 0)
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payout Request Modal */}
      <PayoutRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
