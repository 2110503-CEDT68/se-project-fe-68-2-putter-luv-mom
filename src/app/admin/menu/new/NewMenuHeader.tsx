'use client'

import Link from 'next/link'

export default function NewMenuHeader() {
  return (
    <div className="mb-8">
      <Link
        href="/admin/menu"
        className="text-zinc-500 text-sm hover:text-yellow-400 transition"
      >
        ← Back to Menu List
      </Link>
      <h1 className="text-2xl text-yellow-500 font-normal mt-4">Add New Menu Item</h1>
      <p className="text-zinc-500 text-xs tracking-widest uppercase mt-1">
        Fill in the details to create a new menu item
      </p>
    </div>
  )
}
