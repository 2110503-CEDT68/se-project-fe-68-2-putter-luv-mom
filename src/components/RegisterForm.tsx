"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import userRegister from "@/libs/userRegister"
import { User, Mail, Lock, Phone, Eye, EyeOff, AudioWaveform } from "lucide-react"

export default function RegisterForm() {
    const router = useRouter()
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        tel: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [agreed, setAgreed] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        setError("")
        if (!form.name || !form.email || !form.password || !form.tel) {
            setError("Please fill in all fields")
            return
        }
        if (!agreed) {
            setError("Please agree to the Terms of Service and Privacy Policy")
            return
        }
        if (form.password.length <= 8) {
            setError("Password must exceed 8 characters")
            return
        }
        setLoading(true)
        try {
            await userRegister(form.name, form.email, form.password, form.tel)
            router.push("/signin")
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-sm bg-[#0d0d0d] border border-yellow-600/20 px-8 py-10">

                {/* Logo */}
                <div className="flex flex-col items-center gap-3 mb-8">
                    <div className="flex items-center gap-2">
                        <AudioWaveform className="text-yellow-500" size={20} />
                        <span className="font-playfair text-lg font-bold tracking-widest text-yellow-500">
                            NEWWAVE
                        </span>
                    </div>
                    <div className="h-px w-12 bg-yellow-500/40" />
                    <p className="text-gray-500 text-xs tracking-[0.3em] uppercase">Create Account</p>
                </div>

                {/* Error */}
                {error && (
                    <p className="text-red-400 text-xs text-center mb-4 tracking-wide">{error}</p>
                )}

                {/* Fields */}
                {[
                    { icon: <User size={14} />, label: "Full Name", name: "name", type: "text", placeholder: "Your full name" },
                    { icon: <Mail size={14} />, label: "Email", name: "email", type: "email", placeholder: "your@email.com" },
                    { icon: <Phone size={14} />, label: "Phone", name: "tel", type: "tel", placeholder: "0812345678" },
                ].map((field) => (
                    <div key={field.name} className="mb-5">
                        <label className="text-gray-500 text-xs tracking-widest uppercase mb-2 block">
                            {field.label}
                        </label>
                        <div className="flex items-center gap-3 border-b border-gray-700 focus-within:border-yellow-500 transition-colors pb-2">
                            <span className="text-gray-600 shrink-0">{field.icon}</span>
                            <input
                                type={field.type}
                                name={field.name}
                                placeholder={field.placeholder}
                                value={(form as any)[field.name]}
                                onChange={handleChange}
                                className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-700"
                            />
                        </div>
                    </div>
                ))}

                {/* Password */}
                <div className="mb-6">
                    <label className="text-gray-500 text-xs tracking-widest uppercase mb-2 block">
                        Password
                    </label>
                    <div className="flex items-center gap-3 border-b border-gray-700 focus-within:border-yellow-500 transition-colors pb-2">
                        <Lock size={14} className="text-gray-600 shrink-0" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Min 9 characters"
                            value={form.password}
                            onChange={handleChange}
                            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-700"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-600 hover:text-gray-400 transition"
                        >
                            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                    </div>
                    <p className="text-gray-700 text-xs mt-1">Must exceed 8 characters</p>
                </div>

                {/* Checkbox */}
                <div className="flex items-start gap-3 mb-6">
                    <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-0.5 w-3.5 h-3.5 accent-yellow-500 cursor-pointer"
                    />
                    <p className="text-xs text-gray-600">
                        I agree to the{" "}
                        <span className="text-yellow-500 cursor-pointer hover:underline">Terms of Service</span>
                        {" "}and{" "}
                        <span className="text-yellow-500 cursor-pointer hover:underline">Privacy Policy</span>
                    </p>
                </div>

                {/* Submit */}
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-3 bg-yellow-500 hover:bg-yellow-400
                               text-black text-xs font-semibold
                               tracking-[0.3em] uppercase
                               transition-all duration-300 disabled:opacity-50 mb-6"
                >
                    {loading ? "Creating..." : "Create Account"}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-gray-800" />
                    <span className="text-gray-700 text-xs">or</span>
                    <div className="flex-1 h-px bg-gray-800" />
                </div>

                {/* Sign In */}
                <div className="text-center">
                    <span className="text-gray-600 text-xs">Already have an account? </span>
                    <Link href="/signin" className="text-yellow-500 text-xs hover:underline tracking-widest uppercase">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    )
}