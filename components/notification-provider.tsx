"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { Toast, ToastContainer } from "@/components/toast-notification"

type NotificationType = "default" | "success" | "warning" | "error" | "info"
type NotificationPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center"

interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  position: NotificationPosition
  duration: number
}

interface NotificationContextType {
  notifications: Notification[]
  showNotification: (
    title: string,
    message: string,
    type?: NotificationType,
    position?: NotificationPosition,
    duration?: number,
  ) => void
  dismissNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const showNotification = useCallback(
    (
      title: string,
      message: string,
      type: NotificationType = "default",
      position: NotificationPosition = "top-right",
      duration = 5000,
    ) => {
      const id = Math.random().toString(36).substring(2, 9)
      setNotifications((prev) => [...prev, { id, title, message, type, position, duration }])
    },
    [],
  )

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, dismissNotification }}>
      {children}
      <ToastContainer>
        {notifications.map((notification) => (
          <Toast
            key={notification.id}
            title={notification.title}
            message={notification.message}
            variant={notification.type}
            position={notification.position}
            duration={notification.duration}
            onClose={() => dismissNotification(notification.id)}
          />
        ))}
      </ToastContainer>
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}
