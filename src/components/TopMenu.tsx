'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
  AudioWaveform, Search, MapPin, BookOpen,
  Receipt, CalendarCheck, CalendarPlus, ChevronDown,
  ShoppingBag,
} from 'lucide-react'
import AuthButton from './AuthButton'

interface DropItem {
  href: string
  icon: React.ReactNode
  label: string
}

function NavDropdown({ label, items }: { label: string; items: DropItem[] }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onOutsideClick)
    return () => document.removeEventListener('mousedown', onOutsideClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium tracking-wide border transition-all duration-200 ${
          open
            ? 'bg-yellow-500 text-black border-yellow-500'
            : 'text-yellow-500 border-yellow-500/40 hover:border-yellow-500 hover:bg-yellow-500/10'
        }`}
      >
        {label}
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-52 bg-[#0f0f0f] border border-yellow-600/30 shadow-2xl z-50">
          {items.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-xs text-gray-300
                         hover:bg-yellow-500/10 hover:text-yellow-400
                         transition-colors border-b border-yellow-600/10 last:border-b-0"
            >
              <span className="text-yellow-600/60 shrink-0">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function TopMenu() {
  return (
    <div className="h-16 bg-black fixed top-0 w-full z-50 border-b border-yellow-600/40">
      <div className="max-w-7xl mx-auto h-full px-6 flex justify-between items-center">

        {/* ── Logo ──────────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <AudioWaveform className="text-yellow-500" size={22} />
          <h1 className="font-playfair text-xl font-bold tracking-widest text-yellow-500">
            NEWWAVE
          </h1>
        </Link>

        {/* ── Nav ───────────────────────────────────────────── */}
        <div className="flex items-center gap-2">

          {/* Discover */}
          <NavDropdown
            label="Discover"
            items={[
              { href: '/search', icon: <Search size={13} />,  label: 'Search Restaurants' },
              { href: '/map',    icon: <MapPin size={13} />,  label: 'Map View' },
            ]}
          />

          {/* Orders */}
          <NavDropdown
            label="Orders"
            items={[
              { href: '/menu',          icon: <BookOpen size={13} />,   label: 'Browse Menu' },
              { href: '/my-orders',     icon: <ShoppingBag size={13} />, label: 'My Orders' },
              { href: '/order-history', icon: <Receipt size={13} />,    label: 'Order History' },
            ]}
          />

          {/* Reservations */}
          <NavDropdown
            label="Reservations"
            items={[
              { href: '/mybooking', icon: <CalendarCheck size={13} />, label: 'My Reservations' },
            ]}
          />

          {/* ── New Reservation CTA ── prominent solid button */}
          <Link
            href="/booking"
            className="flex items-center gap-2 px-4 py-2
                       bg-yellow-500 text-black text-xs font-bold tracking-widest uppercase
                       hover:bg-yellow-400 active:scale-95
                       transition-all duration-200 shadow-[0_0_16px_rgba(234,179,8,0.3)]"
          >
            <CalendarPlus size={14} />
            Book Now
          </Link>

          {/* ── Auth (unchanged) ─────────────────────────────── */}
          <AuthButton />
        </div>
      </div>
    </div>
  )
}
