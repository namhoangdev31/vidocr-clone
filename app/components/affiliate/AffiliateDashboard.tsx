"use client";

import React, { useState, useEffect } from "react";
import { AffiliateStats } from "./AffiliateStats";
import { ReferralLink } from "./ReferralLink";
import { RecentActivity } from "./RecentActivity";
import { MonthlyGoals } from "./MonthlyGoals";
import { AffiliateTabs } from "./AffiliateTabs";
import { PaymentHistory } from "./PaymentHistory";
import ResourcesTab from "./ResourcesTab";
import { useAffiliateData } from "@/app/hooks/useAffiliateData";
import { ReferralsList } from "./ReferralsList";

export const AffiliateDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "referrals" | "payments" | "resources"
  >("dashboard");
  const { fetchAllData, isLoading, hasErrors } = useAffiliateData();

  // Fetch all affiliate data when component mounts
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-8">
            <ReferralLink />

            <AffiliateStats onRefresh={fetchAllData} />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <RecentActivity />
              <MonthlyGoals />
            </div>
          </div>
        );
      case "referrals":
        return <ReferralsList />;
      case "payments":
        return <PaymentHistory />;
      case "resources":
        return <ResourcesTab />;
      default:
        return null;
    }
  };

  // Show global loading state for initial load
  if (isLoading && activeTab === "dashboard") {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải dữ liệu affiliate...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Chương Trình Affiliate
          </h1>
          <p className="text-gray-400">
            Quản lý mã giới thiệu và theo dõi hoa hồng của bạn
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
          Thay Đổi Mã
        </button>
      </div>

      {/* Navigation Tabs */}
      <AffiliateTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Global Error Display */}
      {hasErrors && (
        <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              Một số dữ liệu có thể không được tải đầy đủ. Hãy thử refresh
              trang.
            </span>
          </div>
        </div>
      )}

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};
