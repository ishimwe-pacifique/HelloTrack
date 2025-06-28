/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Tractor,
  Clock,
  AlertTriangle,
  CheckCircle,
  PenToolIcon as Tool,
  Bell,
  RefreshCw,
  Calendar,
  User,
  MapPin,
} from "lucide-react"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard-header"
import TractorRegistrationForm from "@/components/TractorRegistrationForm"
import { useEffect, useState, useCallback } from "react"
import axios from "axios"

interface TractorOwner {
  _id: string
  name: string
  tractorId: string
  assignedTractor: string
  location: string
  welcomeEmailStatus: string
  phoneNumber: string
  email: string
  createdAt: string
  updatedAt: string
}

interface ServiceRequest {
  _id: string
  slug: string
  tractor: {
    _id: string
    name: string
    tractorId: string
  }
  technicianId?: {
    _id: string
    firstName: string
    lastName: string
  }
  description: string
  priority: "low" | "medium" | "high"
  status: "pending" | "assigned" | "in-progress" | "completed"
  maintenanceTask?: string
  createdAt: string
  updatedAt: string
}

interface Notification {
  id: string
  title: string
  message: string
  time: string
  type: "critical" | "warning" | "info" | "success"
  tractorId?: string
  read: boolean
}

interface DashboardStats {
  totalTractors: number
  pendingServices: number
  alerts: number
  completedThisMonth: number
}

