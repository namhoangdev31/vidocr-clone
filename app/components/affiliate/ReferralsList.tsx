"use client";

import React, { useState } from "react";

interface Referral {
  email: string;
  signupDate: string;
  status: "active" | "pending";
  commission: string;
}

export const ReferralsList: React.FC = () => {
  const [referrals] = useState<Referral[]>([
    {
      email: "nguyen.van.a@email.com",
      signupDate: "2024-01-15",
      status: "active",
      commission: "$25.00",
    },
    {
      email: "tran.thi.b@email.com",
      signupDate: "2024-01-14",
      status: "pending",
      commission: "$25.00",
    },
    {
      email: "le.van.c@email.com",
      signupDate: "2024-01-13",
      status: "active",
      commission: "$25.00",
    },
    {
      email: "pham.minh.d@email.com",
      signupDate: "2024-01-12",
      status: "active",
      commission: "$25.00",
    },
    {
      email: "hoang.thu.e@email.com",
      signupDate: "2024-01-11",
      status: "pending",
      commission: "$25.00",
    },
    {
      email: "vo.anh.f@email.com",
      signupDate: "2024-01-10",
      status: "active",
      commission: "$25.00",
    },
  ]);

  const getStatusBadge = (status: "active" | "pending") => {
    if (status === "active") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
          Hoạt Động
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
          Chờ Xử Lý
        </span>
      );
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-700">
        <h3 className="text-lg font-medium text-white">
          Danh Sách Người Giới Thiệu
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-[459px]">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-[294px]">
                Ngày Đăng Ký
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-[257px]">
                Trạng Thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-[238px]">
                Hoa Hồng
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {referrals.map((referral, index) => (
              <tr key={index} className="hover:bg-gray-750">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-base text-white">{referral.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-base text-gray-400">
                    {referral.signupDate}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(referral.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-base font-medium text-green-400">
                    {referral.commission}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
