/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, CheckCircle, AlertTriangle, PenToolIcon as Tool, Calendar, User, Loader2 } from "lucide-react"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard-header"
import axios from "axios"

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
  commonProblem?: string
  parts?: Array<{
    partId: {
      _id: string
      partName: string
      partNumber: string
    }
    quantity: number
  }>
  notes?: string
  createdAt: string
  updatedAt: string
}

export default function ServiceRequestsPage() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch service requests
  useEffect(() => {
    const fetchServiceRequests = async () => {
      try {
        setLoading(true)
        const response = await axios.get("/api/assign-service")
        console.log("Service requests response:", response.data)

        if (response.data.success && response.data.data) {
          setServiceRequests(response.data.data)
        } else {
          setServiceRequests([])
        }
      } catch (error: any) {
        console.error("Error fetching service requests:", error)
        setError("Failed to fetch service requests")
      } finally {
        setLoading(false)
      }
    }

    fetchServiceRequests()
  }, [])

  // Filter requests by status
  const pendingRequests = serviceRequests.filter(
    (request) => request.status === "pending" || request.status === "assigned" || request.status === "in-progress",
  )
  const completedRequests = serviceRequests.filter((request) => request.status === "completed")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return { className: "bg-amber-500", text: "Pending" }
      case "assigned":
        return { className: "bg-blue-500", text: "Assigned" }
      case "in-progress":
        return { className: "bg-purple-500", text: "In Progress" }
      case "completed":
        return { className: "bg-green-500", text: "Completed" }
      default:
        return { className: "bg-gray-500", text: "Unknown" }
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-amber-500"
      case "low":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-8 w-8 text-amber-500" />
      case "assigned":
      case "in-progress":
        return <Tool className="h-8 w-8 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-8 w-8 text-green-500" />
      default:
        return <Clock className="h-8 w-8 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-lg">Loading service requests...</span>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-gray-600">{error}</p>
                <Button className="mt-4" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Service Requests</h1>
            <p className="text-gray-600">Manage your tractor service requests</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/service-request">
              <Button className="bg-orange-500 hover:bg-orange-600">New Service Request</Button>
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Tool className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{serviceRequests.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRequests.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedRequests.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {serviceRequests.filter((req) => req.priority === "high").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedRequests.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Service Requests</CardTitle>
                <CardDescription>Service requests that are pending or in progress</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingRequests.length > 0 ? (
                  <div className="space-y-4">
                    {pendingRequests.map((request) => {
                      const statusBadge = getStatusBadge(request.status)
                      return (
                        <div key={request._id} className="flex items-start p-4 border rounded-lg hover:bg-gray-50">
                          <div className="mr-4">{getStatusIcon(request.status)}</div>
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <h4 className="font-medium">{request.tractor?.name || "Unknown Tractor"}</h4>
                              <Badge className={statusBadge.className}>{statusBadge.text}</Badge>
                            </div>
                            <p className="text-sm text-gray-600">Request ID: {request.slug}</p>
                            <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                            {request.maintenanceTask && (
                              <p className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">Task:</span> {request.maintenanceTask}
                              </p>
                            )}
                            {request.commonProblem && (
                              <p className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">Problem:</span> {request.commonProblem}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center mt-2 text-xs text-gray-500 gap-x-4 gap-y-1">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center">
                                <AlertTriangle className={`h-3 w-3 mr-1 ${getPriorityColor(request.priority)}`} />
                                <span>
                                  Priority: {request.priority?.charAt(0).toUpperCase() + request.priority?.slice(1)}
                                </span>
                              </div>
                              {request.technicianId && (
                                <div className="flex items-center">
                                  <User className="h-3 w-3 mr-1" />
                                  <span>
                                    Technician: {request.technicianId.firstName} {request.technicianId.lastName}
                                  </span>
                                </div>
                              )}
                            </div>
                            {request.parts && request.parts.length > 0 && (
                              <div className="mt-2">
                                <span className="text-sm font-medium text-gray-600">Parts Needed: </span>
                                <span className="text-sm text-gray-600">
                                  {request.parts.map((part) => part.partId?.partName || "Unknown Part").join(", ")}
                                </span>
                              </div>
                            )}
                            {request.notes && (
                              <p className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">Notes:</span> {request.notes}
                              </p>
                            )}
                          </div>
                          <div className="hidden md:flex ml-4">
                            <Link href={`/service-requests/${request.slug}`}>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No pending service requests</p>
                    <Link href="/service-request">
                      <Button className="mt-4 bg-orange-500 hover:bg-orange-600">Create New Request</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Service Requests</CardTitle>
                <CardDescription>Service requests that have been completed</CardDescription>
              </CardHeader>
              <CardContent>
                {completedRequests.length > 0 ? (
                  <div className="space-y-4">
                    {completedRequests.map((request) => (
                      <div key={request._id} className="flex items-start p-4 border rounded-lg hover:bg-gray-50">
                        <div className="mr-4">
                          <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <h4 className="font-medium">{request.tractor?.name || "Unknown Tractor"}</h4>
                            <Badge className="bg-green-500">Completed</Badge>
                          </div>
                          <p className="text-sm text-gray-600">Request ID: {request.slug}</p>
                          <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                          {request.maintenanceTask && (
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Task:</span> {request.maintenanceTask}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center mt-2 text-xs text-gray-500 gap-x-4 gap-y-1">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>Completed: {new Date(request.updatedAt).toLocaleDateString()}</span>
                            </div>
                            {request.technicianId && (
                              <div className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                <span>
                                  Technician: {request.technicianId.firstName} {request.technicianId.lastName}
                                </span>
                              </div>
                            )}
                          </div>
                          {request.notes && (
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Notes:</span> {request.notes}
                            </p>
                          )}
                        </div>
                        <div className="hidden md:flex ml-4">
                          <Link href={`/service-requests/${request.slug}`}>
                            <Button variant="outline" size="sm">
                              View Report
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No completed service requests</p>
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