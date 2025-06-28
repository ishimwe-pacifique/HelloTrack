"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tractor, Menu, Home, QrCode, ClipboardList, Users, BarChart3, Settings, LogOut, Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface User {
  name?: string
  email?: string
  role?: string
  profilePicture?: string
}

export default function DashboardHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load user data from localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      try {
        // Decode JWT to get user info (basic decode, not verification)
        const payload = JSON.parse(atob(token.split(".")[1]))
        setUser(payload)
      } catch (error) {
        console.error("Error decoding token:", error)
        // If token is invalid, redirect to login
        router.push("/login")
      }
    }
  }, [router])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "QR Codes Scanner", href: "/qr-scanner", icon: QrCode },
    { name: "Service Requests", href: "/service-requests", icon: ClipboardList },
    { name: "Technicians", href: "/technician", icon: Users },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)

      // Get the current token for the API call
      const token = localStorage.getItem("authToken")

      // Clear ALL possible authentication storage immediately
      localStorage.clear()
      sessionStorage.clear()

      // Clear specific auth-related items
      localStorage.removeItem("authToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      localStorage.removeItem("accessToken")
      localStorage.removeItem("jwt")

      // Clear cookies by setting them to expire
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=")
        const name = eqPos > -1 ? c.substr(0, eqPos) : c
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname
      })

      // Clear user state
      setUser(null)

      // Close mobile menu and dropdown immediately
      setIsMobileMenuOpen(false)
      setIsDropdownOpen(false)

      console.log("All authentication data cleared, calling logout API...")

      // Call logout API (don't wait for it to complete)
      fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }).catch(() => {
        console.log("Logout API call failed, but continuing with logout")
      })

      console.log("Redirecting to login...")

      // Force redirect with cache busting
      window.location.replace("/login?logout=true")
    } catch (error) {
      console.error("Logout error:", error)

      // Even if there's an error, clear everything and redirect
      localStorage.clear()
      sessionStorage.clear()
      setUser(null)

      console.log("Error occurred, but still redirecting to login...")

      // Force redirect even on error
      window.location.replace("/login?logout=true")
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    }
    return "U"
  }

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Tractor className="h-8 w-8 text-orange-500" />
              <span className="font-bold text-xl text-orange-600 hidden md:inline">Hello Tractor</span>
            </Link>

            <nav className="hidden md:flex ml-10 space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-1 transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-orange-500">
                3
              </Badge>
            </Button>

            <div className="relative" ref={dropdownRef}>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={isLoggingOut}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profilePicture || "/placeholder.svg?height=32&width=32"} alt="User" />
                  <AvatarFallback className="bg-orange-100 text-orange-800">{getUserInitials()}</AvatarFallback>
                </Avatar>
              </Button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-md shadow-lg border z-50">
                  <div className="px-3 py-2 border-b">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                      <p className="text-xs leading-none text-gray-500">{user?.email || "user@example.com"}</p>
                      {user?.role && <p className="text-xs leading-none text-orange-600 font-medium">{user.role}</p>}
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/settings"
                      className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <Link href="/" className="flex items-center gap-2 mb-8">
                  <Tractor className="h-8 w-8 text-orange-500" />
                  <span className="font-bold text-xl text-orange-600">Hello Tractor</span>
                </Link>

                {user && (
                  <div className="mb-6 p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profilePicture || "/placeholder.svg?height=40&width=40"} alt="User" />
                        <AvatarFallback className="bg-orange-100 text-orange-800">{getUserInitials()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.name || "User"}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                <nav className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-3 px-2 py-3 rounded-md hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  ))}
                  <div className="pt-4 border-t">
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex items-center gap-3 px-2 py-3 rounded-md hover:bg-red-50 hover:text-red-600 text-red-600 w-full text-left disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      {isLoggingOut ? "Logging out..." : "Log out"}
                    </button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}