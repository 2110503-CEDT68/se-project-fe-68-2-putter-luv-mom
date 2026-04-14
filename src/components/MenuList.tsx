'use client'

import { MenuItem, deleteMenu } from '@/libs/getMenus'
import { useMenuFilter } from '@/hooks/useMenuFilter'
import DeleteButton from './DeleteButton'
import Link from 'next/link'

interface MenuListProps {
  menus: MenuItem[]
  token: string
  onDeleted: (id: string) => void
}

export default function MenuList({ menus, token, onDeleted }: MenuListProps) {
  const {
    search, setSearch,
    categoryFilter, setCategoryFilter,
    toggleSort, sortArrow,
    categories,
    filtered,
  } = useMenuFilter(menus)
  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
          className="bg-zinc-800 border border-zinc-700 text-white rounded px-3 py-1.5 text-sm focus:outline-none focus:border-yellow-500"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 text-white rounded px-3 py-1.5 text-sm focus:outline-none focus:border-yellow-500"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-zinc-500 text-sm py-8 text-center">No menus found.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-700 text-zinc-400 text-left">
              <th className="pb-2 pr-4 cursor-pointer hover:text-yellow-400" onClick={() => toggleSort('name')}>
                Name{sortArrow('name')}
              </th>
              <th className="pb-2 pr-4 cursor-pointer hover:text-yellow-400" onClick={() => toggleSort('category')}>
                Category{sortArrow('category')}
              </th>
              <th className="pb-2 pr-4 cursor-pointer hover:text-yellow-400" onClick={() => toggleSort('price')}>
                Price{sortArrow('price')}
              </th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((menu) => (
              <tr key={menu._id} className="border-b border-zinc-800 hover:bg-zinc-800/40">
                <td className="py-2 pr-4 text-white">{menu.name}</td>
                <td className="py-2 pr-4 text-zinc-400">{menu.category}</td>
                <td className="py-2 pr-4 text-yellow-400">฿{menu.price.toFixed(2)}</td>
                <td className="py-2 flex gap-2">
                  <Link
                    href={`/admin/menu/${menu._id}/edit`}
                    className="px-3 py-1 text-xs border border-zinc-600 text-zinc-300 rounded hover:bg-zinc-700 transition"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    itemName={menu.name}
                    onConfirm={async () => {
                      await deleteMenu(token, menu._id)
                      onDeleted(menu._id)
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
