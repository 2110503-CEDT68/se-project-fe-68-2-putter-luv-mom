'use client'

import Link from 'next/link'
import PreorderList from '@/components/PreorderList'
import { usePreorder } from '@/hooks/usePreorder'
import { usePreorderPersist } from '@/hooks/usePreorderPersist'

export default function PreorderPage() {
  const { items, total } = usePreorder()
  usePreorderPersist()

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/menu" className="text-zinc-500 text-sm hover:text-yellow-400 transition">
            ← Back to Menu
          </Link>
          <h1 className="text-2xl text-yellow-500 font-normal mt-4">Your Pre-order</h1>
          <p className="text-zinc-500 text-xs tracking-widest uppercase mt-1">
            Review your selected items
          </p>
        </div>

        <PreorderList />

        {items.length > 0 && (
          <div className="mt-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Order Total</p>
                <p className="text-yellow-400 text-xl font-semibold">฿{total.toFixed(2)}</p>
              </div>
              <button className="px-6 py-2 bg-yellow-500 text-black font-medium rounded hover:bg-yellow-400 transition">
                Confirm Pre-order
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
