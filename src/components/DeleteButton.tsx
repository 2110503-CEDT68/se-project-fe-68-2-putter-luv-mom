'use client'

import { useState } from 'react'
import ConfirmDialog from './ConfirmDialog'

interface DeleteButtonProps {
  itemName: string
  onConfirm: () => Promise<void>
}

export default function DeleteButton({ itemName, onConfirm }: DeleteButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1 text-xs border border-red-700 text-red-400 rounded hover:bg-red-900/30 transition"
      >
        Delete
      </button>
      <ConfirmDialog
        open={open}
        title="Delete Menu Item"
        message={`Are you sure you want to delete "${itemName}"? This action cannot be undone.`}
        onConfirm={handleConfirm}
        onCancel={() => !loading && setOpen(false)}
      />
    </>
  )
}
