"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, AlertTriangle, CheckCircle, Bell, Info } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toastVariants = cva(
  "fixed flex items-start gap-3 p-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-white text-gray-900 border border-gray-200",
        success: "bg-green-50 text-green-800 border border-green-200",
        warning: "bg-amber-50 text-amber-800 border border-amber-200",
        error: "bg-red-50 text-red-800 border border-red-200",
        info: "bg-blue-50 text-blue-800 border border-blue-200",
      },
      position: {
        "top-right": "top-4 right-4",
        "top-left": "top-4 left-4",
        "bottom-right": "bottom-4 right-4",
        "bottom-left": "bottom-4 left-4",
        "top-center": "top-4 left-1/2 -translate-x-1/2",
        "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
      },
    },
    defaultVariants: {
      variant: "default",
      position: "top-right",
    },
  },
)

export interface ToastProps extends VariantProps<typeof toastVariants> {
  title: string
  message: string
  duration?: number
  onClose?: () => void
  showProgress?: boolean
}

export function Toast({
  title,
  message,
  variant = "default",
  position = "top-right",
  duration = 5000,
  onClose,
  showProgress = true,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval)
          return 0
        }
        return prev - 100 / (duration / 100)
      })
    }, 100)

    const timer = setTimeout(() => {
      setIsVisible(false)
      if (onClose) onClose()
    }, duration)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [duration, isVisible, onClose])

  if (!isVisible) return null

  const handleClose = () => {
    setIsVisible(false)
    if (onClose) onClose()
  }

  const getIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className={cn(toastVariants({ variant, position }), "max-w-sm")}>
      <div className="flex-shrink-0">{getIcon()}</div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-medium">{title}</h3>
          <button
            onClick={handleClose}
            className="ml-4 inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <p className="mt-1 text-sm">{message}</p>
        {showProgress && (
          <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className={cn("h-full transition-all duration-100 ease-linear", {
                "bg-green-500": variant === "success",
                "bg-amber-500": variant === "warning",
                "bg-red-500": variant === "error",
                "bg-blue-500": variant === "info",
                "bg-gray-500": variant === "default",
              })}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export function ToastContainer({ children }: { children: React.ReactNode }) {
  return <div className="fixed inset-0 pointer-events-none z-50">{children}</div>
}
