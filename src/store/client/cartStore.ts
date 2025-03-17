import { createStore } from "zustand/vanilla";
import { createJSONStorage, persist } from "zustand/middleware";
import { TicketSchedule, TourDetail } from "@/types/tours";
import { isDateInPast } from "@/lib/utils";

// export interface CartItem {
//     tourScheduleId: string;
//     isTourScheduleAvailable: boolean;
//     tickets: {
//         availableTicket: number;
//         hasAvailableTicket: boolean;
//         quantity: number;
//         netCost: number;
//         tax: number;
//         isAvailable: boolean;
//         ticketKind: number;
//     }[];
// }

interface CartItem {
  tour: TourDetail;
  tourScheduleId: string;
  day: string;
  tickets: {
    ticketTypeId: string;
    ticketKind: number;
    netCost: number;
    quantity: number;
  }[];
  totalPrice: number;
}

type CartState = {
  cart: CartItem[];
  selectedItems: string[];
  selectAll: boolean;
  paymentItem: CartItem | null;
};

type CartActions = {
  addToCart: (
    tour: TourDetail,
    tourScheduleId: string,
    day: string,
    tickets: TicketSchedule[],
    quantities: { [ticketId: string]: number },
  ) => void;
  clearCart: () => void;
  removeFromCart: (tourScheduleId: string) => void;
  updateQuantity: (
    tourScheduleId: string,
    ticketTypeId: string,
    action: "increase" | "decrease",
  ) => void;
  selectItem: (itemId: string, checked: boolean) => void;
  removeSelectedItems: () => void;
  selectForPayment: (itemId: string) => void;
  removePaymentItem: () => void;
  toggleSelectAll: (checked: boolean) => void;
  
  getItemById: (tourScheduleId: string) => CartItem | undefined;
  getTotalPricePaymentItem: () => number;
  getCartTotal: () => number;
  getCartCount: () => number;
};

export type CartStoreType = CartState & CartActions;

const SESSION_TIMEOUT_DURATION = 7200 * 60 * 1000; // 30 minutes

let sessionTimeout: NodeJS.Timeout;

const initialState = {
  cart:[],
  selectedItems: [],
  selectAll: false,
  paymentItem: null,
}



