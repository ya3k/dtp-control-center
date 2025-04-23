import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketKind } from '@/schemaValidations/crud-tour.schema';
import useTourStore from '@/store/tourStore';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

const ticketKindLabels: Record<TicketKind, string> = {
  [TicketKind.Adult]: "Người lớn",
  [TicketKind.Child]: "Trẻ em",
  [TicketKind.PerGroupOfThree]: "Nhóm 3 người",
  [TicketKind.PerGroupOfFive]: "Nhóm 5 người",
  [TicketKind.PerGroupOfSeven]: "Nhóm 7 người",
  [TicketKind.PerGroupOfTen]: "Nhóm 10 người",
};

const scheduleFrequencyLabels: Record<string, string> = {
  "Daily": "Hằng ngày",
  "Weekly": "Hằng tuần",
  "Monthly": "Hằng tháng",
};

interface ImagePreview {
  url: string;
  isPending: boolean;
  file?: File;
}

export default function ReviewForm() {
  const { submitForm, prevStep, formData, pendingImages, isSubmitting, destinations, isLoadingDestinations } = useTourStore();

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    about: false,
    include: false,
    pickinfor: false
  });
  const [tourImagePreviews, setTourImagePreviews] = useState<ImagePreview[]>([]);

  const [isLocalLoading, setIsLocalLoading] = useState(false);
  useEffect(() => {
    // Only show loading if destinations aren't already loaded in the store
    if (destinations.length === 0 && isLoadingDestinations) {
      setIsLocalLoading(true);
    } else {
      setIsLocalLoading(false);
    }
  }, [destinations.length, isLoadingDestinations]);

  // Generate image preview URLs for pending tour images
  useEffect(() => {
    const existingImages = formData.img.map(url => ({
      url,
      isPending: false
    }));

    const pendingPreviews = pendingImages.tourImages.map(file => ({
      file,
      url: URL.createObjectURL(file),
      isPending: true
    }));

    setTourImagePreviews([...existingImages, ...pendingPreviews]);

    // Clean up object URLs when component unmounts
    return () => {
      pendingPreviews.forEach(preview => {
        if (preview.url.startsWith('blob:')) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [formData.img, pendingImages.tourImages]);

  // Helper function to get image previews for a destination
  const getDestinationImagePreviews = (destinationIndex: number, existingImages: string[] = []): ImagePreview[] => {
    const existing = existingImages.map(url => ({
      url,
      isPending: false
    }));

    const pendingFiles = pendingImages.destinationImages[destinationIndex] || [];
    const pending = pendingFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      isPending: true
    }));

    return [...existing, ...pending];
  };


  // Get destination name by id
  const getDestinationName = (destinationId: string): string => {
    const destination = destinations.find(d => d.id === destinationId);
    return destination?.name || 'Unknown destination';
  };

  // Get translated schedule frequency
  const getScheduleFrequency = (frequency: string): string => {
    return scheduleFrequencyLabels[frequency] || frequency;
  };

  // Group destinations by day
  const destinationsByDay = useMemo(() => {
    // Create a map to hold destinations grouped by day
    const groupedByDay = new Map<number, typeof formData.destinations>();

    // Sort destinations by day first, then by sortOrder within each day
    const sortedDestinations = [...formData.destinations].sort((a, b) => {
      if (a.sortOrderByDate === b.sortOrderByDate) {
        return a.sortOrder - b.sortOrder;
      }
      return a.sortOrderByDate - b.sortOrderByDate;
    });

    // Group destinations by day
    sortedDestinations.forEach(destination => {
      const day = destination.sortOrderByDate;
      if (!groupedByDay.has(day)) {
        groupedByDay.set(day, []);
      }
      groupedByDay.get(day)!.push(destination);
    });

    // Convert map to array of {day, destinations} objects
    return Array.from(groupedByDay.entries()).map(([day, destinations]) => ({
      day,
      destinations
    }));
  }, [formData.destinations]);

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

  // Function to render HTML content safely
  const renderHtml = (htmlContent: string) => {
    return { __html: htmlContent };
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-8 relative">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 z-50 flex flex-col items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-t-teal-600 border-teal-200 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">Đang tạo tour</h3>
              <p className="text-sm text-gray-500 mt-1">Vui lòng đợi trong giây lát...</p>
            </div>
          </div>
        </div>
      )}

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
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
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
            {tourImagePreviews.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {tourImagePreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-[4/3] group">
                    <Image
                      src={preview.url}
                      alt={`Tour image ${index + 1}`}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover rounded-lg ring-1 ring-gray-200"
                      unoptimized={preview.url.startsWith('blob:')}
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <p className="text-white text-sm font-medium">
                        {preview.isPending ? 'Đang chờ tải lên' : `Hình ${index + 1}`}
                      </p>
                    </div>
                    {preview.isPending && (
                      <div className="absolute bottom-0 left-0 right-0 bg-teal-600 text-white text-xs px-2 py-1">
                        Đang chờ tải lên
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">Không có hình ảnh</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Info */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
            Lịch trình
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <h3 className="font-medium text-sm text-muted-foreground">Ngày bắt đầu khai thác tour</h3>
                <p className="text-lg font-medium">{format(formData.openDay, 'dd/MM/yyyy', { locale: vi })}</p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-sm text-muted-foreground">Ngày ngừng khai thác tour</h3>
                <p className="text-lg font-medium">{format(formData.closeDay, 'dd/MM/yyyy', { locale: vi })}</p>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-sm text-muted-foreground">Tần suất</h3>
              <p className="text-lg font-medium">{getScheduleFrequency(formData.scheduleFrequency)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Destinations */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
            Lịch trình tour
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLocalLoading ? (
            <div className="flex items-center justify-center p-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
              <span className="ml-2">Đang tải dữ liệu...</span>
            </div>
          ) : (
            <div className="space-y-8">
              {destinationsByDay.map(({ day, destinations }) => (
                <div key={`day-${day}`} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-600 text-white font-medium">
                      {day}
                    </div>
                    <h3 className="text-lg font-medium">Ngày {day}</h3>
                  </div>

                  <div className="pl-10 space-y-6">
                    {destinations.map((destination, destIndex) => {
                      // Get actual destination index in overall array (needed for pendingImages)
                      const destinationArrayIndex = formData.destinations.findIndex(
                        d => d.sortOrderByDate === day && d.sortOrder === destination.sortOrder
                      );

                      // Get image previews for this destination
                      const imagePreviews = getDestinationImagePreviews(
                        destinationArrayIndex,
                        destination.img || []
                      );

                      return (
                        <div key={destIndex} className="border rounded-lg p-4 hover:border-teal-500 transition-colors">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-500 flex items-center justify-center font-medium">
                              {destination.sortOrder + 1}
                            </div>
                            <div>
                              {/* <h4 className="font-medium">Điểm đến {destination.sortOrder + 1}</h4> */}
                              {destination.destinationId && (
                                <h4 className="text-base font-semibold text-teal-600">{getDestinationName(destination.destinationId)}</h4>
                              )}
                            </div>
                          </div>

                          <div className="grid gap-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <h5 className="text-sm text-muted-foreground">Thời gian bắt đầu</h5>
                                <p className="font-medium">{destination.startTime}</p>
                              </div>
                              <div className="space-y-1">
                                <h5 className="text-sm text-muted-foreground">Thời gian kết thúc</h5>
                                <p className="font-medium">{destination.endTime}</p>
                              </div>
                            </div>

                            {imagePreviews.length > 0 && (
                              <div>
                                <h5 className="text-sm text-muted-foreground mb-2">Hình ảnh</h5>
                                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                                  {imagePreviews.map((preview, imgIndex) => (
                                    <div key={imgIndex} className="aspect-square rounded-md overflow-hidden border relative">
                                      <Image
                                        src={preview.url}
                                        alt={`Destination image ${imgIndex + 1}`}
                                        width={200}
                                        height={200}
                                        className="w-full h-full object-cover"
                                        unoptimized={preview.url.startsWith('blob:')}
                                      />
                                      {preview.isPending && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-teal-600 text-white text-xs px-2 py-1">
                                          Đang chờ tải lên
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {destination.destinationActivities && destination.destinationActivities.length > 0 && (
                              <div>
                                <h5 className="text-sm text-muted-foreground mb-2">Hoạt động</h5>
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
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tickets */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" /></svg>
            Vé
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className='text-sm italic font-light text-black-600 mb-2 '><span>Số lượng mặc định của mỗi vé là <span className='font-bold text-red-600'>100</span> có thể chỉnh sửa sau khi tạo tour thành công.</span>
          </div>
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
                    <h4 className="text-sm text-muted-foreground">Số lượng vé mua tối thiểu</h4>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
            Thông tin bổ sung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-2">Về tour</h3>
            <div className="relative">
              <div 
                className="whitespace-pre-wrap text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={renderHtml(expandedSections.about ? formData.about : truncateText(formData.about))}
              />
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
              <div 
                className="whitespace-pre-wrap text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={renderHtml(expandedSections.include ? formData.include : truncateText(formData.include))}
              />
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
              <div 
                className="whitespace-pre-wrap text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={renderHtml(expandedSections.pickinfor ? formData.pickinfor : truncateText(formData.pickinfor))}
              />
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
          disabled={isSubmitting}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
          Quay lại
        </Button>
        <Button
          onClick={submitForm}
          className="gap-2 min-w-[180px] relative"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="absolute left-0 inset-y-0 flex items-center justify-center w-10">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <span className="ml-2">Đang tạo tour...</span>
            </>
          ) : (
            <>
              <span>Xác nhận tạo tour</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
