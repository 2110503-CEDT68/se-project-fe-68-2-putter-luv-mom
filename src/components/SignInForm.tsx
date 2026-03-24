"use client"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Toast from "@/components/Toast"
import useToast from "@/hooks/useToast"
import { Mail, Lock, AudioWaveform } from "lucide-react"

export default function SignInForm() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const { toast, showToast, hideToast } = useToast()

    const handleSubmit = async () => {
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        if (result?.error) {
            showToast("Invalid email or password", "error")
        } else {
            showToast("Login successful!", "success")
            setTimeout(() => router.push("/"), 1000)
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            {toast && (
                <Toast key={toast.id} message={toast.message} type={toast.type} onClose={hideToast} />
            )}

            <div className="w-full max-w-sm bg-[#0d0d0d] border border-yellow-600/20 px-8 py-10">

                {/* Logo */}
                <div className="flex flex-col items-center gap-3 mb-10">
                    <div className="flex items-center gap-2">
                        <AudioWaveform className="text-yellow-500" size={20} />
                        <span className="font-playfair text-lg font-bold tracking-widest text-yellow-500">
                            NEWWAVE
                        </span>
                    </div>
                    <div className="h-px w-12 bg-yellow-500/40" />
                    <p className="text-gray-500 text-xs tracking-[0.3em] uppercase">Member Sign In</p>
                </div>

                {/* Email */}
                <div className="mb-6">
                    <label className="text-gray-500 text-xs tracking-widest uppercase mb-2 block">
                        Email
                    </label>
                    <div className="flex items-center gap-3 border-b border-gray-700 focus-within:border-yellow-500 transition-colors pb-2">
                        <Mail size={14} className="text-gray-600 shrink-0" />
                        <input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-700"
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="mb-8">
                    <label className="text-gray-500 text-xs tracking-widest uppercase mb-2 block">
                        Password
                    </label>
                    <div className="flex items-center gap-3 border-b border-gray-700 focus-within:border-yellow-500 transition-colors pb-2">
                        <Lock size={14} className="text-gray-600 shrink-0" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-700"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-600 hover:text-gray-400 transition text-xs tracking-widest"
                        >
                            {showPassword ? "HIDE" : "SHOW"}
                        </button>
                    </div>
                </div>

                {/* Button */}
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full py-3 bg-yellow-500 hover:bg-yellow-400
                               text-black text-xs font-semibold
                               tracking-[0.3em] uppercase
                               transition-all duration-300 mb-6"
                >
                    Sign In
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-gray-800" />
                    <span className="text-gray-700 text-xs">or</span>
                    <div className="flex-1 h-px bg-gray-800" />
                </div>

                {/* Register */}
                <div className="text-center">
                    <span className="text-gray-600 text-xs">Don't have an account? </span>
                    <a href="/register" className="text-yellow-500 text-xs hover:underline tracking-widest uppercase">
                        Register
                    </a>
                </div>
            </div>
        </div>
    )
}