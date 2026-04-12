'use client'

import Link from 'next/link'

interface MenuFormActionsProps {
  submitLabel: string
  cancelHref: string
  loading?: boolean
}

export default function MenuFormActions({
  submitLabel,
  cancelHref,
  loading = false,
}: MenuFormActionsProps) {
  return (
    <div className="flex gap-3 justify-end pt-2">
      <Link
        href={cancelHref}
        className="px-4 py-2 text-sm text-zinc-300 border border-zinc-600 rounded hover:bg-zinc-800 transition"
      >
        Cancel
      </Link>
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 text-sm bg-yellow-500 text-black font-medium rounded hover:bg-yellow-400 transition disabled:opacity-50"
      >
        {loading ? 'Saving...' : submitLabel}
      </button>
    </div>
  )
}
