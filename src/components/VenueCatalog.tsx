import Link from "next/link"
import { VenueItem, VenueJson } from "@/../interface"
import { MapPin, Phone, Clock, Star } from "lucide-react"

export default function VenueCatalog({ venuesJson }: { venuesJson: VenueJson }) {
    const restaurants: VenueItem[] = venuesJson.data

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
            {restaurants.map((r) => (
                <Link href={`/venue/${r._id}`} key={r._id}>
                    <div className="group bg-[#0f0f0f] border border-yellow-600/15
                                    hover:border-yellow-500/50 hover:bg-[#141414]
                                    transition-all duration-300 p-6 flex flex-col gap-4 h-full cursor-pointer">

                        {/* Header */}
                        <div className="flex justify-between items-start">
                            <h2 className="font-playfair text-lg text-yellow-500 font-bold leading-snug flex-1 pr-2">
                                {r.name}
                            </h2>
                            {/* Rating badge */}
                            <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 shrink-0">
                                <Star size={10} className="text-yellow-400 fill-yellow-400" />
                                <span className="text-yellow-400 text-xs font-medium">
                                    {r.averageRating === "No Review" ? "—" : r.averageRating}
                                </span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-yellow-600/10 group-hover:bg-yellow-600/20 transition-colors" />

                        {/* Info */}
                        <div className="flex flex-col gap-2.5 flex-1">
                            <div className="flex items-start gap-2">
                                <MapPin size={12} className="text-yellow-600/50 mt-0.5 shrink-0" />
                                <p className="text-gray-400 text-xs leading-relaxed">{r.address}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={12} className="text-yellow-600/50 shrink-0" />
                                <p className="text-gray-500 text-xs">{r.tel}</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-yellow-600/10">
                            <div className="flex items-center gap-1.5">
                                <Clock size={11} className="text-green-500/70" />
                                <span className="text-green-500/80 text-xs">
                                    {r.opentime} – {r.closetime}
                                </span>
                            </div>
                            <span className="text-gray-700 text-xs">
                                {r.reviewCount} {r.reviewCount === 1 ? "review" : "reviews"}
                            </span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}