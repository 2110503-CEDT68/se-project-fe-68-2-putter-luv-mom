import Link from 'next/link'
import { Star, MapPin, BookOpen } from 'lucide-react'
import { getRestaurants, RestaurantItem } from '@/libs/getRestaurants'
import { sortRestaurants } from '@/libs/searchUtils'

async function getTopRestaurants(): Promise<RestaurantItem[]> {
  try {
    const json = await getRestaurants()
    const all  = json.data ?? []
    const sorted = sortRestaurants(all, 'rating_desc')
    return sorted.filter(r => parseFloat(String(r.averageRating)) > 0).slice(0, 4)
  } catch {
    return []
  }
}

export default async function RecommendedSection() {
  const restaurants = await getTopRestaurants()
  if (restaurants.length === 0) return null

  return (
    <section className="px-6 py-16 bg-[#070707]">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-10">
          <p className="text-yellow-500 text-xs tracking-[0.4em] uppercase mb-4">Top Picks</p>
          <h2 className="font-playfair text-3xl font-bold text-white tracking-widest mb-2">
            Recommended
          </h2>
          <div className="flex items-center gap-4 w-40 mx-auto">
            <div className="flex-1 h-px bg-yellow-500/40" />
            <span className="text-yellow-500/60 text-xs">★</span>
            <div className="flex-1 h-px bg-yellow-500/40" />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {restaurants.map((r, i) => {
            const ratingNum = parseFloat(String(r.averageRating))
            return (
              <div
                key={r._id}
                className="group relative bg-[#0f0f0f] border border-yellow-600/15
                           hover:border-yellow-500/50 hover:bg-[#141414]
                           transition-all duration-300 p-5 flex flex-col gap-3"
              >
                {/* Rank badge */}
                <div className="absolute top-3 right-3 w-6 h-6 bg-yellow-500 flex items-center justify-center">
                  <span className="text-black text-xs font-bold">#{i + 1}</span>
                </div>

                {/* Name */}
                <Link href={`/venue/${r._id}`} className="pr-8">
                  <h3 className="font-playfair text-base text-yellow-500 font-bold leading-snug
                                 hover:text-yellow-400 transition line-clamp-2">
                    {r.name}
                  </h3>
                </Link>

                {/* Rating stars */}
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        size={11}
                        className={
                          ratingNum >= s ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'
                        }
                      />
                    ))}
                  </div>
                  <span className="text-yellow-400 text-xs font-medium">{ratingNum.toFixed(1)}</span>
                  <span className="text-gray-700 text-xs">({r.reviewCount})</span>
                </div>

                {/* Address */}
                <div className="flex items-start gap-1.5 flex-1">
                  <MapPin size={11} className="text-yellow-600/40 mt-0.5 shrink-0" />
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{r.address}</p>
                </div>

                {/* CTA */}
                <Link
                  href={`/menu?venueId=${r._id}&venueName=${encodeURIComponent(r.name)}`}
                  className="flex items-center justify-center gap-1.5 text-xs py-1.5
                             text-black bg-yellow-500 hover:bg-yellow-400 transition-all duration-200"
                >
                  <BookOpen size={11} /> View Menu
                </Link>
              </div>
            )
          })}
        </div>

        {/* See all */}
        <div className="text-center mt-8">
          <Link
            href="/venue"
            className="text-xs text-yellow-500 border border-yellow-500/40 px-6 py-2
                       hover:bg-yellow-500 hover:text-black transition"
          >
            See All Restaurants →
          </Link>
        </div>
      </div>
    </section>
  )
}
