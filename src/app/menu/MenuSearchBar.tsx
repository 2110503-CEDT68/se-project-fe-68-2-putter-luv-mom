'use client'

interface MenuSearchBarProps {
  value: string
  onChange: (v: string) => void
}

export default function MenuSearchBar({ value, onChange }: MenuSearchBarProps) {
  return (
    <div className="relative mb-6">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search menu items..."
        className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-2 text-sm pr-10 focus:outline-none focus:border-yellow-500"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs"
        >
          ✕
        </button>
      )}
    </div>
  )
}
