"use client";

import React, { useEffect } from "react";
import { useAffiliateData } from "@/app/hooks/useAffiliateData";

interface AffiliateStatsProps {
  onRefresh?: () => void;
}

export const AffiliateStats: React.FC<AffiliateStatsProps> = ({
  onRefresh,
}) => {
  const { stats, loading, errors, derivedData } = useAffiliateData();

  // Format currency for Vietnamese Dong
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Show loading state
  if (loading.stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  // Show error state
  if (errors.stats) {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center">
        <p className="text-red-400 mb-4">
          Không thể tải thống kê: {errors.stats}
        </p>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        )}
      </div>
    );
  }

  // Show empty state if no data
  if (!stats) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-400">
        Không có dữ liệu thống kê
      </div>
    );
  }

  const statsData = [
    {
      title: "Tổng số lượt mời",
      value: stats.totalInvites.toString(),
      subtitle: `${stats.successfulInvites} thành công`,
      icon: (
        <svg
          className="w-8 h-8 text-blue-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
        </svg>
      ),
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Hoa hồng khả dụng",
      value: formatCurrency(stats.availableCommission),
      subtitle:
        derivedData.availableCommissions.length > 0 ? "Có thể rút" : "Chưa có",
      icon: (
        <svg
          className="w-8 h-8 text-green-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
      ),
      bgColor: "bg-green-500/10",
    },
    {
      title: "Đã rút",
      value: formatCurrency(stats.withdrawnCommission),
      subtitle: `${derivedData.withdrawnCommissions.length} lần rút`,
      icon: (
        <svg
          className="w-8 h-8 text-purple-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      ),
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Tổng thu nhập",
      value: formatCurrency(
        stats.availableCommission + stats.withdrawnCommission
      ),
      subtitle: `${derivedData.pendingCommissions.length} đang chờ`,
      icon: (
        <svg
          className="w-8 h-8 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
            clipRule="evenodd"
          />
        </svg>
      ),
      bgColor: "bg-yellow-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <div key={index} className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>{stat.icon}</div>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-gray-500 text-xs">{stat.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
