import { POSTBasicTourInfoType, POSTTourAdditionalInfoType, POSTTourDestinationType, POSTTourScheduleInfoType, POSTTourTicketType, POSTTourType } from "@/schemaValidations/crud-tour.schema";
import { create } from "zustand";


interface POSTTourState{
    step: number;
    formData: POSTTourType;
    nextStep: () => void;
    prevStep: () => void;
    getTotalSteps: () => number;
    setBasicTourInfo: (data: Partial<POSTBasicTourInfoType>) => void;
    setTourScheDuleInfo: (data: Partial<POSTTourScheduleInfoType>) => void;
    setTourAdditionalInfo: (data: Partial<POSTTourAdditionalInfoType>) => void;
    setTourDestination: (data: Partial<POSTTourDestinationType>) => void;
    setTourTicket: (data: Partial<POSTTourTicketType>) => void;
    submitForm: () => void;

}

const useTourStore = create<POSTTourState>((set, get) => ({
    step: 1,
    formData: {
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
    },
    nextStep: () => set((state) => ({ step: state.step + 1 })),
    prevStep: () => set((state) => ({ step: state.step - 1 })),
    getTotalSteps: () => 6, // Assuming 6 steps based on the interface methods
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
    submitForm: () => {
        // Implement form submission logic here
        console.log('Submitting form:', JSON.stringify(get().formData));
    }
}));

export default useTourStore;