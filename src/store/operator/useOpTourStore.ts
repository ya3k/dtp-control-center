import { create } from "zustand";

import tourApiRequest from "@/apiRequests/tour";
import { CreateTourBodyType, TourResType } from "@/schemaValidations/tour-operator.shema";

interface TourState {
    tours: TourResType[];
    loading: boolean;
    error: string | null;
    currentQuery: string;
    fetchTour: () => Promise<void>;
    setQuery: (query: string) => void;
    createTour: (tour: CreateTourBodyType) => Promise<CreateTourBodyType>;
    deleteTour: (id: string) => Promise<void>;
}

export const useOpTourStore = create<TourState>((set, get) => ({
    tours: [],
    loading: false,
    error: null,
    currentQuery: '',

    setQuery: (query: string) => set({ currentQuery: query }),

    fetchTour: async () => {
        const query = get().currentQuery;
        set({ loading: true, error: null });
        try {
            const response = await tourApiRequest.opGetAll(query);
            set({ tours: response.payload || [], loading: false });
        } catch (err) {
            set({ error: err instanceof Error ? err.message : 'Unknown error', loading: false });
        }
    },

    createTour: async (tourData) => {
        set({ loading: true, error: null });
        try {
            const newTour = await tourApiRequest.create(tourData);
            await get().fetchTour();
            return newTour.payload;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : "Failed to create tour", loading: false });
            throw error;
        }
    },


    deleteTour: async (id) => {
        set({ loading: true, error: null });
        try {
            await tourApiRequest.delete(id);
            await get().fetchTour();
        } catch (error) {
            set({ error: error instanceof Error ? error.message : "Failed to delete tour", loading: false });
            throw error;
        }
    },
}));
