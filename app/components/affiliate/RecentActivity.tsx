"use client";

import React from "react";

interface ActivityItem {
  email: string;
  date: string;
  commission: string;
}

export const RecentActivity: React.FC = () => {
  const activities: ActivityItem[] = [
    {
      email: "nguyen.van.a@email.com",
      date: "2024-01-15",
      commission: "$25.00",
    },
    {
      email: "tran.thi.b@email.com",
      date: "2024-01-14",
      commission: "$25.00",
    },
    {
      email: "le.van.c@email.com",
      date: "2024-01-13",
      commission: "$25.00",
    },
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-[608px]">
      {/* Header */}
      <h3 className="text-lg font-medium text-white mb-4">Hoạt Động Gần Đây</h3>

      {/* Activity List */}
      <div className="space-y-4">
        {activities.map((activity, index) => (
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
            <span className="text-green-400 font-medium">
              {activity.commission}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
