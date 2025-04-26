import { POSTBasicTourInfoType, POSTTourAdditionalInfoType, POSTTourDestinationType, POSTTourScheduleInfoType, POSTTourTicketType, POSTTourType } from "@/schemaValidations/crud-tour.schema";
import { create } from "zustand";
import tourApiService from "@/apiRequests/tour";
import { toast } from "sonner";
import uploadApiRequest from "@/apiRequests/upload";
import { Destination } from "@/types/destination";

// Type for pending images
interface PendingImageState {
    tourImages: File[];  // Images for the main tour
    destinationImages: Record<number, File[]>;  // Images for each destination by index
}

interface POSTTourState {
    step: number;
    formData: POSTTourType;
    pendingImages: PendingImageState;
    isSubmitting: boolean;

    destinations: Destination[];
    isLoadingDestinations: boolean;
    setDestinations: (destinations: Destination[]) => void;

    nextStep: () => void;
    prevStep: () => void;
    getTotalSteps: () => number;

    setPendingTourImages: (files: File[]) => void;
    removePendingTourImage: (index: number) => void;

    setPendingDestinationImages: (destinationIndex: number, files: File[]) => void;
    removePendingDestinationImage: (destinationIndex: number, imageIndex: number) => void;

    setBasicTourInfo: (data: Partial<POSTBasicTourInfoType>) => void;
    setTourScheDuleInfo: (data: Partial<POSTTourScheduleInfoType>) => void;
    setTourAdditionalInfo: (data: Partial<POSTTourAdditionalInfoType>) => void;
    setTourDestination: (data: Partial<POSTTourDestinationType>) => void;
    setTourTicket: (data: Partial<POSTTourTicketType>) => void;
    submitForm: () => Promise<void>;
    resetForm: () => void;
}
const initialPendingImages: PendingImageState = {
    tourImages: [],
    destinationImages: {}
};
const initialFormData: POSTTourType = {
    title: "",
    categoryid: "",
    description: "",
    img: [],
    openDay: new Date(),
    closeDay: new Date(),
    scheduleFrequency: "",
    destinations: [],
    tickets: [],
    about: "",
    include: "",
    pickinfor: ""
};

const useTourStore = create<POSTTourState>((set, get) => ({
    step: 1,
    formData: initialFormData,
    pendingImages: initialPendingImages,
    isSubmitting: false,
    destinations: [],
    isLoadingDestinations: false, setDestinations: (destinations) => set({ destinations }),
    setIsLoadingDestinations: (isLoading: boolean) => set({ isLoadingDestinations: isLoading }),
    nextStep: () => set((state) => ({ step: state.step + 1 })),
    prevStep: () => set((state) => ({ step: state.step - 1 })),
    getTotalSteps: () => 6,

    setBasicTourInfo: (data) => set((state) => ({
        formData: { ...state.formData, ...data }
    })),
    setTourScheDuleInfo: (data) => set((state) => ({
        formData: { ...state.formData, ...data }
    })),
    setTourAdditionalInfo: (data) => set((state) => ({
        formData: { ...state.formData, ...data }
    })),
    setTourDestination: (data) => set((state) => ({
        formData: { ...state.formData, ...data }
    })),
    setTourTicket: (data) => set((state) => ({
        formData: { ...state.formData, ...data }
    })),

    // Tour image methods
    setPendingTourImages: (files) => set((state) => ({
        pendingImages: {
            ...state.pendingImages,
            tourImages: [...state.pendingImages.tourImages, ...files]
        }
    })),
    removePendingTourImage: (index) => set((state) => ({
        pendingImages: {
            ...state.pendingImages,
            tourImages: state.pendingImages.tourImages.filter((_, i) => i !== index)
        }
    })),

    setPendingDestinationImages: (destinationIndex, files) => set((state) => {
        const updatedDestinationImages = { ...state.pendingImages.destinationImages };

        if (!updatedDestinationImages[destinationIndex]) {
            updatedDestinationImages[destinationIndex] = [];
        }

        updatedDestinationImages[destinationIndex] = [
            ...updatedDestinationImages[destinationIndex],
            ...files
        ];

        return {
            pendingImages: {
                ...state.pendingImages,
                destinationImages: updatedDestinationImages
            }
        };
    }),
    removePendingDestinationImage: (destinationIndex, imageIndex) => set((state) => {
        const updatedDestinationImages = { ...state.pendingImages.destinationImages };

        if (updatedDestinationImages[destinationIndex]) {
            updatedDestinationImages[destinationIndex] = updatedDestinationImages[destinationIndex]
                .filter((_, i) => i !== imageIndex);
        }

        return {
            pendingImages: {
                ...state.pendingImages,
                destinationImages: updatedDestinationImages
            }
        };
    }),
    submitForm: async () => {
        const { formData, pendingImages } = get();
        set({ isSubmitting: true });

        try {
            // 1.upload img tour first
            let finalTourImageUrls = [...formData.img];

            if (pendingImages.tourImages.length > 0) {
                // console.log(`Uploading ${pendingImages.tourImages.length} pending tour images...`);

                const tourUploadResponse = await uploadApiRequest.uploadTourImages(pendingImages.tourImages);
                // console.log('Tour images upload response:', tourUploadResponse);

                finalTourImageUrls = [...finalTourImageUrls, ...tourUploadResponse.urls];
            }


            const updatedDestinations = [...formData.destinations];

            // For each destination with pending images, upload them
            for (const [indexStr, files] of Object.entries(pendingImages.destinationImages)) {
                const destinationIndex = parseInt(indexStr, 10);

                if (files.length > 0 && updatedDestinations[destinationIndex]) {
                    // console.log(`Uploading ${files.length} pending images for destination ${destinationIndex}...`);

                    const destUploadResponse = await uploadApiRequest.uploadDestinationImages(files);
                    // console.log(`Destination ${destinationIndex} images upload response:`, destUploadResponse);

                    // Add new images to existing destination images
                    const existingImages = updatedDestinations[destinationIndex].img || [];
                    updatedDestinations[destinationIndex] = {
                        ...updatedDestinations[destinationIndex],
                        img: [...existingImages, ...destUploadResponse.urls]
                    };
                }
            }

            // Prepare the tour data with all uploaded image URLs
            const tourData = {
                ...formData,
                img: finalTourImageUrls,
                destinations: updatedDestinations
            };

            // console.log(JSON.stringify(tourData, null, 2));
            // Submit the tour data
            await tourApiService.postTour(tourData);
            console.log("Tour created successfully:", JSON.stringify(tourData, null, 2));
            toast.success("Tour đã được tạo thành công!");

            // Reset form data, step, and clear pending images
            set({
                formData: initialFormData,
                step: 1,
                isSubmitting: false,
                pendingImages: initialPendingImages  // Clear all pending images
            });
        } catch (error) {
            // console.error("Failed to submit tour:", error);
            toast.error("Có lỗi xảy ra khi tạo tour. Vui lòng thử lại!");
            set({ isSubmitting: false });
        }
    },
    resetForm: () => set({ formData: initialFormData, step: 1, pendingImages: initialPendingImages })
}));

export default useTourStore;
