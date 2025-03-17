import { create } from "zustand"
import type { CreateTourBodyType, TourResType } from "@/schemaValidations/tour-operator.shema"
import tourApiService from "@/apiRequests/tour"

interface TourState {
  // Data
  tours: TourResType[]
  totalCount: number

  // UI states
  loading: boolean
  error: string | null
  currentQuery: string

  // Actions
  setQuery: (query: string) => void
  fetchTour: () => Promise<void>
  createTour: (tour: CreateTourBodyType) => Promise<CreateTourBodyType | null>
  updateTour: (id: string, tour: Partial<CreateTourBodyType>) => Promise<TourResType | null>
  deleteTour: (id: string) => Promise<boolean>
}

export const useOpTourStore = create<TourState>((set, get) => ({
  // Initial state
  tours: [],
  totalCount: 0,
  loading: false,
  error: null,
  currentQuery: "",

  // Set the current OData query
  setQuery: (query: string) => set({ currentQuery: query }),

  // Fetch tours based on the current query
  fetchTour: async () => {
    const query = get().currentQuery
    set({ loading: true, error: null })

    try {
      const response = await tourApiService.getWithOData(query)
      set({
        tours: response.payload.value || [],
        totalCount: response.payload["@odata.count"] || 0,
        loading: false,
      })
      return
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      set({ error: errorMessage, loading: false })
    }
  },

  // Create a new tour
  createTour: async (tourData) => {
    set({ loading: true, error: null })

    try {
      const response = await tourApiService.create(tourData)
      await get().fetchTour()
      return response.payload.value[0]
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create tour"
      set({ error: errorMessage, loading: false })
      return null
    }
  },

  // Update an existing tour
  updateTour: async (id, tourData) => {
    set({ loading: true, error: null })

    try {
      const response = await tourApiService.update(id, tourData)
      await get().fetchTour()
      return response.payload.value[0]
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update tour"
      set({ error: errorMessage, loading: false })
      return null
    }
  },

  // Delete a tour
  deleteTour: async (id) => {
    set({ loading: true, error: null })

    try {
      await tourApiService.delete(id)
      await get().fetchTour()
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete tour"
      set({ error: errorMessage, loading: false })
      return false
    }
  },
}))

