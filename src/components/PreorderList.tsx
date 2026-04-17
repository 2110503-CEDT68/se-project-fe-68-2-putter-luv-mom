'use client'

import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { removeFromPreorder, updateQuantity, clearPreorder } from '@/redux/features/preorderSlice'

export default function PreorderList() {
  const dispatch = useDispatch()
  const items = useSelector((state: RootState) => state.preorder.items)

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (items.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <h2 className="text-white font-medium mb-2">Pre-order List</h2>
        <p className="text-zinc-500 text-sm">No items added yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-medium">Pre-order List</h2>
        <button
          onClick={() => dispatch(clearPreorder())}
          className="text-xs text-zinc-500 hover:text-red-400 transition"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 border-b border-zinc-800 pb-3">
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm truncate">{item.name}</p>
              <p className="text-zinc-500 text-xs">฿{item.price.toFixed(2)} each</p>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                className="w-6 h-6 flex items-center justify-center bg-zinc-700 text-white rounded hover:bg-zinc-600 text-sm"
              >
                −
              </button>
              <span className="w-6 text-center text-white text-sm">{item.quantity}</span>
              <button
                onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                className="w-6 h-6 flex items-center justify-center bg-zinc-700 text-white rounded hover:bg-zinc-600 text-sm"
              >
                +
              </button>
            </div>

            <span className="text-yellow-400 text-sm w-16 text-right">
              ฿{(item.price * item.quantity).toFixed(2)}
            </span>

            <button
              onClick={() => dispatch(removeFromPreorder(item.id))}
              className="text-zinc-600 hover:text-red-400 transition text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-700">
        <span className="text-zinc-400 text-sm">Total</span>
        <span className="text-yellow-400 font-semibold">฿{total.toFixed(2)}</span>
      </div>
    </div>
  )
}
