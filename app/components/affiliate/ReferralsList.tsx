"use client";

import React from "react";
import { useAffiliateData } from "@/app/hooks/useAffiliateData";

interface Referral {
  email: string;
  signupDate: string;
  status: "invited" | "registered" | "email_confirmed";
  commission: string;
}

export const ReferralsList: React.FC = () => {
  const { invitees, loading, errors, getSetting } = useAffiliateData();

  const inviteCommissionAmount =
    getSetting("invite_commission_amount") || "20000";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(parseFloat(amount));
  };

  const referrals: Referral[] = invitees.map((invitee) => ({
    email: invitee.inviteeEmail,
    signupDate: formatDate(invitee.createdAt),
    status: invitee.status,
    commission:
      invitee.status === "email_confirmed"
        ? formatCurrency(inviteCommissionAmount)
        : "Chờ xác nhận",
  }));

  const displayReferrals = referrals;

  const getStatusBadge = (
    status: "invited" | "registered" | "email_confirmed"
  ) => {
    switch (status) {
      case "email_confirmed":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
            Đã Xác Nhận
          </span>
        );
      case "registered":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
            Đã Đăng Ký
          </span>
        );
      case "invited":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
            Đã Mời
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400">
            Không xác định
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

      {/* Loading State */}
      {loading.invitees && (
        <div className="overflow-x-auto">
          <table className="w-full">
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
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-6 bg-gray-700 rounded-full w-20"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-700 rounded w-16"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Error State */}
      {errors.invitees && !loading.invitees && (
        <div className="px-6 py-8 text-center">
          <p className="text-red-400 mb-2">
            Không thể tải danh sách người giới thiệu
          </p>
          <p className="text-sm text-gray-400">{errors.invitees}</p>
        </div>
      )}

      {/* Table - Show when not loading and no errors */}
      {!loading.invitees && !errors.invitees && (
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
              {displayReferrals.length > 0 ? (
                displayReferrals.map((referral, index) => (
                  <tr key={index} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-base text-white">
                        {referral.email}
                      </div>
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
                      <div
                        className={`text-base font-medium ${
                          referral.commission === "Chờ xác nhận"
                            ? "text-yellow-400"
                            : "text-green-400"
                        }`}
                      >
                        {referral.commission}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    Chưa có người giới thiệu nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
