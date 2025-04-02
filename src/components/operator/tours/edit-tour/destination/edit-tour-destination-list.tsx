'use client'
import { FC, useMemo } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TourDestinationResType } from "@/schemaValidations/tour-operator.shema";


interface EditTourDestinationListProps {
    tourDestinations: TourDestinationResType[];
    onEdit?: (destination: TourDestinationResType) => void;
    onDelete?: (destinationId: string) => void;
}

const EditTourDestinationList: FC<EditTourDestinationListProps> = ({
    tourDestinations,
    onEdit,
    onDelete,
}) => {
    // Helper function to format time from HH:MM:SS to HH:MM
    const formatTime = (timeString: string): string => {
        return timeString.substring(0, 5);
    };

    // Group destinations by day
    const destinationsByDay = useMemo(() => {
        const result: Record<number, TourDestinationResType[]> = {};

        // Sort destinations by sortOrderByDate
        const sortedDestinations = [...tourDestinations].sort(
            (a, b) => a.sortOrderByDate - b.sortOrderByDate
        );

        // Group them by day
        sortedDestinations.forEach(destination => {
            const day = destination.sortOrderByDate;
            if (!result[day]) {
                result[day] = [];
            }
            result[day].push(destination);
        });

        return result;
    }, [tourDestinations]);

    // Get unique days in order
    const days = useMemo(() => {
        return Object.keys(destinationsByDay).map(Number).sort((a, b) => a - b);
    }, [destinationsByDay]);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Tour Destinations</h2>

            {tourDestinations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                    No destinations added to this tour yet.
                </div>
            ) : (
                <div className="space-y-8">
                    {days.map(day => (
                        <div key={day} className="space-y-4">
                            <h3 className="text-xl font-semibold">Day {day}</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {destinationsByDay[day].map((destination) => (
                                    <Card key={destination.id} className="overflow-hidden">
                                        <CardHeader>
                                            <CardTitle className="flex justify-between items-center">
                                                <span>{destination.destinationName}</span>
                                                <span className="text-sm font-normal text-gray-500">
                                                    {formatTime(destination.startTime)} - {formatTime(destination.endTime)}
                                                </span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Left side: Destination information */}
                                                <div>
                                                    <div className="relative h-48 w-full mb-4">
                                                        <Image
                                                            src={destination.img}
                                                            alt={destination.destinationName}
                                                            fill
                                                            className="object-cover rounded"
                                                        />
                                                    </div>
                                                    <div className="mb-4">
                                                        <p className="text-sm text-gray-600">
                                                            Time: {formatTime(destination.startTime)} - {formatTime(destination.endTime)}
                                                        </p>
                                                    </div>

                                                    <div className="flex gap-2 mt-4">
                                                        {onEdit && (
                                                            <button
                                                                onClick={() => onEdit(destination)}
                                                                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                                                            >
                                                                Edit
                                                            </button>
                                                        )}
                                                        {onDelete && (
                                                            <button
                                                                onClick={() => onDelete(destination.id)}
                                                                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                                                            >
                                                                Delete
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Right side: Activities */}
                                                <div>
                                                    <h4 className="font-medium mb-2">Activities</h4>
                                                    {destination.destinationActivities.length === 0 ? (
                                                        <p className="text-sm text-gray-500">No activities for this destination.</p>
                                                    ) : (
                                                        <div className="max-h-64 overflow-y-auto pr-2 border rounded">
                                                            <Table>
                                                                <TableHeader className="sticky top-0 bg-white z-10">
                                                                    <TableRow>
                                                                        <TableHead className="bg-white">Activity</TableHead>
                                                                        <TableHead className="bg-white">Time</TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {destination.destinationActivities
                                                                        .sort((a, b) => a.sortOrder - b.sortOrder)
                                                                        .map((activity, index) => (
                                                                            <TableRow key={index}>
                                                                                <TableCell>{activity.name}</TableCell>
                                                                                <TableCell>
                                                                                    {formatTime(activity.startTime)} - {formatTime(activity.endTime)}
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                </TableBody>
                                                            </Table>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EditTourDestinationList;