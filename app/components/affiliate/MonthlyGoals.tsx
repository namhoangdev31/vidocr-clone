"use client";

import React from "react";

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
  const goals = [
    {
      label: "Người Dùng Mới",
      current: 8,
      target: 15,
      percentage: 53,
      color: "bg-blue-600",
    },
    {
      label: "Hoa Hồng ($580/$1000)",
      current: 580,
      target: 1000,
      percentage: 58,
      color: "bg-green-600",
    },
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-[608px]">
      {/* Header */}
      <h3 className="text-lg font-medium text-white mb-4">
        Mục Tiêu Tháng Này
      </h3>

      {/* Progress Bars */}
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