export default function DashboardPage() {
  const [tractorOwners, setTractorOwners] = useState<TractorOwner[]>([])
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalTractors: 0,
    pendingServices: 0,
    alerts: 0,
    completedThisMonth: 0,
  })
  const [loading, setLoading] = useState({
    tractors: true,
    services: true,
    notifications: true,
    stats: true,
  })
  const [error, setError] = useState({
    tractors: null as string | null,
    services: null as string | null,
    notifications: null as string | null,
    stats: null as string | null,
  })
  const [activeTab, setActiveTab] = useState("tractors")
  const [refreshing, setRefreshing] = useState(false)

  const fetchTractorOwners = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, tractors: true }))
      setError((prev) => ({ ...prev, tractors: null }))
      const response = await axios.get("/api/tractor-owners")
      const tractors = response.data.data || []
      setTractorOwners(tractors)
      // Update stats
      setDashboardStats((prev) => ({ ...prev, totalTractors: tractors.length }))
    } catch (error: any) {
      console.error("Error fetching tractor owners:", error)
      setError((prev) => ({ ...prev, tractors: "Failed to load tractor data" }))
    } finally {
      setLoading((prev) => ({ ...prev, tractors: false, stats: false }))
    }
  }, [])

  const fetchServiceRequests = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, services: true }))
      setError((prev) => ({ ...prev, services: null }))
      const response = await axios.get("/api/assign-service")
      const services = response.data.data || []
      setServiceRequests(services)
      // Calculate service stats
      const pending = services.filter(
        (s: ServiceRequest) => s.status === "pending" || s.status === "assigned" || s.status === "in-progress",
      ).length
      const thisMonth = new Date()
      thisMonth.setDate(1)
      const completedThisMonth = services.filter(
        (s: ServiceRequest) => s.status === "completed" && new Date(s.updatedAt) >= thisMonth,
      ).length
      const alerts = services.filter((s: ServiceRequest) => s.priority === "high" && s.status !== "completed").length
      setDashboardStats((prev) => ({
        ...prev,
        pendingServices: pending,
        completedThisMonth,
        alerts,
      }))
    } catch (error: any) {
      console.error("Error fetching service requests:", error)
      setError((prev) => ({ ...prev, services: "Failed to load service data" }))
    } finally {
      setLoading((prev) => ({ ...prev, services: false }))
    }
  }, [])

  const generateNotifications = useCallback((tractors: TractorOwner[], services: ServiceRequest[]): Notification[] => {
    const notifications: Notification[] = []

    // Service-based notifications
    services.forEach((service) => {
      const timeAgo = getTimeAgo(service.updatedAt)

      // Check for completed services
      if (service.status === "completed") {
        notifications.push({
          id: `service-completed-${service._id}`,
          title: "Service Completed",
          message: `Service for ${service.tractor?.name || "tractor"} has been completed`,
          time: timeAgo,
          type: "success",
          tractorId: service.tractor?._id,
          read: false,
        })
      }

      // Check for assigned services with technician
      if (service.status === "assigned" && service.technicianId) {
        notifications.push({
          id: `technician-assigned-${service._id}`,
          title: "Technician Assigned",
          message: `${service.technicianId.firstName} ${service.technicianId.lastName} has been assigned to your service request`,
          time: timeAgo,
          type: "info",
          tractorId: service.tractor?._id,
          read: false,
        })
      }

      // Check for high priority services that are not completed
      if (service.priority === "high" && service.status !== "completed") {
        notifications.push({
          id: `urgent-service-${service._id}`,
          title: "Urgent Service Required",
          message: `${service.tractor?.name || "Tractor"} requires immediate attention`,
          time: timeAgo,
          type: "critical",
          tractorId: service.tractor?._id,
          read: false,
        })
      }
    })

    // Tractor-based notifications
    tractors.forEach((tractor) => {
      const daysSinceUpdate = Math.floor(
        (new Date().getTime() - new Date(tractor.updatedAt).getTime()) / (1000 * 60 * 60 * 24),
      )

      if (tractor.welcomeEmailStatus === "warning") {
        notifications.push({
          id: `service-reminder-${tractor._id}`,
          title: "Service Reminder",
          message: `${tractor.assignedTractor || tractor.name} is approaching the service interval`,
          time: `${daysSinceUpdate} days ago`,
          type: "warning",
          tractorId: tractor._id,
          read: false,
        })
      }

      if (daysSinceUpdate > 30) {
        notifications.push({
          id: `maintenance-due-${tractor._id}`,
          title: "Maintenance Due",
          message: `${tractor.assignedTractor || tractor.name} may need routine maintenance check`,
          time: `${daysSinceUpdate} days ago`,
          type: "warning",
          tractorId: tractor._id,
          read: false,
        })
      }
    })

    // Sort by most recent first
    return notifications
      .sort((a, b) => {
        const timeA = parseTimeAgo(a.time)
        const timeB = parseTimeAgo(b.time)
        return timeA - timeB
      })
      .slice(0, 10) // Limit to 10 most recent
  }, [])

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, notifications: true }))
      setError((prev) => ({ ...prev, notifications: null }))
      // Generate dynamic notifications based on real data
      const generatedNotifications = generateNotifications(tractorOwners, serviceRequests)
      setNotifications(generatedNotifications)
    } catch (error: any) {
      console.error("Error generating notifications:", error)
      setError((prev) => ({ ...prev, notifications: "Failed to load notifications" }))
    } finally {
      setLoading((prev) => ({ ...prev, notifications: false }))
    }
  }, [tractorOwners, serviceRequests, generateNotifications])

  const fetchAllData = useCallback(async () => {
    await Promise.all([fetchTractorOwners(), fetchServiceRequests()])
  }, [fetchTractorOwners, fetchServiceRequests])

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  // Update notifications when tractors or services change
  useEffect(() => {
    if (tractorOwners.length > 0 || serviceRequests.length > 0) {
      fetchNotifications()
    }
  }, [tractorOwners, serviceRequests, fetchNotifications])

  const getTimeAgo = (dateString: string): string => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? "s" : ""} ago`
    return `${Math.floor(diffInDays / 30)} month${Math.floor(diffInDays / 30) > 1 ? "s" : ""} ago`
  }

  const parseTimeAgo = (timeString: string): number => {
    if (timeString === "Just now") return 0
    const match = timeString.match(/(\d+)\s+(hour|day|week|month)/)
    if (!match) return 0
    const value = Number.parseInt(match[1])
    const unit = match[2]

    switch (unit) {
      case "hour":
        return value
      case "day":
        return value * 24
      case "week":
        return value * 24 * 7
      case "month":
        return value * 24 * 30
      default:
        return 0
    }
  }

  const getTractorStatus = (tractor: TractorOwner) => {
    const relatedServices = serviceRequests.filter((service) => service.tractor?.tractorId === tractor.tractorId)
    const hasUrgentService = relatedServices.some(
      (service) => service.priority === "high" && service.status !== "completed",
    )

    if (hasUrgentService) {
      return { status: "Service Required", color: "bg-red-500", hours: 130, maxHours: 150 }
    }

    if (tractor.welcomeEmailStatus === "warning") {
      return { status: "Service Soon", color: "bg-amber-500", hours: 120, maxHours: 150 }
    }

    return { status: "Good", color: "bg-green-500", hours: 50, maxHours: 150 }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAllData()
    setRefreshing(false)
  }

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif)))
  }

  const LoadingCard = () => (
    <Card className="animate-pulse">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-4 bg-orange-200 rounded" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-8 w-12 bg-orange-100 rounded mb-2" />
        <div className="h-3 w-20 bg-gray-200 rounded" />
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">{"Welcome back! Here's your fleet overview"}</p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="border-orange-200 hover:bg-orange-50 bg-transparent"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Link href="/qr-generator">
              <Button className="bg-orange-500 hover:bg-orange-600">Generate QR Code</Button>
            </Link>
            <Link href="/service-request">
              <Button variant="outline" className="border-orange-200 hover:bg-orange-50 bg-transparent">
                Request Service
              </Button>
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {loading.stats ? (
            <>
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
            </>
          ) : (
            <>
              <Card className="border-orange-100 hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Tractors</CardTitle>
                  <Tractor className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{dashboardStats.totalTractors}</div>
                  <p className="text-xs text-muted-foreground">Active in fleet</p>
                </CardContent>
              </Card>

              <Card className="border-orange-100 hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Pending Services</CardTitle>
                  <Clock className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{dashboardStats.pendingServices}</div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardStats.completedThisMonth} completed this month
                  </p>
                </CardContent>
              </Card>

              <Card className="border-orange-100 hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{dashboardStats.alerts}</div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardStats.alerts > 0 ? "Require immediate attention" : "All systems normal"}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-orange-100 hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">This Month</CardTitle>
                  <CheckCircle className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{dashboardStats.completedThisMonth}</div>
                  <p className="text-xs text-muted-foreground">Services completed</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 mb-4 bg-orange-50 border-orange-200">
            <TabsTrigger value="tractors" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              My Tractors ({tractorOwners.length})
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Service History ({serviceRequests.length})
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Notifications ({notifications.filter((n) => !n.read).length})
            </TabsTrigger>
          </TabsList>

          {/* Tractors Tab */}
          <TabsContent value="tractors">
            <div className="space-y-6">
              <TractorRegistrationForm />
              {loading.tractors ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader className="bg-orange-50 pb-2">
                        <div className="flex justify-between items-center">
                          <div className="h-6 w-32 bg-orange-200 rounded" />
                          <div className="h-6 w-16 bg-gray-200 rounded-full" />
                        </div>
                        <div className="h-4 w-24 bg-gray-200 rounded" />
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-4">
                          <div className="h-2 w-full bg-orange-100 rounded" />
                          <div className="h-4 w-3/4 bg-gray-200 rounded" />
                          <div className="flex justify-between">
                            <div className="h-8 w-24 bg-gray-200 rounded" />
                            <div className="h-8 w-32 bg-orange-200 rounded" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : error.tractors ? (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                      <p className="text-red-600">{error.tractors}</p>
                      <Button onClick={fetchTractorOwners} className="mt-4 bg-orange-500 hover:bg-orange-600">
                        Try Again
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : tractorOwners.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Tractor className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No tractors registered yet</p>
                      <p className="text-sm text-gray-400">Register your first tractor to get started</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tractorOwners.map((tractor) => {
                    const statusInfo = getTractorStatus(tractor)
                    const relatedServices = serviceRequests.filter(
                      (service) => service.tractor?.tractorId === tractor.tractorId,
                    )

                    return (
                      <Card
                        key={tractor._id}
                        className="overflow-hidden border-orange-100 hover:shadow-lg transition-shadow duration-200"
                      >
                        <CardHeader className="bg-orange-50 pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg text-orange-800">
                              {tractor.assignedTractor || tractor.name || "Unnamed Tractor"}
                            </CardTitle>
                            <Badge className={statusInfo.color}>{statusInfo.status}</Badge>
                          </div>
                          <CardDescription className="flex items-center gap-2">
                            <span>ID: {tractor.tractorId || "N/A"}</span>
                            <span>•</span>
                            <MapPin className="h-3 w-3" />
                            <span>{tractor.location || "Location not set"}</span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Hours since last service</span>
                                <span className="font-medium text-orange-600">
                                  {statusInfo.hours}/{statusInfo.maxHours}
                                </span>
                              </div>
                              <Progress value={(statusInfo.hours / statusInfo.maxHours) * 100} className="h-2" />
                            </div>

                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <User className="h-3 w-3 text-gray-500" />
                                <span className="text-gray-600">Owner: {tractor.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3 text-gray-500" />
                                <span className="text-gray-600">
                                  Registered: {new Date(tractor.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              {relatedServices.length > 0 && (
                                <div className="text-xs text-gray-500">
                                  {relatedServices.length} service record{relatedServices.length > 1 ? "s" : ""}
                                </div>
                              )}
                            </div>

                            <div className="flex justify-between gap-2">
                              <Link href={`/tractor/${tractor.tractorId}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-orange-200 hover:bg-orange-50 bg-transparent"
                                >
                                  View Details
                                </Button>
                              </Link>
                              <Link href={`/service-request?tractor=${tractor.tractorId}`}>
                                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                                  Request Service
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Service History Tab */}
          <TabsContent value="services">
            <Card className="border-orange-100">
              <CardHeader>
                <CardTitle className="text-orange-800">Recent Service History</CardTitle>
                <CardDescription>View all your tractor service records and their current status</CardDescription>
              </CardHeader>
              <CardContent>
                {loading.services ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center p-4 border rounded-lg animate-pulse">
                        <div className="mr-4">
                          <div className="h-8 w-8 bg-gray-200 rounded-full" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-32 bg-gray-200 rounded" />
                          <div className="h-3 w-24 bg-gray-200 rounded" />
                          <div className="h-3 w-48 bg-gray-200 rounded" />
                        </div>
                        <div className="h-6 w-20 bg-gray-200 rounded-full" />
                      </div>
                    ))}
                  </div>
                ) : error.services ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 mb-4">{error.services}</p>
                    <Button onClick={fetchServiceRequests} className="bg-orange-500 hover:bg-orange-600">
                      Try Again
                    </Button>
                  </div>
                ) : serviceRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <Tool className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No service history found</p>
                    <Link href="/service-request">
                      <Button className="bg-orange-500 hover:bg-orange-600">Request Your First Service</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {serviceRequests
                      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                      .map((service) => {
                        const getStatusIcon = () => {
                          switch (service.status) {
                            case "completed":
                              return <CheckCircle className="h-8 w-8 text-green-500" />
                            case "in-progress":
                              return <Tool className="h-8 w-8 text-blue-500" />
                            case "assigned":
                              return <User className="h-8 w-8 text-purple-500" />
                            default:
                              return <Clock className="h-8 w-8 text-amber-500" />
                          }
                        }

                        const getStatusBadge = () => {
                          switch (service.status) {
                            case "completed":
                              return <Badge className="bg-green-500">Completed</Badge>
                            case "in-progress":
                              return <Badge className="bg-blue-500">In Progress</Badge>
                            case "assigned":
                              return <Badge className="bg-purple-500">Assigned</Badge>
                            default:
                              return <Badge className="bg-amber-500">Pending</Badge>
                          }
                        }

                        return (
                          <div
                            key={service._id}
                            className="flex items-center p-4 border rounded-lg hover:bg-orange-50 transition-colors duration-200"
                          >
                            <div className="mr-4">{getStatusIcon()}</div>
                            <div className="flex-1">
                              <h4 className="font-medium text-orange-800">
                                {service.tractor?.name || "Unknown Tractor"}
                              </h4>
                              <p className="text-sm text-gray-600">Service ID: {service.slug}</p>
                              {service.maintenanceTask && (
                                <p className="text-sm text-gray-600">Task: {service.maintenanceTask}</p>
                              )}
                              <div className="flex items-center mt-1 text-sm text-gray-500">
                                {service.technicianId && (
                                  <>
                                    <User className="h-3 w-3 mr-1" />
                                    <span>
                                      {service.technicianId.firstName} {service.technicianId.lastName}
                                    </span>
                                    <span className="mx-2">•</span>
                                  </>
                                )}
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>{new Date(service.updatedAt).toLocaleDateString()}</span>
                                {service.priority === "high" && (
                                  <>
                                    <span className="mx-2">•</span>
                                    <AlertTriangle className="h-3 w-3 mr-1 text-red-500" />
                                    <span className="text-red-500">High Priority</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {getStatusBadge()}
                              <Link href={`/service-requests/${service.slug}`}>
                                <Button variant="outline" size="sm" className="text-xs bg-transparent">
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="border-orange-100">
              <CardHeader>
                <CardTitle className="text-orange-800">Recent Notifications</CardTitle>
                <CardDescription>Stay updated on your tractor maintenance and service alerts</CardDescription>
              </CardHeader>
              <CardContent>
                {loading.notifications ? (
                  <div className="space-y-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="flex items-start p-4 border rounded-lg animate-pulse">
                        <div className="mr-4">
                          <div className="h-5 w-5 bg-gray-200 rounded" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-32 bg-gray-200 rounded" />
                          <div className="h-3 w-48 bg-gray-200 rounded" />
                          <div className="h-3 w-24 bg-gray-200 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : error.notifications ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 mb-4">{error.notifications}</p>
                    <Button onClick={fetchNotifications} className="bg-orange-500 hover:bg-orange-600">
                      Try Again
                    </Button>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No notifications yet</p>
                    <p className="text-sm text-gray-400">
                      {"You'll receive notifications about service updates and maintenance reminders"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                          notification.read
                            ? "bg-gray-50 border-gray-200"
                            : "bg-white border-orange-200 hover:bg-orange-50"
                        }`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="mr-4">
                          <Bell
                            className={`h-5 w-5 ${
                              notification.type === "critical"
                                ? "text-red-500"
                                : notification.type === "warning"
                                  ? "text-amber-500"
                                  : notification.type === "success"
                                    ? "text-green-500"
                                    : "text-blue-500"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-medium ${notification.read ? "text-gray-600" : "text-orange-800"}`}>
                              {notification.title}
                            </h4>
                            {!notification.read && <div className="h-2 w-2 bg-orange-500 rounded-full" />}
                          </div>
                          <p className={`text-sm ${notification.read ? "text-gray-500" : "text-gray-600"}`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-gray-500">{notification.time}</p>
                            {notification.tractorId && (
                              <>
                                <span className="text-xs text-gray-400">•</span>
                                <Link
                                  href={`/tractor/${notification.tractorId}`}
                                  className="text-xs text-orange-600 hover:text-orange-800"
                                >
                                  View Tractor
                                </Link>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}