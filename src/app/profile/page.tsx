import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import { redirect } from "next/navigation"
import getUserProfile from "@/libs/getUserProfile"

const RANKING_COLORS: Record<string, string> = {
    Bronze: "text-amber-600 border-amber-600/50 bg-amber-600/10",
    Silver: "text-gray-300 border-gray-300/50 bg-gray-300/10",
    Gold: "text-yellow-400 border-yellow-400/50 bg-yellow-400/10",
}

const RANKING_LIMIT: Record<string, number> = {
    Bronze: 1,
    Silver: 2,
    Gold: 3,
}

export default async function ProfilePage() {
    const session = await getServerSession(authOptions)
    if (!session) redirect("/signin")

    const token = (session.user as any)?.token
    const profile = await getUserProfile(token)
    const u = profile.data

    const rankColor = RANKING_COLORS[u.ranking] || RANKING_COLORS.Bronze
    const rankLimit = RANKING_LIMIT[u.ranking] ?? 1

    return (
        <main className="min-h-screen bg-black text-white px-6 py-12">
            <div className="max-w-2xl mx-auto">

                <h1 className="font-playfair text-3xl font-bold text-yellow-500 mb-10">
                    My Profile
                </h1>

                <div className="bg-[#111] border border-yellow-600/20 p-8 flex flex-col gap-6">

                    {/* Avatar + Name */}
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-600/30
                                        flex items-center justify-center text-2xl font-playfair text-yellow-500">
                            {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">{u.name}</h2>
                            <p className="text-gray-500 text-sm">{u.email}</p>
                        </div>
                    </div>

                    {/* Ranking Badge */}
                    <div className={`inline-flex items-center gap-2 px-4 py-2 border w-fit ${rankColor}`}>
                        <span className="text-lg">★</span>
                        <span className="text-sm font-semibold tracking-widest uppercase">
                            {u.ranking} Member
                        </span>
                    </div>

                    {/* Info */}
                    <div className="grid grid-cols-1 gap-4 border-t border-yellow-600/10 pt-6">
                        <ProfileRow label="Full Name" value={u.name} />
                        <ProfileRow label="Email" value={u.email} />
                        <ProfileRow label="Phone" value={u.tel} />
                        <ProfileRow label="Role" value={u.role} />
                        <ProfileRow
                            label="Member Since"
                            value={new Date(u.createdAt).toLocaleDateString("en-GB", {
                                day: "numeric", month: "long", year: "numeric"
                            })}
                        />
                    </div>

                    {/* Booking Limit */}
                    <div className="border-t border-yellow-600/10 pt-6">
                        <p className="text-gray-500 text-xs tracking-widest uppercase mb-3">
                            Reservation Allowance
                        </p>
                        <div className="flex gap-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-8 h-8 border flex items-center justify-center text-xs
                                        ${i < rankLimit
                                            ? "border-yellow-500 bg-yellow-500/20 text-yellow-400"
                                            : "border-gray-700 text-gray-700"
                                        }`}
                                >
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                        <p className="text-gray-600 text-xs mt-2">
                            {u.ranking} members can make up to {rankLimit} reservation{rankLimit > 1 ? "s" : ""}
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}

function ProfileRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-gray-600 text-xs tracking-widest uppercase">{label}</span>
            <span className="text-gray-300 text-sm">{value}</span>
        </div>
    )
}