"use client";

import React from "react";

interface AffiliateTabsProps {
  activeTab: "dashboard" | "referrals" | "payments" | "resources";
  onTabChange: (
    tab: "dashboard" | "referrals" | "payments" | "resources"
  ) => void;
}

export const AffiliateTabs: React.FC<AffiliateTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: "dashboard" as const, label: "Dashboard" },
    { id: "referrals" as const, label: "Người Giới Thiệu" },
    { id: "payments" as const, label: "Lịch Sử Chi Trả" },
    { id: "resources" as const, label: "Tài Nguyên" },
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-1 mb-8 inline-flex gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:text-white hover:bg-gray-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
