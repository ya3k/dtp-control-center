import { DailyTicketSchedule } from "@/types/tours";
import { create } from "zustand";

type TourDetailServiceState =  {
  showPackage: boolean;
  calendarOpen: boolean;
  date: Date | undefined;
  ticketSchedule: DailyTicketSchedule[];
  selectedDayTickets: any[];
  ticketQuantities: { [key: string]: number };
  totalPrice: number;
}

type TourDetailServiceActions = {
    setShowPackage: (show: boolean) => void;
    setCalendarOpen: (open: boolean) => void;
    setDate: (date: Date | undefined) => void;
    setTicketSchedule: (schedule: DailyTicketSchedule[] | []) => void;
    handleDateSelect: (selectedDate: Date | undefined) => void;
    handleConfirmDateSelection: () => void;
    handleQuantityChange: (ticketId: string, netCost: number, increment: boolean) => void;
    clearAll: () => void;
    togglePackage: () => void;
}

export type CartStoreType = TourDetailServiceState & TourDetailServiceActions;

const useServiceSectionStore = create<CartStoreType>((set, get) => ({
    // Initial states
    showPackage: false,
    calendarOpen: false,
    date: undefined,
    ticketSchedule: [],
    selectedDayTickets: [],
    ticketQuantities: {},
    totalPrice: 0,
    
    // Actions
    setShowPackage: (show:boolean) => set({ showPackage: show }),
    
    setCalendarOpen: (open:boolean) => set({ calendarOpen: open }),
    
    setDate: (date:Date | undefined) => set({ date }),

    setTicketSchedule: (schedule: DailyTicketSchedule[]) => set({ ticketSchedule: schedule }),
    
    handleDateSelect: (selectedDate) => {
      set({ date: selectedDate });
      
      if (!selectedDate) {
        set({ showPackage: false });
        return;
      }
      
      const { ticketSchedule } = get();
      const selectedDayData = ticketSchedule.find(
        (day) => new Date(day.day).toDateString() === selectedDate.toDateString()
      );
  
      if (selectedDayData) {
        const initialQuantities: { [key: string]: number } = {};
        selectedDayData.ticketSchedules.forEach((ticket) => {
          initialQuantities[ticket.ticketTypeId] = 0;
        });
        
        set({
          selectedDayTickets: selectedDayData.ticketSchedules,
          ticketQuantities: initialQuantities,
          totalPrice: 0
        });
      } else {
        set({
          selectedDayTickets: [],
          ticketQuantities: {},
          totalPrice: 0
        });
      }
    },
    
    handleConfirmDateSelection: () => {
      const { date, handleDateSelect } = get();
      handleDateSelect(date);
      set({ showPackage: true, calendarOpen: false });
    },
    
    handleQuantityChange: (ticketId, netCost, increment) => {
      const { ticketQuantities, totalPrice, selectedDayTickets } = get();
      
      const currentQuantity = ticketQuantities[ticketId] || 0;
      const availableTicket = selectedDayTickets.find(
        ticket => ticket.ticketTypeId === ticketId
      )?.availableTicket || 0;
      
      let newQuantity: number;
      if (increment) {
        newQuantity = currentQuantity < availableTicket ? currentQuantity + 1 : currentQuantity;
      } else {
        newQuantity = Math.max(0, currentQuantity - 1);
      }
      
      const priceDifference = increment ? netCost : -netCost;
      const newTotalPrice = totalPrice + priceDifference;
      
      set({
        ticketQuantities: { ...ticketQuantities, [ticketId]: newQuantity },
        totalPrice: newTotalPrice
      });
    },
    
    clearAll: () => {
      set({
        date: undefined,
        selectedDayTickets: [],
        ticketQuantities: {},
        totalPrice: 0,
        showPackage: false,
      });
    },
    
    togglePackage: () => {
      const { showPackage } = get();
      set({ showPackage: !showPackage });
    }
  }));
  
  export default useServiceSectionStore;


