'use client'

import { useState, useEffect } from "react"
import { Loader2, Plus, ChevronDown, Clock, MapPin } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import tourApiService from "@/apiRequests/tour"
import { TourDestinationResType } from "@/schemaValidations/tour-operator.shema"
import Image from "next/image"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"

interface TourEditDestinationFormProps {
    tourId: string
    onUpdateSuccess: () => void
}

interface GroupedDestinations {
    [key: number]: TourDestinationResType[]
}

interface DestinationActivity {
    name: string;
    startTime: string;
    endTime: string;
    sortOrder: number;
}

interface UpdateDestinationPayload {
    tourId: string;
    destinations: {
        destinationId: string;
        destinationActivities: DestinationActivity[];
        startTime: string;
        endTime: string;
        sortOrder: number;
        sortOrderByDate: number;
        img: string;
    }[];
}

export default function TourEditDetinationForm({ tourId, onUpdateSuccess }: TourEditDestinationFormProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [groupedDestinations, setGroupedDestinations] = useState<GroupedDestinations>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    //fetch tour destination
    useEffect(() => {
        const fetchTourDestinations = async () => {
            console.log(tourId)
            setIsLoading(true)
            try {
                const response = await tourApiService.getTourDestination(tourId)
                // Group destinations by sortOrderByDate
                console.log(JSON.stringify(response.payload.data))
                const grouped = response.payload.data.reduce((acc: GroupedDestinations, destination: TourDestinationResType) => {
                    const day = destination.sortOrderByDate;
                    if (!acc[day]) {
                        acc[day] = [];
                    }
                    acc[day].push(destination);
                    return acc;
                }, {});

                // Sort destinations within each group by startTime
                Object.keys(grouped).forEach((day) => {
                    grouped[Number(day)].sort((a: TourDestinationResType, b: TourDestinationResType) =>
                        a.startTime.localeCompare(b.startTime)
                    );
                });

                setGroupedDestinations(grouped);
                setIsLoading(false)
            } catch (error) {
                console.error("Error fetching tour destinations:", error)
                toast.error("Failed to fetch tour destinations")
            } finally {
                setIsLoading(false)
            }
        }

        fetchTourDestinations()
    }, [tourId])

    const handleUpdateDestinations = async () => {
        setIsSubmitting(true)
        try {
            // Transform grouped destinations back to array format
            const destinations = Object.values(groupedDestinations)
                .flat()
                .map(destination => ({
                    destinationId: destination.id,
                    destinationActivities: destination.destinationActivities.map((activity: DestinationActivity) => ({
                        name: activity.name,
                        startTime: activity.startTime,
                        endTime: activity.endTime,
                        sortOrder: activity.sortOrder
                    })),
                    startTime: destination.startTime,
                    endTime: destination.endTime,
                    sortOrder: destination.sortOrder,
                    sortOrderByDate: destination.sortOrderByDate,
                    img: destination.img || ""
                }));

            const payload: UpdateDestinationPayload = {
                tourId,
                destinations
            };
            console.log(JSON.stringify(payload));

            await tourApiService.putTourDesitnation(tourId, payload);
            toast.success("Cập nhật điểm đến thành công");
            onUpdateSuccess();
        } catch (error) {
            console.error("Error updating destinations:", error);
            toast.error("Cập nhật điểm đến thất bại");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Điểm đến</h2>
                        <p className="text-muted-foreground">Quản lý các điểm đến trong tour</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm điểm đến
                        </Button>
                        <Button
                            onClick={handleUpdateDestinations}
                            disabled={isSubmitting}
                            variant="default"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Đang cập nhật...
                                </>
                            ) : (
                                'Cập nhật điểm đến'
                            )}
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Danh sách điểm đến</CardTitle>
                        <CardDescription>
                            Các điểm đến và hoạt động trong tour (Sắp xếp theo thứ tự ngày)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        ) : Object.keys(groupedDestinations).length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                Chưa có điểm đến nào được thêm vào tour
                            </div>
                        ) : (
                            <ScrollArea className="h-[600px] pr-4">
                                <div className="space-y-6">
                                    {Object.entries(groupedDestinations)
                                        .sort(([a], [b]) => Number(a) - Number(b))
                                        .map(([day, destinations]) => (
                                            <div key={day} className="space-y-2">
                                                <h3 className="text-lg font-semibold px-4">Ngày {day}</h3>
                                                <div className="space-y-2">
                                                    {destinations.map((destination: TourDestinationResType) => (
                                                        <Collapsible key={destination.id} className="w-full">
                                                            <CollapsibleTrigger className="w-full">
                                                                <div className="flex items-center justify-between space-x-4 px-4 py-3 hover:bg-accent hover:text-accent-foreground rounded-md border">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="flex flex-col items-start">
                                                                            <span className="font-medium">
                                                                                {destination.destinationName}
                                                                            </span>
                                                                            <span className="text-sm text-muted-foreground">
                                                                                {destination.startTime} - {destination.endTime}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <Badge variant="secondary">
                                                                            {destination.destinationActivities.length} hoạt động
                                                                        </Badge>
                                                                        <ChevronDown className="h-4 w-4" />
                                                                    </div>
                                                                </div>
                                                            </CollapsibleTrigger>
                                                            <CollapsibleContent>
                                                                <div className="p-4 space-y-4">
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        {/* Left column: Image */}
                                                                        <div className="relative aspect-video rounded-lg overflow-hidden">
                                                                            <Image
                                                                                src={destination.img || "/placeholder.svg"}
                                                                                alt={destination.destinationName}
                                                                                fill
                                                                                className="object-cover"
                                                                            />
                                                                        </div>
                                                                        {/* Right column: Details */}
                                                                        <div className="space-y-4">
                                                                            <div className="flex items-center gap-2">
                                                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                                                <div>
                                                                                    <h5 className="font-medium text-sm text-muted-foreground">Thời gian:</h5>
                                                                                    <p>{destination.startTime} - {destination.endTime}</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                                                <div>
                                                                                    <h5 className="font-medium text-sm text-muted-foreground">Địa điểm:</h5>
                                                                                    <p>{destination.destinationName}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Activities Section */}
                                                                    <div className="mt-4">
                                                                        <h4 className="font-medium mb-2">Các hoạt động:</h4>
                                                                        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                                                                            <div className="space-y-4">
                                                                                {destination.destinationActivities.map((activity, index) => (
                                                                                    <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                                                                                        <div className="flex-1">
                                                                                            <div className="flex items-center gap-2">
                                                                                                <span className="font-medium">{index + 1}.</span>
                                                                                                <h5 className="font-medium">{activity.name}</h5>
                                                                                            </div>
                                                                                            <div className="flex items-center gap-4 mt-2">
                                                                                                <span className="text-sm text-muted-foreground">
                                                                                                    {activity.startTime} - {activity.endTime}
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </ScrollArea>
                                                                    </div>
                                                                </div>
                                                            </CollapsibleContent>
                                                        </Collapsible>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </ScrollArea>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    )
}