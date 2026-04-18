'use client'

import Link from 'next/link'

export default function PreorderEmpty() {
  return (
    <div className="text-center py-16">
      <p className="text-zinc-500 text-sm mb-4">Your pre-order list is empty.</p>
      <Link
        href="/menu"
        className="px-4 py-2 text-sm bg-yellow-500 text-black font-medium rounded hover:bg-yellow-400 transition"
      >
        Browse Menu
      </Link>
    </div>
  )
}
