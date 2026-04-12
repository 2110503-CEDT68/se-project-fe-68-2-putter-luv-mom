import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface PreorderItem {
  id: string
  name: string
  price: number
  category: string
  venueId: string
  quantity: number
}

interface PreorderState {
  items: PreorderItem[]
}

const initialState: PreorderState = {
  items: [],
}

const preorderSlice = createSlice({
  name: 'preorder',
  initialState,
  reducers: {
    addToPreorder(state, action: PayloadAction<Omit<PreorderItem, 'quantity'>>) {
      const existing = state.items.find((item) => item.id === action.payload.id)
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
    },
    removeFromPreorder(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.items.find((i) => i.id === action.payload.id)
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity)
      }
    },
    clearPreorder(state) {
      state.items = []
    },
  },
})

export const { addToPreorder, removeFromPreorder, updateQuantity, clearPreorder } =
  preorderSlice.actions

export default preorderSlice.reducer
