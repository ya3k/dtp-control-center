'use client'
import { analysApiRequest } from '@/apiRequests/analys';
import { DailySalesChart } from '@/components/operator/Chart/daily-sales-chart';
import { NewestBookingsTable } from '@/components/operator/Chart/newest-bookings-table';
import { TopToursTable } from '@/components/operator/Chart/top-tours-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent,  } from '@/components/ui/tabs';
import { DailySale, NewestBooking, TopTour } from '@/schemaValidations/operator-analys-schema';
import {  Package } from 'lucide-react';
import React, { useEffect, useState } from 'react'

function OperatorDashboard() {
  const [dailySales, setDailySales] = useState<DailySale[]>([]);
  const [newestBookings, setNewestBookings] = useState<NewestBooking[]>([]);
  const [topTours, setTopTours] = useState<TopTour[]>([]);

  useEffect(() => {

    const fetchAnalysTOur = async () => {
      try {
        // Lấy dữ liệu từ API
        const response = await analysApiRequest.getForAd();
        const resData = await response.payload.data;
        setDailySales(resData.dailySales);
        setTopTours(resData.topTours);
        setNewestBookings(resData.newestBookings);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };

    fetchAnalysTOur();

  }, [])


  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <Package className="h-6 w-6 mr-2" />
          <h2 className="text-lg font-semibold">Bảng Điều Khiển Tour</h2>

        </div>
      </div>
      <div className="flex-1 space-y-4 p-2 sm:p-4 md:p-8 pt-6">
        <Tabs defaultValue="overview" className="space-y-4">
          
          <TabsContent value="overview" className="space-y-4">
      
            <div className="w-full">
              <Card>
                <CardHeader>
                  <CardTitle>Tổng Quan Doanh Số Hàng Ngày</CardTitle>
                  <CardDescription>Doanh số vé và doanh thu hàng ngày.</CardDescription>
                </CardHeader>
                <CardContent className="pl-0 sm:pl-2 overflow-x-auto">
                  <div className="min-w-[600px] sm:min-w-0">
                    <DailySalesChart data={dailySales} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 grid-cols-1 lg:grid-cols-12">
              <Card className="lg:col-span-5">
                <CardHeader>
                  <CardTitle>Tour được đặt nhiều nhất</CardTitle>
                  <CardDescription>Các tour có số lượng vé bán cao nhất</CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <TopToursTable data={topTours} />
                </CardContent>
              </Card>
              <Card className="lg:col-span-7">
                <CardHeader>
                  <CardTitle>Các Tour được đặt gần đây</CardTitle>
                  <CardDescription>Các đơn đặt tour mới nhất </CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <NewestBookingsTable data={newestBookings} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Nội Dung Phân Tích</CardTitle>
                  <CardDescription>Phân tích chi tiết sẽ được hiển thị ở đây</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Nội dung bảng điều khiển phân tích sắp ra mắt...</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Nội Dung Báo Cáo</CardTitle>
                  <CardDescription>Báo cáo đã tạo sẽ được hiển thị ở đây</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Nội dung bảng điều khiển báo cáo sắp ra mắt...</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default OperatorDashboard;