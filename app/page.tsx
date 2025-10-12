"use client";

import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import HomePage from "./components/HomePage";
import ExportPage from "./components/ExportPage";
import CreatePage from "./components/CreatePage";
import TestAPI from "./components/TestAPI";
import ProgressPage from "./components/ProgressPage";
import { AffiliateDashboard } from "./components/affiliate";
import UserSettings from "./components/UserSettings";
// Progress detail có route riêng: /progress/[id]

export default function Page() {
  const [activeTab, setActiveTab] = useState("create");

  const renderContent = () => {
    switch (activeTab) {
      case "export":
        return <ExportPage />;
      case "create":
        return <CreatePage />;
      case "progress":
        return <ProgressPage />;
      case "test":
        return <TestAPI />;
      case "affiliate":
        return <AffiliateDashboard />;
        case "user" : 
        return <UserSettings />
      default:
        return <CreatePage />;
    }
  };

  return (
    <div className="h-screen bg-gray-900 flex overflow-hidden">
      <div className="flex-1 overflow-y-auto">{renderContent()}</div>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