export const createCartStore = (initState = initialState) => {
  return createStore<CartStoreType>()(
    persist(
      (set, get) => ({
        ...initState,
        addToCart: (tour, tourScheduleId, day, tickets, quantities) => {
          const { cart } = get();

          // Prepare ticket data with quantities
          const ticketsWithQuantity = tickets
            .filter((ticket) => quantities[ticket.ticketTypeId] > 0)
            .map((ticket) => ({
              ticketTypeId: ticket.ticketTypeId,
              ticketKind: ticket.ticketKind,
              netCost: ticket.netCost,
              quantity: quantities[ticket.ticketTypeId],
            }));

          // Calculate total price
          const totalPrice = ticketsWithQuantity.reduce(
            (sum, ticket) => sum + ticket.netCost * ticket.quantity,
            0,
          );

          // Create new cart item
          const newItem: CartItem = {
            tour,
            tourScheduleId,
            day,
            tickets: ticketsWithQuantity,
            totalPrice,
          };

          // Check if this tour schedule already exists in cart
          const existingItemIndex = cart.findIndex(
            (item) => item.tourScheduleId === tourScheduleId,
          );

          if (existingItemIndex >= 0) {
            // Replace existing item
            const updatedCart = [...cart];
            updatedCart[existingItemIndex] = newItem;
            set({ cart: updatedCart });
          } else {
            // Add new item
            console.log("Adding new item to cart:", newItem);
            set({ cart: [...cart, newItem] });
          }

          resetSessionTimeout();
        },
        clearCart: () => {
          set({ cart: [] });
          resetSessionTimeout();
        },

        removeFromCart: (tourScheduleId) => {
          const { cart, paymentItem } = get();

          const updatedCart = cart.filter(
            (item) => item.tourScheduleId !== tourScheduleId,
          );
          const updatedPaymentItem =
            paymentItem && paymentItem.tourScheduleId ? null : paymentItem;
          set({
            cart: updatedCart,
            paymentItem: updatedPaymentItem,
          });
          resetSessionTimeout();
        },
        updateQuantity: (tourScheduleId, ticketTypeId, action) => {
          const { cart } = get();

          // Find the cart item
          const updatedCart = [...cart];
          const itemIndex = updatedCart.findIndex(
            (item) => item.tourScheduleId === tourScheduleId,
          );

          if (itemIndex === -1) return; // Item not found

          // Find the specific ticket
          const item = updatedCart[itemIndex];
          const ticketIndex = item.tickets.findIndex(
            (ticket) => ticket.ticketTypeId === ticketTypeId,
          );

          if (ticketIndex === -1) return; // Ticket not found

          // Update the quantity
          const ticket = item.tickets[ticketIndex];
          const currentQuantity = ticket.quantity;

          if (action === "decrease" && currentQuantity <= 1) {
            // If there's only one ticket left and we're decreasing, consider removing the ticket
            if (item.tickets.length === 1) {
              // If it's the only ticket type, remove the entire item
              set({
                cart: cart.filter(
                  (item) => item.tourScheduleId !== tourScheduleId,
                ),
              });
              return;
            } else {
              // Remove just this ticket type
              item.tickets.splice(ticketIndex, 1);
            }
          } else {
            // Update the quantity
            const newQuantity =
              action === "increase" ? currentQuantity + 1 : currentQuantity - 1;
            item.tickets[ticketIndex] = {
              ...ticket,
              quantity: newQuantity,
            };
          }

          // Recalculate the total price for the item
          item.totalPrice = item.tickets.reduce(
            (sum, ticket) => sum + ticket.netCost * ticket.quantity,
            0,
          );

          // Update the cart
          set({ cart: updatedCart });
          resetSessionTimeout();
        },
        selectItem: (itemId, checked) => {
          set((state) => {
            let newSelectedItems;
            if (checked) {
              newSelectedItems = [...state.selectedItems, itemId];
            } else {
              newSelectedItems = state.selectedItems.filter(
                (id) => id !== itemId,
              );
            }
            // Update selectAll state
            const selectAll =
              state.cart.length > 0 &&
              newSelectedItems.length === state.cart.length;
            return {
              selectedItems: newSelectedItems,
              selectAll,
            };
          });
        },
        removeSelectedItems: () => {
          set((state) => {
            if (state.selectedItems.length === 0) return state;
            const updatedItems = state.cart.filter(
              (item) => !state.selectedItems.includes(item.tourScheduleId),
            );
            // Clear payment item if it was among the removed items
            const updatedPaymentItem = state.paymentItem && 
            state.selectedItems.includes(state.paymentItem.tourScheduleId)
            ? null
            : state.paymentItem;
            return {
              cart: updatedItems,
              selectedItems: [],
              paymentItem: updatedPaymentItem,
              selectAll: false,
            };
          });
        },
        selectForPayment: (itemId) => {
          const { cart } = get();
          const item = cart.find((item) => item.tourScheduleId === itemId);

          // Check if the item's date is in the past
          if (item && isDateInPast(item.day)) {
            // Don't allow selecting expired items
            return;
          }

          set({
            paymentItem: item,
          });
        },
        removePaymentItem: () => {
          set({
            paymentItem: null,
          });
        },
        toggleSelectAll: (checked) => {
          set((state) => {
            if (checked) {
              return {
                selectedItems: state.cart.map((item) => item.tourScheduleId),
                selectAll: true,
              };
            } else {
              return {
                selectedItems: [],
                selectAll: false,
              };
            }
          });
        },
        getItemById: (tourScheduleId) => {
          const { cart } = get();
          return cart.find((item) => item.tourScheduleId === tourScheduleId);
        },
        getTotalPricePaymentItem: () => {
          const { paymentItem } = get();
          return paymentItem ? paymentItem.totalPrice : 0;
        },
        getCartTotal: () => {
          const { cart } = get();
          return cart.reduce((total, item) => total + item.totalPrice, 0);
        },

        getCartCount: () => {
          const { cart } = get();
          return cart.length;
        },
      }),
      {
        name: "cart-store",
        storage: createJSONStorage(() => localStorage),
        onRehydrateStorage: () => resetSessionTimeout(),
      },
    ),
  );
};

function resetSessionTimeout() {
  clearTimeout(sessionTimeout);
  sessionTimeout = setTimeout(() => {
    localStorage.removeItem("cart-store");
  }, SESSION_TIMEOUT_DURATION);
}
