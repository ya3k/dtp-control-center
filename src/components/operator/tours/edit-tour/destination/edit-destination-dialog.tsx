'use client'

import { useState, useEffect } from 'react'
import { format, parse } from 'date-fns'
import { CalendarIcon, Clock, Loader2, Plus, ImageIcon, X } from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

import tourApiService from '@/apiRequests/tour'
import uploadApiRequest from '@/apiRequests/upload'
import { TourDestinationResType, PUTTourDestinationBodyType } from '@/schemaValidations/tour-operator.shema'

// Schema validation cho form chỉnh sửa điểm đến
const editDestinationSchema = z.object({
    destinationId: z.string().uuid(),
    startTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, {
        message: "Thời gian phải theo định dạng HH:MM hoặc HH:MM:SS",
    }),
    endTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, {
        message: "Thời gian phải theo định dạng HH:MM hoặc HH:MM:SS",
    }),
    sortOrder: z.coerce.number().int().min(0),
    sortOrderByDate: z.coerce.number().int().min(0),
    img: z.string().url({
        message: "URL hình ảnh không hợp lệ",
    }),
});

interface EditDestinationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    destination: TourDestinationResType | null
    tourId: string
    onUpdateSuccess: () => void
}

export default function EditDestinationDialog({
    open,
    onOpenChange,
    destination,
    tourId,
    onUpdateSuccess,
}: EditDestinationDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string>('')
    const [activities, setActivities] = useState<any[]>([])

    // Form setup
    const form = useForm<z.infer<typeof editDestinationSchema>>({
        resolver: zodResolver(editDestinationSchema),
        defaultValues: {
            destinationId: '',
            startTime: '00:00:00',
            endTime: '00:00:00',
            sortOrder: 0,
            sortOrderByDate: 0,
            img: '',
        },
    })

    // Reset form khi mở dialog hoặc khi thay đổi destination
    useEffect(() => {
        if (open && destination) {
            form.reset({
                destinationId: destination.destinationId,
                startTime: destination.startTime,
                endTime: destination.endTime,
                sortOrder: destination.sortOrder,
                sortOrderByDate: destination.sortOrderByDate,
                img: destination.img,
            })
            
            setActivities(destination.destinationActivities || [])
            setImagePreview(destination.img)
        }
    }, [open, destination, form])

    // Xử lý thay đổi hình ảnh
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedImage(file)
            const previewUrl = URL.createObjectURL(file)
            setImagePreview(previewUrl)
        }
    }

    // Xóa hình đã chọn
    const clearSelectedImage = () => {
        setSelectedImage(null)
        setImagePreview(destination?.img || '')
        form.setValue('img', destination?.img || '')
    }

    // Thêm một hoạt động mới rỗng vào danh sách
    const addNewActivity = () => {
        const newActivity = {
            name: '',
            startTime: '08:00:00',
            endTime: '09:00:00',
            sortOrder: activities.length,
        }
        setActivities([...activities, newActivity])
    }

    // Cập nhật thông tin hoạt động
    const updateActivity = (index: number, field: string, value: string | number) => {
        const updatedActivities = [...activities]
        updatedActivities[index] = {
            ...updatedActivities[index],
            [field]: value,
        }
        setActivities(updatedActivities)
    }

    // Xóa một hoạt động
    const removeActivity = (index: number) => {
        const updatedActivities = [...activities]
        updatedActivities.splice(index, 1)
        
        // Cập nhật lại sortOrder sau khi xóa
        const reindexedActivities = updatedActivities.map((activity, idx) => ({
            ...activity,
            sortOrder: idx
        }))
        
        setActivities(reindexedActivities)
    }

    // Xử lý submit form
    const onSubmit = async (values: z.infer<typeof editDestinationSchema>) => {
        try {
            setIsSubmitting(true)
            
            // Xử lý upload ảnh nếu có chọn ảnh mới
            let imageUrl = values.img
            if (selectedImage) {
                const uploadResponse = await uploadApiRequest.uploadDestinationImage(selectedImage)
                if (uploadResponse.urls && uploadResponse.urls.length > 0) {
                    imageUrl = uploadResponse.urls[0]
                } else {
                    throw new Error('Không thể tải lên hình ảnh')
                }
            }
            
            // Chuẩn bị dữ liệu cho API
            const submitData: PUTTourDestinationBodyType = {
                destinationId: values.destinationId,
                startTime: ensureTimeFormat(values.startTime),
                endTime: ensureTimeFormat(values.endTime),
                sortOrder: values.sortOrder,
                sortOrderByDate: values.sortOrderByDate,
                img: imageUrl,
                destinationActivities: activities.map(activity => ({
                    name: activity.name,
                    startTime: ensureTimeFormat(activity.startTime),
                    endTime: ensureTimeFormat(activity.endTime),
                    sortOrder: activity.sortOrder,
                })),
            }
            
            // Gọi API
            const response = await tourApiService.putTourDesitnation(tourId, submitData)
            
            if (!response.payload) {
                throw new Error('Cập nhật điểm đến thất bại')
            }
            
            toast.success('Cập nhật điểm đến thành công')
            onUpdateSuccess()
            onOpenChange(false)
        } catch (error) {
            console.error('Lỗi khi cập nhật điểm đến:', error)
            toast.error('Không thể cập nhật điểm đến')
        } finally {
            setIsSubmitting(false)
        }
    }
    
    // Đảm bảo định dạng thời gian là HH:MM:SS
    const ensureTimeFormat = (time: string): string => {
        if (time.match(/^\d{2}:\d{2}$/)) {
            return `${time}:00`;
        }
        return time;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa điểm đến</DialogTitle>
                    <DialogDescription>
                        Cập nhật thông tin điểm đến và các hoạt động tại điểm đến
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Điểm đến */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-medium">Thông tin điểm đến</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {destination?.destinationName || 'Điểm đến'}
                                    </p>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="startTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Thời gian bắt đầu</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="time"
                                                    step="1"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Thời gian bắt đầu tham quan địa điểm
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="endTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Thời gian kết thúc</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="time"
                                                    step="1"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Thời gian kết thúc tham quan địa điểm
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="sortOrder"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Thứ tự</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        min="0"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="sortOrderByDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Thứ tự theo ngày</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        min="0"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="img"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Hình ảnh</FormLabel>
                                            <div className="space-y-2">
                                                {imagePreview && (
                                                    <div className="relative w-full h-40 rounded-md overflow-hidden border">
                                                        <img 
                                                            src={imagePreview} 
                                                            alt="Preview" 
                                                            className="object-cover w-full h-full"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="icon"
                                                            className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-80"
                                                            onClick={clearSelectedImage}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => document.getElementById('destination-image')?.click()}
                                                        className="w-full"
                                                    >
                                                        <ImageIcon className="mr-2 h-4 w-4" />
                                                        Chọn hình ảnh
                                                    </Button>
                                                    <Input
                                                        id="destination-image"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={handleImageChange}
                                                    />
                                                </div>
                                                <Input
                                                    {...field}
                                                    placeholder="URL hình ảnh (tùy chọn)"
                                                    className={cn(selectedImage ? "hidden" : "")}
                                                />
                                            </div>
                                            <FormDescription>
                                                Chọn ảnh từ máy tính hoặc nhập URL hình ảnh
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Hoạt động tại điểm đến */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-medium">Hoạt động tại điểm đến</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Thêm các hoạt động diễn ra tại điểm đến này
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addNewActivity}
                                    >
                                        <Plus className="h-4 w-4 mr-1" /> Thêm
                                    </Button>
                                </div>

                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                    {activities.length === 0 ? (
                                        <div className="text-center py-6 border border-dashed rounded-md">
                                            <p className="text-muted-foreground">
                                                Chưa có hoạt động nào tại điểm đến này
                                            </p>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="mt-2"
                                                onClick={addNewActivity}
                                            >
                                                <Plus className="h-4 w-4 mr-1" /> Thêm hoạt động
                                            </Button>
                                        </div>
                                    ) : (
                                        activities.map((activity, index) => (
                                            <Card key={index} className="p-4 relative">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute top-2 right-2 h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => removeActivity(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                                
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="text-sm font-medium">
                                                            Tên hoạt động
                                                        </label>
                                                        <Input
                                                            value={activity.name}
                                                            onChange={(e) => updateActivity(index, 'name', e.target.value)}
                                                            placeholder="Tên hoạt động"
                                                        />
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <div>
                                                            <label className="text-sm font-medium">
                                                                Bắt đầu
                                                            </label>
                                                            <Input
                                                                type="time"
                                                                step="1"
                                                                value={activity.startTime.substring(0, 5)}
                                                                onChange={(e) => updateActivity(index, 'startTime', `${e.target.value}:00`)}
                                                            />
                                                        </div>
                                                        
                                                        <div>
                                                            <label className="text-sm font-medium">
                                                                Kết thúc
                                                            </label>
                                                            <Input
                                                                type="time"
                                                                step="1"
                                                                value={activity.endTime.substring(0, 5)}
                                                                onChange={(e) => updateActivity(index, 'endTime', `${e.target.value}:00`)}
                                                            />
                                                        </div>
                                                        
                                                        <div>
                                                            <label className="text-sm font-medium">
                                                                Thứ tự
                                                            </label>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                value={activity.sortOrder}
                                                                onChange={(e) => updateActivity(index, 'sortOrder', parseInt(e.target.value) || 0)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="flex justify-between gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang lưu...
                                    </>
                                ) : (
                                    "Lưu thay đổi"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}