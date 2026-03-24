"use client"
import { useEffect, useState } from "react"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"

export type ToastType = "success" | "error" | "info"

interface ToastProps {
    message: string
    type?: ToastType
    duration?: number
    onClose: () => void
}

export default function Toast({ message, type = "info", duration = 3000, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration)
        return () => clearTimeout(timer)
    }, [duration, onClose])

    const styles = {
        success: "border-green-500/50 bg-green-500/10 text-green-400",
        error: "border-red-500/50 bg-red-500/10 text-red-400",
        info: "border-yellow-500/50 bg-yellow-500/10 text-yellow-400",
    }

    const icons = {
        success: <CheckCircle size={16} />,
        error: <AlertCircle size={16} />,
        info: <Info size={16} />,
    }

    return (
        <div className={`fixed top-20 right-4 z-[9999] flex items-center gap-3 
                        px-4 py-3 border backdrop-blur-sm min-w-[280px] max-w-sm
                        animate-in slide-in-from-right duration-300
                        ${styles[type]}`}>
            {icons[type]}
            <p className="text-sm flex-1">{message}</p>
            <button onClick={onClose} className="opacity-60 hover:opacity-100 transition">
                <X size={14} />
            </button>
        </div>
    )
}