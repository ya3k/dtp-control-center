import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketKind } from '@/schemaValidations/crud-tour.schema';
import useTourStore from '@/store/tourStore';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import React, { useState } from 'react';

const ticketKindLabels: Record<TicketKind, string> = {
  [TicketKind.Adult]: "Người lớn",
  [TicketKind.Child]: "Trẻ em",
  [TicketKind.PerGroupOfThree]: "Nhóm 3 người",
  [TicketKind.PerGroupOfFive]: "Nhóm 5 người",
  [TicketKind.PerGroupOfSeven]: "Nhóm 7 người",
  [TicketKind.PerGroupOfTen]: "Nhóm 10 người",
};

export default function ReviewForm() {
  const { submitForm, prevStep, formData } = useTourStore();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    about: false,
    include: false,
    pickinfor: false
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Xem lại thông tin tour</h2>
        <p className="text-muted-foreground">
          Vui lòng kiểm tra kỹ thông tin trước khi tạo tour
        </p>
      </div>
      
      {/* Basic Info */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            Thông tin cơ bản
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Tên tour</h3>
              <p className="text-lg font-medium">{formData.title}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Mô tả</h3>
              <p className="text-gray-700 leading-relaxed">{formData.description}</p>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-3">Hình ảnh</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.img.map((url, index) => (
                <div key={index} className="relative aspect-[4/3] group">
                  <img 
                    src={url} 
                    alt={`Tour image ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg ring-1 ring-gray-200"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <p className="text-white text-sm font-medium">Hình {index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Info */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            Lịch trình
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <h3 className="font-medium text-sm text-muted-foreground">Ngày bắt đầu</h3>
                <p className="text-lg font-medium">{format(formData.openDay, 'dd/MM/yyyy', { locale: vi })}</p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-sm text-muted-foreground">Ngày kết thúc</h3>
                <p className="text-lg font-medium">{format(formData.closeDay, 'dd/MM/yyyy', { locale: vi })}</p>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-sm text-muted-foreground">Tần suất</h3>
              <p className="text-lg font-medium">{formData.scheduleFrequency}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Destinations */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            Điểm đến
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {formData.destinations.map((destination, index) => (
              <div key={index} className="border rounded-lg p-4 hover:border-teal-500 transition-colors">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-500 flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <h3 className="font-medium">Điểm đến {index + 1}</h3>
                </div>
                <div className="grid gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <h4 className="text-sm text-muted-foreground">Thời gian bắt đầu</h4>
                      <p className="font-medium">{destination.startTime}</p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm text-muted-foreground">Thời gian kết thúc</h4>
                      <p className="font-medium">{destination.endTime}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-2">Hoạt động</h4>
                    <ul className="space-y-2">
                      {destination.destinationActivities.map((activity, actIndex) => (
                        <li key={actIndex} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                          <span>{activity.name}</span>
                          <span className="text-sm text-muted-foreground">
                            ({activity.startTime} - {activity.endTime})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tickets */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>
            Vé
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {formData.tickets.map((ticket, index) => (
              <div key={index} className="border rounded-lg p-4 hover:border-teal-500 transition-colors">
                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <h4 className="text-sm text-muted-foreground">Loại vé</h4>
                    <p className="font-medium">{ticketKindLabels[ticket.ticketKind]}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm text-muted-foreground">Giá</h4>
                    <p className="font-medium text-teal-600">{formatCurrency(ticket.defaultNetCost)}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm text-muted-foreground">Số lượng tối thiểu</h4>
                    <p className="font-medium">{ticket.minimumPurchaseQuantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            Thông tin bổ sung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-2">Về tour</h3>
            <div className="relative">
              <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {expandedSections.about ? formData.about : truncateText(formData.about)}
              </p>
              {formData.about.length > 150 && (
                <Button
                  variant="link"
                  className="p-0 h-auto font-medium"
                  onClick={() => toggleSection('about')}
                >
                  {expandedSections.about ? "Thu gọn" : "Xem thêm"}
                </Button>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-2">Dịch vụ bao gồm</h3>
            <div className="relative">
              <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {expandedSections.include ? formData.include : truncateText(formData.include)}
              </p>
              {formData.include.length > 150 && (
                <Button
                  variant="link"
                  className="p-0 h-auto font-medium"
                  onClick={() => toggleSection('include')}
                >
                  {expandedSections.include ? "Thu gọn" : "Xem thêm"}
                </Button>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-2">Thông tin đón khách</h3>
            <div className="relative">
              <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {expandedSections.pickinfor ? formData.pickinfor : truncateText(formData.pickinfor)}
              </p>
              {formData.pickinfor.length > 150 && (
                <Button
                  variant="link"
                  className="p-0 h-auto font-medium"
                  onClick={() => toggleSection('pickinfor')}
                >
                  {expandedSections.pickinfor ? "Thu gọn" : "Xem thêm"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button 
          onClick={prevStep} 
          variant="outline"
          className="gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          Quay lại
        </Button>
        <Button 
          onClick={submitForm}
          className="gap-2"
        >
          Xác nhận tạo tour
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </Button>
      </div>
    </div>
  );
}
