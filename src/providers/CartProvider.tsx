'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import { CartStoreType, createCartStore } from '@/store/client/cartStore'


export type CartStoreApi = ReturnType<typeof createCartStore>

export const CartContext = createContext<CartStoreApi | undefined>(
  undefined,
)

export interface CartProviderProps {
  children: ReactNode
}

export const CartProvider = ({
  children,
}: CartProviderProps) => {
  const storeRef = useRef<CartStoreApi>()
  if (!storeRef.current) {
    storeRef.current = createCartStore()
  }

  return (
    <CartContext.Provider value={storeRef.current}>
      {children}
    </CartContext.Provider>
  )
}

export const useCartStore = <T,>(
  selector: (store: CartStoreType) => T,
): T => {
  const cartContext = useContext(CartContext)
  if (!cartContext) {
    throw new Error(`useCartStore must be used within AuthProvider`)
  }

  return useStore(cartContext, selector)
}
