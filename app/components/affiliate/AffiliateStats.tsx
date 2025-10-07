"use client";

import React from "react";

interface StatCardProps {
  title: string;
  value: string;
  percentage: string;
  isPositive: boolean;
  icon: React.ReactNode;
  bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  percentage,
  isPositive,
  icon,
  bgColor,
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 w-full h-[168px] flex flex-col">
      {/* Header with icon and percentage */}
      <div className="flex justify-between items-center mb-1">
        <div
          className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}
        >
          {icon}
        </div>
        <span
          className={`text-sm font-medium ${
            isPositive ? "text-green-400" : "text-red-400"
          }`}
        >
          {percentage}
        </span>
      </div>

      {/* Value */}
      <div className="mb-1">
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>

      {/* Title */}
      <p className="text-sm text-gray-400">{title}</p>
    </div>
  );
};

export const AffiliateStats: React.FC = () => {
  const stats = [
    {
      title: "Tổng Hoa Hồng",
      value: "$2,450.00",
      percentage: "+12.5%",
      isPositive: true,
      bgColor: "bg-gray-600",
      icon: (
        <svg
          className="w-6 h-6 text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
    },
    {
      title: "Người Dùng Giới Thiệu",
      value: "147",
      percentage: "+8",
      isPositive: true,
      bgColor: "bg-gray-600",
      icon: (
        <svg
          className="w-6 h-6 text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      title: "Tỷ Lệ Chuyển Đổi",
      value: "3.2%",
      percentage: "+0.5%",
      isPositive: true,
      bgColor: "bg-gray-600",
      icon: (
        <svg
          className="w-6 h-6 text-purple-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      title: "Hoa Hồng Tháng Này",
      value: "$580.00",
      percentage: "+23%",
      isPositive: true,
      bgColor: "bg-gray-600",
      icon: (
        <svg
          className="w-6 h-6 text-orange-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          percentage={stat.percentage}
          isPositive={stat.isPositive}
          icon={stat.icon}
          bgColor={stat.bgColor}
        />
      ))}
    </div>
  );
};
