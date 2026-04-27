'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ShoppingBag, ChevronDown, ChevronRight,
  RefreshCw, Store, Loader2, CalendarDays, Receipt,
} from 'lucide-react'
import { usePreorder } from '@/hooks/usePreorder'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
const PER_PAGE = 10

interface OrderItem {
  menuId: string
  name: string
  price: number
  quantity: number
}

interface OrderRecord {
  _id: string
  venueId: string
  items: OrderItem[]
  total: number
  updatedAt: string
}

export default function OrderHistoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { add } = usePreorder()

  const [orders,     setOrders]     = useState<OrderRecord[]>([])
  const [loading,    setLoading]    = useState(true)
  const [venueNames, setVenueNames] = useState<Record<string, string>>({})
  const [expanded,   setExpanded]   = useState<Set<string>>(new Set())
  const [page,       setPage]       = useState(1)
  const [toast,      setToast]      = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/signin')
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return
    const token = (session?.user as any)?.token
    if (!token) { setLoading(false); return }

    fetch(`${API_URL}/api/v1/preorders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(j => setOrders(j.data ?? []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [status, session])

  useEffect(() => {
    fetch(`${API_URL}/api/v1/restaurants`)
      .then(r => r.json())
      .then(j => {
        const map: Record<string, string> = {}
        for (const v of j.data ?? []) map[v._id] = v.name
        setVenueNames(map)
      })
      .catch(() => {})
  }, [])

  function toggle(id: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function handleReorder(order: OrderRecord) {
    for (const item of order.items) {
      add({
        _id: item.menuId,
        name: item.name,
        price: item.price,
        category: '',
        venueId: order.venueId,
      })
    }
    showToast('Items added to your pre-order!')
    router.push(
      `/menu?venueId=${order.venueId}&venueName=${encodeURIComponent(
        venueNames[order.venueId] || order.venueId
      )}`
    )
  }

  // ── Loading / Auth guard ────────────────────────────────────────────────
  if (status === 'loading' || loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 size={28} className="text-yellow-500 animate-spin" />
      </main>
    )
  }

  // ── Empty state ─────────────────────────────────────────────────────────
  if (orders.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6 px-6">
        <Receipt size={48} className="text-zinc-700" />
        <div className="text-center">
          <h1 className="text-xl text-yellow-500 font-normal mb-2">No Order History</h1>
          <p className="text-zinc-500 text-sm">You haven't placed any orders yet.</p>
        </div>
        <Link
          href="/menu"
          className="px-6 py-2.5 bg-yellow-500 text-black font-medium rounded hover:bg-yellow-400 transition text-sm"
        >
          Browse Menus
        </Link>
      </main>
    )
  }

  const totalPages = Math.ceil(orders.length / PER_PAGE)
  const paginated  = orders.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-yellow-500 text-black text-sm font-medium px-5 py-2.5 shadow-lg rounded">
          {toast}
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/menu" className="text-zinc-500 text-xs hover:text-yellow-400 transition">
            ← Back to Menu
          </Link>
          <h1 className="text-2xl text-yellow-500 font-normal mt-3">Order History</h1>
          <p className="text-zinc-500 text-xs tracking-widest uppercase mt-1">
            {orders.length} order{orders.length !== 1 ? 's' : ''} total
          </p>
        </div>

        {/* Order list */}
        <div className="flex flex-col gap-4">
          {paginated.map(order => {
            const subtotal   = order.items.reduce((s, i) => s + i.price * i.quantity, 0)
            const venueName  = venueNames[order.venueId] || order.venueId
            const dateStr    = new Date(order.updatedAt).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'short', year: 'numeric',
            })
            const isOpen = expanded.has(order._id)

            return (
              <div key={order._id} className="border border-zinc-800 rounded-lg overflow-hidden">
                {/* Row header */}
                <div className="flex items-center bg-[#111] px-5 py-4 gap-3">
                  <button
                    onClick={() => toggle(order._id)}
                    className="flex-1 flex items-center gap-3 text-left"
                  >
                    <Store size={15} className="text-yellow-600/50 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-yellow-400 text-sm font-medium truncate">{venueName}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                        <span className="flex items-center gap-1 text-zinc-600 text-xs">
                          <CalendarDays size={10} /> {dateStr}
                        </span>
                        <span className="text-zinc-700 text-xs">·</span>
                        <span className="text-zinc-600 text-xs">{order.items.length} item(s)</span>
                        <span className="text-zinc-700 text-xs">·</span>
                        <span className="text-yellow-500 text-xs font-mono">฿{subtotal.toFixed(2)}</span>
                      </div>
                    </div>
                    <span className="ml-auto text-zinc-500 shrink-0">
                      {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </span>
                  </button>

                  {/* Re-order */}
                  <button
                    onClick={() => handleReorder(order)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-700 text-zinc-400
                               text-xs rounded hover:border-yellow-500 hover:text-yellow-500 transition shrink-0"
                  >
                    <RefreshCw size={11} /> Re-order
                  </button>
                </div>

                {/* Order detail */}
                {isOpen && (
                  <div className="border-t border-zinc-800 divide-y divide-zinc-900">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between px-5 py-3 bg-[#0a0a0a]">
                        <div>
                          <p className="text-white text-sm">{item.name}</p>
                          <p className="text-zinc-500 text-xs">฿{item.price.toFixed(2)} × {item.quantity}</p>
                        </div>
                        <p className="text-yellow-400 text-sm font-mono">
                          ฿{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                    <div className="flex justify-between px-5 py-3 bg-[#0d0d0d]">
                      <span className="text-zinc-500 text-xs uppercase tracking-widest">Total</span>
                      <span className="text-yellow-400 text-sm font-mono font-medium">
                        ฿{subtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border border-zinc-700 text-zinc-400 text-xs rounded
                         hover:border-yellow-500 hover:text-yellow-500 transition disabled:opacity-40"
            >
              ← Prev
            </button>
            <span className="text-zinc-600 text-xs">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 border border-zinc-700 text-zinc-400 text-xs rounded
                         hover:border-yellow-500 hover:text-yellow-500 transition disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
