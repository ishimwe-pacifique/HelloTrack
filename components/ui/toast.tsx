"use client"

import { useEffect } from "react"
import { X, CheckCircle, AlertCircle } from "lucide-react"
import type { ToasterToast } from "@/hooks/use-toast"

interface ToastProps {
  toast: ToasterToast
  onDismiss: (id: string) => void
}

export function ToastComponent({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id)
    }, 5000)

    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  const isDestructive = toast.variant === "destructive"

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 w-full max-w-sm rounded-lg border p-4 shadow-lg
        ${isDestructive ? "bg-red-50 border-red-200 text-red-900" : "bg-green-50 border-green-200 text-green-900"}
        animate-in slide-in-from-top-2 duration-300
      `}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {isDestructive ? (
            <AlertCircle className="h-5 w-5 text-red-500" />
          ) : (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className="text-sm font-medium">{typeof toast.title === "string" ? toast.title : String(toast.title)}</p>
          )}
          {toast.description && (
            <p className="text-sm opacity-90 mt-1">
              {typeof toast.description === "string" ? toast.description : String(toast.description)}
            </p>
          )}
        </div>
        <button
          onClick={() => onDismiss(toast.id)}
          className="flex-shrink-0 rounded-md p-1 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

interface ToasterProps {
  toasts: ToasterToast[]
  onDismiss: (id: string) => void
}

export function Toaster({ toasts, onDismiss }: ToasterProps) {
  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}