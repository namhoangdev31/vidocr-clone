"use client";

import { useRouter } from "next/navigation";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const sidebarItems = [
  { id: "create", icon: "M12 6v6m0 0v6m0-6h6m-6 0H6", label: "TẠO MỚI" },
  // {
  //   id: "test",
  //   icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  //   label: "TEST API",
  // },
  {
    id: "dubbing",
    icon: "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8.464 8.464a5 5 0 000 7.072M5.636 5.636a9 9 0 000 12.728",
    label: "LỒNG TIẾNG",
  },
  { id: "progress", icon: "M13 10V3L4 14h7v7l9-11h-7z", label: "TIẾN TRÌNH" },
  {
    id: "settings",
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z",
    label: "CÀI ĐẶT",
  },
  {
    id: "audio",
    icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3",
    label: "ÂM THANH",
  },
  {
    id: "frame",
    icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
    label: "KHUNG & LOGO",
  },
  {
    id: "subtitle",
    icon: "M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4zM9 3v1h6V3H9zm1 5a1 1 0 011 1v8a1 1 0 11-2 0V9a1 1 0 011-1zm4 0a1 1 0 011 1v8a1 1 0 11-2 0V9a1 1 0 011-1z",
    label: "PHỤ ĐỀ",
  },
  {
    id: "user",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    label: "NGƯỜI DÙNG",
  },
  {
    id: "support",
    icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",
    label: "HỖ TRỢ",
  },
  {
    id: "affiliate",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    label: "CỘNG TÁC VIÊN",
  },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const router = useRouter();

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
  };

  return (
    <div className="w-32 bg-gray-900 border-l border-gray-600 flex flex-col items-center h-screen relative overflow-hidden">

      {/* Main Navigation Items */}
      <div className="flex flex-col items-center justify-start flex-1 py-8 space-y-6 overflow-y-auto min-h-0">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabClick(item.id)}
            className={`flex flex-col items-center justify-center w-20 h-16 rounded-lg transition-colors flex-shrink-0 ${
              activeTab === item.id
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
            }`}
          >
            <div className="w-6 h-6 mb-1">
              <svg
                className="w-full h-full"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={item.icon}
                />
              </svg>
            </div>
            <span className="text-[10px] text-center leading-tight px-1">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* Language Button */}
      <div className="pb-6 flex-shrink-0">
        <button className="px-3 py-2 text-[10px] text-gray-400 hover:text-gray-300 rounded transition-colors">
          ENGLISH
        </button>
      </div>
    </div>
  );
}
