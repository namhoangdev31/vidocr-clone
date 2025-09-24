'use client'

import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import HomePage from './components/HomePage'
import ExportPage from './components/ExportPage'
import CreatePage from './components/CreatePage'
import TestAPI from './components/TestAPI'

export default function Page() {
  const [activeTab, setActiveTab] = useState('create')

  const renderContent = () => {
    switch (activeTab) {
      case 'export':
        return <ExportPage />
      case 'create':
        return <CreatePage />
      case 'test':
        return <TestAPI />
      default:
        return <CreatePage />
    }
  }

  return (
    <div className="h-screen bg-gray-900 flex overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}