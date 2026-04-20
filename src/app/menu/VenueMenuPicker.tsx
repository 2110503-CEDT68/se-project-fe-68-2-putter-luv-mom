import Link from 'next/link'
import { UtensilsCrossed, Star, MapPin } from 'lucide-react'

interface Venue {
  _id: string
  name: string
  address: string
  averageRating: string | number
  reviewCount: number
}

interface VenueMenuPickerProps {
  venues: Venue[]
}

export default function VenueMenuPicker({ venues }: VenueMenuPickerProps) {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <p className="text-yellow-500 text-xs tracking-[0.4em] uppercase mb-3">Browse by Restaurant</p>
          <h1 className="font-playfair text-4xl font-bold text-yellow-500 tracking-widest mb-2">Select a Menu</h1>
          <p className="text-zinc-500 text-sm">Choose a restaurant to view its menu and pre-order</p>
        </div>

        {venues.length === 0 ? (
          <p className="text-center text-zinc-500 py-20">No restaurants available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {venues.map((v) => (
              <Link
                key={v._id}
                href={`/menu?venueId=${v._id}&venueName=${encodeURIComponent(v.name)}`}
                className="group bg-[#0f0f0f] border border-yellow-600/15
                           hover:border-yellow-500/50 hover:bg-[#141414]
                           transition-all duration-300 p-6 flex flex-col gap-3"
              >
                <div className="flex justify-between items-start gap-2">
                  <h2 className="font-playfair text-lg text-yellow-500 font-bold leading-snug flex-1">
                    {v.name}
                  </h2>
                  <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 shrink-0">
                    <Star size={10} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400 text-xs font-medium">
                      {v.averageRating === 'No Review' ? '—' : v.averageRating}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin size={12} className="text-yellow-600/50 mt-0.5 shrink-0" />
                  <p className="text-zinc-500 text-xs leading-relaxed">{v.address}</p>
                </div>

                <div className="flex items-center gap-2 mt-1 pt-3 border-t border-yellow-600/10">
                  <UtensilsCrossed size={12} className="text-yellow-500/60" />
                  <span className="text-yellow-500/70 text-xs tracking-wider group-hover:text-yellow-500 transition-colors">
                    View Menu →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
