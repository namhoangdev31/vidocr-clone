"use client";

import React, { useState } from "react";
import { AffiliateStats } from "./AffiliateStats";
import { ReferralLink } from "./ReferralLink";
import { RecentActivity } from "./RecentActivity";
import { MonthlyGoals } from "./MonthlyGoals";
import { AffiliateTabs } from "./AffiliateTabs";
import { ReferralsList } from "./ReferralsList";
import { PaymentHistory } from "./PaymentHistory";
import ResourcesTab from "./ResourcesTab";

export const AffiliateDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "referrals" | "payments" | "resources"
  >("dashboard");

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-8">
            {/* Referral Link Section */}
            <ReferralLink />

            {/* Stats Section */}
            <AffiliateStats />

            {/* Bottom Section with Recent Activity and Monthly Goals */}
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

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Thay Đổi Mã
        </button>
      </div>

      {/* Tab Navigation */}
      <AffiliateTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};
