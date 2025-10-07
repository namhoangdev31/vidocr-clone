"use client";

import React, { useState, useEffect } from "react";
import { useAffiliateData } from "@/app/hooks/useAffiliateData";

export const ReferralLink: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const { affiliateLink, loading, errors, fetchAffiliateLink } =
    useAffiliateData();

  useEffect(() => {
    fetchAffiliateLink();
  }, [fetchAffiliateLink]);

  const referralCode = affiliateLink?.affiliateCode || "";
  const referralUrl = affiliateLink?.affiliateLink || "";

  const handleCopyLink = async () => {
    if (!referralUrl) {
      console.error("No referral URL available");
      return;
    }

    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleShare = (platform: "facebook" | "twitter") => {
    if (!referralUrl) {
      console.error("No referral URL available for sharing");
      return;
    }

    const text = `Khám phá công cụ AI tuyệt vời này! ${referralUrl}`;
    let shareUrl = "";

    if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        referralUrl
      )}`;
    } else if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}`;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const handleCopyShareText = async () => {
    if (!referralUrl) {
      console.error("No referral URL available for sharing");
      return;
    }

    const shareText = `🚀 Khám phá công cụ AI tuyệt vời này! Dịch video tự động, lồng tiếng AI và nhiều tính năng khác. Đăng ký ngay với link của tôi: ${referralUrl}`;
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-8">
      {/* Header */}
      <h3 className="text-lg font-medium text-white mb-4">
        Link Giới Thiệu Của Bạn
      </h3>

      {/* Loading State */}
      {loading.affiliateLink && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span className="text-gray-300 ml-3">Đang tải link affiliate...</span>
        </div>
      )}

      {/* Error State */}
      {errors.affiliateLink && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-red-300 text-sm">{errors.affiliateLink}</span>
          </div>
          <button
            onClick={fetchAffiliateLink}
            className="mt-2 text-red-400 hover:text-red-300 underline text-sm"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Link Display and Copy Button */}
      {!loading.affiliateLink && !errors.affiliateLink && affiliateLink && (
        <>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1 bg-gray-700 rounded-lg px-4 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-gray-300 font-mono text-lg">
                  {referralUrl.split(referralCode)[0]}
                </span>
                <span className="text-white font-mono text-lg font-medium">
                  {referralCode}
                </span>
              </div>
              <button
                onClick={handleCopyLink}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
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
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                {copied ? "Đã Copy!" : "Sao Chép Link"}
              </button>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-400 mb-4">
            Chia sẻ link này với bạn bè để họ đăng ký qua mã giới thiệu của bạn
            và nhận hoa hồng khi họ thanh toán gói trả phí lần đầu tiên
          </p>

          {/* Share Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => handleShare("facebook")}
              className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Chia sẻ Facebook
            </button>

            <button
              onClick={() => handleShare("twitter")}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
              Chia sẻ Twitter
            </button>

            <button
              onClick={handleCopyShareText}
              className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
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
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy Text Chia Sẻ
            </button>
          </div>
        </>
      )}
    </div>
  );
};
