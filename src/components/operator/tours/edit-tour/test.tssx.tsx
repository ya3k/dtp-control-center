'use client'

import tourApiService, { tourApiRequest } from "@/apiRequests/tour";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TourDestinationResType } from "@/schemaValidations/tour-operator.shema";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import EditTourDestinationList from "./destination/edit-tour-destination-list";
import { Button } from "@/components/ui/button";


interface TourEditDestinationProps {
    tourId: string;
    onUpdateSuccess: () => void;
}

const TourEditPage = ({ tourId, onUpdateSuccess }: TourEditDestinationProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [tourDestinations, setTourDestinations] = useState<TourDestinationResType[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingDestination, setEditingDestination] = useState<TourDestinationResType | undefined>(undefined);

    useEffect(() => {
        const fetchTourDestination = async () => {
            try {
                setIsLoading(true);
                const resTourDes = await tourApiService.getTourDestination(tourId);
                console.log(resTourDes.payload.data)
                setTourDestinations(resTourDes.payload.data)
            } catch (error) {
                console.log(error)
                toast.error("Failed to load tour des.");
            } finally {
                setIsLoading(false)
            }
        }

        fetchTourDestination();
    }, [tourId])

    const handleEdit = (destination: TourDestinationResType) => {
        setEditingDestination(destination);
        setIsDialogOpen(true);
    };

    const handleAdd = () => {
        setEditingDestination(undefined);
        setIsDialogOpen(true);
    };

    const handleSave = (destination: TourDestinationResType) => {
        if (destination.id) {
            // Update existing destination
            setTourDestinations(prev => 
                prev.map(d => d.id === destination.id ? destination : d)
            );
        } else {
            // Add new destination with generated ID
            setTourDestinations(prev => [
                ...prev,
                { ...destination, id: crypto.randomUUID() }
            ]);
        }
        setIsDialogOpen(false);
    };

    const handleDelete = (destinationId: string) => {
        setTourDestinations(prev => prev.filter(d => d.id !== destinationId));
    };

    return (
        <div>
            <div className="flex justify-between mb-4">
                <h1>Edit Tour</h1>
                <Button onClick={handleAdd}>Add Destination</Button>
            </div>
            
            <ScrollArea className="h-[calc(100vh-200px)] pr-4">
                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <EditTourDestinationList
                        tourDestinations={tourDestinations}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </ScrollArea>
            
            {/* <EditTourDestinationDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleSave}
                destination={editingDestination}
                tourId={tourId}
            /> */}
        </div>
    )
};

export default TourEditPage;