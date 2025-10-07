"use client";

import React from "react";
import { useAffiliateData } from "@/app/hooks/useAffiliateData";

interface ProgressBarProps {
  label: string;
  current: number;
  target: number;
  percentage: number;
  color: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  current,
  target,
  percentage,
  color,
}) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-400">
          {label} ({current}/{target})
        </span>
        <span className="text-sm text-white">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

export const MonthlyGoals: React.FC = () => {
  const { stats, derivedData, loading, getSetting, getSettingAsNumber } =
    useAffiliateData();

  // Get settings values
  const inviteCommissionAmount = getSettingAsNumber("invite_commission_amount");
  const servicePurchaseCommission = getSettingAsNumber(
    "service_purchase_commission"
  );
  const minWithdrawAmount = getSettingAsNumber("min_withdraw_amount");
  const minInviteCompleted = getSettingAsNumber("min_invite_completed");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const currentInvites = stats?.successfulInvites || 0;
  const currentCommission = stats?.availableCommission || 0;

  const inviteTarget = minInviteCompleted ?? 0;
  const commissionTarget = minWithdrawAmount ?? 0;

  const goals = [
    {
      label: "Người Dùng Mới",
      current: currentInvites,
      target: inviteTarget,
      percentage:
        inviteTarget > 0
          ? Math.round((currentInvites / inviteTarget) * 100)
          : 0,
      color: "bg-blue-600",
    },
    {
      label: `Hoa Hồng (${formatCurrency(currentCommission)}/${formatCurrency(
        commissionTarget
      )})`,
      current: currentCommission,
      target: commissionTarget,
      percentage:
        commissionTarget > 0
          ? Math.round((currentCommission / commissionTarget) * 100)
          : 0,
      color: "bg-green-600",
    },
  ];

  if (loading.settings || loading.stats) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-[608px]">
        <h3 className="text-lg font-medium text-white mb-4">
          Mục Tiêu Tháng Này
        </h3>
        <div className="space-y-4">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex justify-between items-center mb-2">
                <div className="h-4 bg-gray-700 rounded w-32"></div>
                <div className="h-4 bg-gray-700 rounded w-12"></div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gray-600 h-2 rounded-full w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-[608px]">
      <h3 className="text-lg font-medium text-white mb-4">
        Mục Tiêu Tháng Này
      </h3>

      <div className="space-y-4">
        {goals.map((goal, index) => (
          <ProgressBar
            key={index}
            label={goal.label}
            current={goal.current}
            target={goal.target}
            percentage={goal.percentage}
            color={goal.color}
          />
        ))}
      </div>
    </div>
  );
};
