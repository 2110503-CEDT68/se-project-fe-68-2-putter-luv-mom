'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { MenuItem, getAllMenus } from '@/libs/getMenus'
import MenuList from '@/components/MenuList'

export default function AdminMenuPage() {
  const { data: session, status } = useSession()
  const [menus, setMenus] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const token = (session?.user as any)?.token ?? ''

  useEffect(() => {
    if (status === 'unauthenticated') redirect('/signin')
    if (status === 'authenticated' && (session?.user as any)?.role !== 'admin') redirect('/')
  }, [status, session])

  useEffect(() => {
    if (!token) return
    getAllMenus(token)
      .then((json) => setMenus(json.data))
      .catch(() => setError('Failed to load menus'))
      .finally(() => setLoading(false))
  }, [token])

  const handleDeleted = (id: string) => {
    setMenus((prev) => prev.filter((m) => m._id !== id))
  }

  if (status === 'loading' || loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-zinc-500">Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl text-yellow-500 font-normal">Menu Management</h1>
            <p className="text-zinc-500 text-xs tracking-widest uppercase mt-1">
              Manage all menu items
            </p>
          </div>
          <Link
            href="/admin/menu/new"
            className="px-4 py-2 bg-yellow-500 text-black text-sm font-medium rounded hover:bg-yellow-400 transition"
          >
            + Add Menu
          </Link>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <MenuList menus={menus} token={token} onDeleted={handleDeleted} />
      </div>
    </main>
  )
}
