import React from 'react'
import { SettingTable } from './settingTable'

function SettingPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">System Settings</h1>
      <SettingTable />
    </div>
  )
}

export default SettingPage