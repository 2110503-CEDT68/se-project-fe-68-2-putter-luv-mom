'use client'

import Link from 'next/link'
import DeleteButton from './DeleteButton'

interface MenuActionsProps {
  id: string
  name: string
  onDeleted: (id: string) => void
  onDelete: () => Promise<void>
}

export default function MenuActions({ id, name, onDeleted, onDelete }: MenuActionsProps) {
  return (
    <div className="flex gap-2">
      <Link
        href={`/admin/menu/${id}/edit`}
        className="px-3 py-1 text-xs border border-zinc-600 text-zinc-300 rounded hover:bg-zinc-700 transition"
      >
        Edit
      </Link>
      <DeleteButton
        itemName={name}
        onConfirm={async () => {
          await onDelete()
          onDeleted(id)
        }}
      />
    </div>
  )
}
