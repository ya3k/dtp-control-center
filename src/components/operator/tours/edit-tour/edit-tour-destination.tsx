'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Loader2, MapPin, Clock, Plus, ArrowUp, ArrowDown, MoreHorizontal, Edit, Trash } from 'lucide-react'
import { toast } from 'sonner'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { 
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import EditDestinationDialog from './destination/edit-destination-dialog'
import tourApiService from '@/apiRequests/tour'
import { TourDestinationResType } from '@/schemaValidations/tour-operator.shema'

interface TourEditDestinationFormProps {
    tourId: string
    onUpdateSuccess: () => void
}

export default function TourEditDestination({ tourId, onUpdateSuccess }: TourEditDestinationFormProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [destinations, setDestinations] = useState<TourDestinationResType[]>([])
    const [selectedDestination, setSelectedDestination] = useState<TourDestinationResType | null>(null)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [addDialogOpen, setAddDialogOpen] = useState(false)

    // Lấy dữ liệu điểm đến từ API
    const fetchTourDestinations = async () => {
        try {
            setIsLoading(true)
            const response = await tourApiService.getTourDestination(tourId)
            
            if (response.payload && Array.isArray(response.payload.data)) {
                // Sắp xếp điểm đến theo thứ tự
                const sortedDestinations = [...response.payload.data].sort((a, b) => a.sortOrder - b.sortOrder)
                setDestinations(sortedDestinations)
            } else {
                console.error("Định dạng phản hồi không mong đợi:", response)
                toast.error("Không thể tải dữ liệu điểm đến")
            }
        } catch (error) {
            console.error("Không thể lấy điểm đến tour:", error)
            toast.error("Không thể tải điểm đến tour")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchTourDestinations()
    }, [tourId])

    // Xử lý nhấn nút chỉnh sửa
    const handleEditDestination = (destination: TourDestinationResType) => {
        setSelectedDestination(destination)
        setEditDialogOpen(true)
    }

    // Xử lý nhấn nút xóa
    const handleDeleteDestination = (destination: TourDestinationResType) => {
        setSelectedDestination(destination)
        setDeleteDialogOpen(true)
    }

    // Xác nhận xóa điểm đến
    const confirmDeleteDestination = async () => {
        // Chức năng xóa điểm đến - sẽ triển khai sau
        toast.error("Chức năng xóa điểm đến chưa được triển khai")
        setDeleteDialogOpen(false)
    }

    // Định dạng thời gian từ HH:MM:SS thành HH:MM
    const formatTime = (timeString: string) => {
        if (timeString.match(/^\d{2}:\d{2}:\d{2}$/)) {
            return timeString.substring(0, 5)
        }
        return timeString
    }

    // Xử lý thay đổi thứ tự điểm đến
    const handleReorderDestination = async (destinationId: string, direction: 'up' | 'down') => {
        try {
            const currentIndex = destinations.findIndex(d => d.id === destinationId)
            if (currentIndex === -1) return
            
            // Nếu di chuyển lên nhưng đã ở đầu danh sách
            if (direction === 'up' && currentIndex === 0) return
            
            // Nếu di chuyển xuống nhưng đã ở cuối danh sách
            if (direction === 'down' && currentIndex === destinations.length - 1) return
            
            // Tạo bản sao và hoán đổi vị trí
            const newDestinations = [...destinations]
            const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
            
            // Lưu lại các giá trị sortOrder hiện tại
            const currentSortOrder = newDestinations[currentIndex].sortOrder
            const targetSortOrder = newDestinations[targetIndex].sortOrder
            
            // Hoán đổi giá trị sortOrder
            newDestinations[currentIndex] = {
                ...newDestinations[currentIndex],
                sortOrder: targetSortOrder
            }
            
            newDestinations[targetIndex] = {
                ...newDestinations[targetIndex],
                sortOrder: currentSortOrder
            }
            
            // Hoán đổi vị trí trong mảng cho UI cập nhật ngay
            [newDestinations[currentIndex], newDestinations[targetIndex]] = 
            [newDestinations[targetIndex], newDestinations[currentIndex]]
            
            // Cập nhật state để UI thay đổi ngay
            setDestinations(newDestinations)
            
            // Gọi API để cập nhật thứ tự (đối với destination hiện tại)
            const destinationToUpdate = destinations[currentIndex]
            const updateData = {
                destinationId: destinationToUpdate.destinationId,
                startTime: destinationToUpdate.startTime,
                endTime: destinationToUpdate.endTime,
                sortOrder: targetSortOrder,
                sortOrderByDate: destinationToUpdate.sortOrderByDate,
                img: destinationToUpdate.img,
                destinationActivities: destinationToUpdate.destinationActivities,
            }
            
            await tourApiService.putTourDesitnation(tourId, updateData)
            
            // Gọi API để cập nhật thứ tự (đối với destination đích)
            const targetDestination = destinations[targetIndex]
            const targetUpdateData = {
                destinationId: targetDestination.destinationId,
                startTime: targetDestination.startTime,
                endTime: targetDestination.endTime,
                sortOrder: currentSortOrder,
                sortOrderByDate: targetDestination.sortOrderByDate,
                img: targetDestination.img,
                destinationActivities: targetDestination.destinationActivities,
            }
            
            await tourApiService.putTourDesitnation(tourId, targetUpdateData)
            
            toast.success("Đã cập nhật thứ tự điểm đến")
        } catch (error) {
            console.error("Lỗi khi cập nhật thứ tự:", error)
            toast.error("Không thể cập nhật thứ tự điểm đến")
            // Tải lại dữ liệu nếu có lỗi
            fetchTourDestinations()
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>Quản lý điểm đến</span>
                    <Button size="sm" variant="default" onClick={() => setAddDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" /> Thêm điểm đến
                    </Button>
                </CardTitle>
                <CardDescription>
                    Quản lý các điểm đến và hoạt động trong tour
                </CardDescription>
            </CardHeader>

            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : destinations.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        <MapPin className="mx-auto h-10 w-10 mb-3 text-muted-foreground/60" />
                        <p>Chưa có điểm đến nào cho tour này.</p>
                        <p className="mt-1">Nhấp vào "Thêm điểm đến" để bắt đầu tạo lộ trình.</p>
                    </div>
                ) : (
                    <ScrollArea className="h-[500px] pr-4">
                        <div className="space-y-6">
                            {destinations.map((destination, index) => (
                                <Card key={destination.id} className="relative border-l-4 border-l-blue-500">
                                    {/* Điều khiển thứ tự */}
                                    <div className="absolute -left-5 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                                        <Button 
                                            size="icon" 
                                            variant="outline" 
                                            className="h-7 w-7 bg-white"
                                            disabled={index === 0}
                                            onClick={() => handleReorderDestination(destination.id, 'up')}
                                        >
                                            <ArrowUp className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                            size="icon" 
                                            variant="outline" 
                                            className="h-7 w-7 bg-white"
                                            disabled={index === destinations.length - 1}
                                            onClick={() => handleReorderDestination(destination.id, 'down')}
                                        >
                                            <ArrowDown className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Menu hành động */}
                                    <div className="absolute right-4 top-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem 
                                                    className="flex items-center cursor-pointer"
                                                    onClick={() => handleEditDestination(destination)}
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    <span>Chỉnh sửa</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    className="flex items-center text-red-600 cursor-pointer"
                                                    onClick={() => handleDeleteDestination(destination)}
                                                >
                                                    <Trash className="mr-2 h-4 w-4" />
                                                    <span>Xóa</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            {/* Hình ảnh điểm đến */}
                                            <div className="w-full md:w-1/3 h-48 rounded-md overflow-hidden">
                                                <img
                                                    src={destination.img}
                                                    alt={destination.destinationName}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Không+có+hình';
                                                    }}
                                                />
                                            </div>

                                            {/* Thông tin điểm đến */}
                                            <div className="w-full md:w-2/3">
                                                <div className="flex justify-between items-start mb-3">
                                                    <h3 className="text-xl font-semibold flex items-center">
                                                        <Badge variant="outline" className="mr-2 bg-blue-50 text-blue-700 border-blue-200">
                                                            {index + 1}
                                                        </Badge>
                                                        {destination.destinationName}
                                                    </h3>
                                                    <Badge variant="outline" className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {formatTime(destination.startTime)} - {formatTime(destination.endTime)}
                                                    </Badge>
                                                </div>

                                                {/* Thông tin thêm */}
                                                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">