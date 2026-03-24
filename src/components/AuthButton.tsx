"use client"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { UserCircle } from "lucide-react"

export default function AuthButton() {
    const { data: session, status } = useSession()
    const isAdmin = (session?.user as any)?.role === "admin"

    if (status === "loading") return null  // ป้องกัน render ก่อน session พร้อม

    if (session) {
        return (
            <div className="flex items-center gap-2">
                {isAdmin && (
                    <Link
                        href="/admin"
                        className="text-sm font-medium px-4 py-1.5
                                   text-red-400 border border-red-400/50
                                   hover:bg-red-400 hover:text-black
                                   transition-all duration-200"
                    >
                        Admin
                    </Link>
                )}
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-sm font-medium px-4 py-1.5
                               text-yellow-500 border border-yellow-500
                               hover:bg-yellow-500 hover:text-black
                               transition-all duration-200"
                >
                    Sign-Out
                </button>
                <Link
                    href="/profile"
                    className="p-1.5 text-black bg-yellow-500 hover:text-yellow-500 hover:bg-black border hover:border-yellow-500 transition-all duration-200"
                    title={session.user?.name || "Profile"}
                >
                    <UserCircle size={22} />
                </Link>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-2">
            <Link
                href="/register"
                className="text-sm font-medium px-4 py-1.5
                            text-black bg- bg-yellow-500 border-yellow-500
                           hover:bg-yellow-500 hover:text-black
                           transition-all duration-200"
            >
                Register
            </Link>
            <Link
                href="/signin"
                className="text-sm font-medium px-4 py-1.5
                           text-black bg- bg-yellow-500 border-yellow-500
                           hover:bg-yellow-500 hover:text-black
                           transition-all duration-200"
            >
                Sign-In
            </Link>
        </div>
    )
}