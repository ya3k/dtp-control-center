import AdminUserChart from '@/components/admin/Chart/AdminUserChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

function OperatorDashboard() {
  return (
    <div className="p-6 space-y-6">
    <h1 className="text-2xl font-bold text-gray-800">Operator Dashboard</h1>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {/* Stat Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Doanh thu</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold text-gray-800">99999999</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tour đang hoạt động</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold text-gray-800">23</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tổng số</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold text-gray-800">10</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Tour</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold text-gray-800">10</p>
        </CardContent>
      </Card>
      {/* Chart */}
      <div className="w-full col-span-2 md:col-span-3 lg:col-span-4">
        <AdminUserChart />
      </div>
    </div>
  </div>
  )
}

export default OperatorDashboard;