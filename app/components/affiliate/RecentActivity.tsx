"use client";

import React from "react";
import { useAffiliateData } from "@/app/hooks/useAffiliateData";

interface ActivityItem {
  email: string;
  date: string;
  commission: string;
}

export const RecentActivity: React.FC = () => {
  const {
    stats,
    derivedData,
    loading,
    getSetting,
    getSettingAsNumber,
    invitees,
    errors,
  } = useAffiliateData();

  // Get settings values
  const inviteCommissionAmount =
    getSettingAsNumber("invite_commission_amount") || 20000;
  const servicePurchaseCommission =
    getSettingAsNumber("service_purchase_commission") || 5;

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Convert invitees to activity format
  const activities: ActivityItem[] = invitees.slice(0, 5).map((invitee) => ({
    email: invitee.inviteeEmail,
    date: formatDate(invitee.createdAt),
    commission:
      invitee.status === "email_confirmed"
        ? formatCurrency(inviteCommissionAmount)
        : "Chờ xác nhận",
  }));

  return (
    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-[608px]">
      {/* Header */}
      <h3 className="text-lg font-medium text-white mb-4">Hoạt Động Gần Đây</h3>

      {/* Loading State */}
      {loading.invitees && (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-700 rounded-lg p-3 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-600 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-gray-600 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {errors.invitees && !loading.invitees && (
        <div className="text-center text-gray-400 py-4">
          <p>Không thể tải hoạt động gần đây</p>
          <p className="text-sm text-red-400 mt-1">{errors.invitees}</p>
        </div>
      )}

      {/* Activity List */}
      {!loading.invitees && !errors.invitees && (
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <div
                key={index}
                className="bg-gray-700 rounded-lg p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>

                  {/* User Info */}
                  <div className="flex flex-col">
                    <p className="text-sm text-white">{activity.email}</p>
                    <p className="text-xs text-gray-400">{activity.date}</p>
                  </div>
                </div>

                {/* Commission */}
                <span
                  className={`font-medium ${
                    activity.commission === "Chờ xác nhận"
                      ? "text-yellow-400"
                      : "text-green-400"
                  }`}
                >
                  {activity.commission}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-4">
              <p>Chưa có hoạt động nào</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
