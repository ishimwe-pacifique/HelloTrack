/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  PenToolIcon as Tool,
  Calendar,
  User,
  Tractor,
  Package,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard-header"
import TechnicianForm from "@/components/TechnicianRegistrationForm"
import axios from "axios"
import AssignService from "@/components/AssignService"
import PartsManagement from "@/components/PartsManagement"
import UpdateRequestDialog from "@/components/UpdateRequestDialog"

export default function TechnicianPage() {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)
  const [technicianData, setTechnicianData] = useState<any[]>([])
  const [partsData, setPartsData] = useState<any[]>([])
  const [assignedRequests, setAssignedRequests] = useState<any[]>([])
  const [tractorOwners, setTractorOwners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const requests = [
    {
      id: "SR-002",
      tractor: "Massey Ferguson 240",
      tractorId: "TR-002",
      date: "2023-06-08",
      type: "Repair",
      status: "assigned",
      description: "Engine making unusual noise",
      urgency: "high",
      owner: "John Doe",
      location: "North Farm",
      partsNeeded: ["Engine Oil", "Oil Filter"],
    },
    {
      id: "SR-005",
      tractor: "John Deere 5E",
      tractorId: "TR-001",
      date: "2023-06-12",
      type: "Regular Maintenance",
      status: "assigned",
      description: "60-hour maintenance service",
      urgency: "medium",
      owner: "Sarah Johnson",
      location: "East Field",
      partsNeeded: ["Oil Filter", "Air Filter", "Fuel Filter"],
    },
  ]

  // Fetch all data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch all data in parallel
        const [tractorOwnersResponse, servicesResponse, technicianResponse, partsResponse] = await Promise.allSettled([
          axios.get("/api/tractor-owners"),
          axios.get("/api/assign-service"),
          axios.get("/api/technician"),
          axios.get("/api/parts"),
        ])

        // Handle tractor owners
        if (tractorOwnersResponse.status === "fulfilled") {
          const owners = tractorOwnersResponse.value.data?.data || []
          setTractorOwners(owners.filter(Boolean)) // Filter out any null/undefined values
          console.log("Tractor owners:", owners)
        } else {
          console.error("Error fetching tractor owners:", tractorOwnersResponse.reason)
        }

        // Handle assigned services
        if (servicesResponse.status === "fulfilled") {
          const services = servicesResponse.value.data?.data || []
          setAssignedRequests(services.filter(Boolean)) // Filter out any null/undefined values
          console.log("Assigned services:", services)
        } else {
          console.error("Error fetching assigned services:", servicesResponse.reason)
        }

        // Handle technicians
        if (technicianResponse.status === "fulfilled") {
          const technicians = technicianResponse.value.data?.data || []
          // Add default hours if not present
          const technicianWithDefaults = technicians.filter(Boolean).map((tech: any) => ({
            ...tech,
            hours: tech.hours || { start: "09:00", end: "17:00" }, // Default working hours
            availability: tech.availability || "available",
          }))
          setTechnicianData(technicianWithDefaults)
          console.log("Technicians:", technicianWithDefaults)
        } else {
          console.error("Error fetching technicians:", technicianResponse.reason)
        }

        // Handle parts
        if (partsResponse.status === "fulfilled") {
          const parts = partsResponse.value.data || []
          setPartsData(parts.filter(Boolean)) // Filter out any null/undefined values
          console.log("Parts:", parts)
        } else {
          console.error("Error fetching parts:", partsResponse.reason)
        }
      } catch (error: any) {
        console.error("Error fetching data:", error)
        setError("Failed to load data. Please refresh the page.")
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [])

  const handleAssignService = async (
    technicianId: string,
    requestId: string,
    tractor: string,
    maintenanceTask: string,
    commonProblem: string,
    priority: string,
    parts: { partId: string; quantity: number }[],
  ) => {
    try {
      await axios.post("/api/assign-service", {
        technicianId,
        requestId,
        tractor,
        maintenanceTask,
        commonProblem,
        parts,
        priority,
      })

      setAssignedRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId
            ? {
                ...request,
                assignedTo: technicianId,
                tractor: tractor,
                maintenanceTask: maintenanceTask,
                commonProblem: commonProblem,
                parts,
                priority,
                status: "in-progress",
              }
            : request,
        ),
      )

      alert(
        `Service Request ${requestId} assigned to Technician ${technicianId}. Maintenance Task: "${maintenanceTask}", Common Problem: "${commonProblem}"`,
      )
    } catch (error) {
      console.error("Error assigning service:", error)
      alert("Failed to assign service. Please try again.")
    }
  }

  const handleUpdateRequest = async (requestId: string, updatedData: any) => {
    try {
      const response = await fetch(`/api/assign-service?id=${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        throw new Error("Failed to update the request.")
      }

      const updatedRequest = await response.json()

      // Update state
      setAssignedRequests((prevRequests) =>
        prevRequests.map((req) => (req._id === requestId ? { ...req, ...updatedRequest } : req)),
      )
    } catch (error) {
      console.error("Error updating request:", error)
      alert("Failed to update the request. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading dashboard...</span>
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
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Refresh Page</Button>
            </div>
          </div>
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
            <h1 className="text-3xl font-bold text-gray-900">Technician Dashboard</h1>
            <p className="text-gray-600">Manage service requests and track maintenance</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <TechnicianForm />
            <Link href="/qr-scanner">
              <Button variant="outline">Scan QR Code</Button>
            </Link>
            <Link href="/parts-request">
              <Button className="bg-orange-500 hover:bg-orange-600">Request Parts</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Assigned Requests</CardTitle>
              <Tool className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignedRequests.length}</div>
              <p className="text-xs text-muted-foreground">
                {assignedRequests.filter((req) => req.priority === "high").length} high priority
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed This Week</CardTitle>
              <CheckCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {assignedRequests.filter((req) => req.status === "completed").length}
              </div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Parts Needed</CardTitle>
              <Package className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">2 items low in stock</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="assigned" className="mb-8">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="assigned">Assigned ({assignedRequests.length})</TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({assignedRequests.filter((request) => request.status === "completed").length})
                </TabsTrigger>
                <TabsTrigger value="technician">Technicians ({technicianData.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="assigned">
                {technicianData.length > 0 && tractorOwners.length > 0 && partsData.length > 0 ? (
                  <AssignService
                    technicians={technicianData}
                    tractor={tractorOwners}
                    requests={requests}
                    onAssign={handleAssignService}
                    parts={partsData}
                  />
                ) : (
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                        <p>Loading assignment data...</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Assigned Service Requests</CardTitle>
                    <CardDescription>Service requests assigned to you</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {assignedRequests.length === 0 ? (
                        <div className="text-center py-8">
                          <Tool className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No assigned requests yet</p>
                        </div>
                      ) : (
                        assignedRequests.map((request) => (
                          <div
                            key={request._id}
                            className={`flex flex-col md:flex-row items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedRequest === request._id
                                ? "border-orange-500 bg-orange-50"
                                : "hover:border-orange-200 hover:bg-orange-50/50"
                            }`}
                            onClick={() => setSelectedRequest(request._id)}
                          >
                            <div className="mr-4">
                              {request.priority === "high" ? (
                                <AlertTriangle className="h-8 w-8 text-red-500" />
                              ) : (
                                <Clock className="h-8 w-8 text-orange-500" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <h4 className="font-medium">{request.tractor?.name || "Unknown Tractor"}</h4>
                                <Badge
                                  className={
                                    request.priority === "high"
                                      ? "bg-red-500"
                                      : request.priority === "medium"
                                        ? "bg-amber-500"
                                        : "bg-blue-500"
                                  }
                                >
                                  {request.priority?.charAt(0).toUpperCase() + request.priority?.slice(1) || "Unknown"}{" "}
                                  Priority
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">Request ID: {request.slug}</p>
                              <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                              <div className="flex flex-wrap items-center mt-2 text-xs text-gray-500 gap-x-4 gap-y-1">
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  <span>{new Date(request.updatedAt).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center">
                                  <User className="h-3 w-3 mr-1" />
                                  <span>
                                    Technician:{" "}
                                    {request.technicianId
                                      ? `${request.technicianId.firstName} ${request.technicianId.lastName}`
                                      : "Not Assigned"}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Tractor className="h-3 w-3 mr-1" />
                                  <span>Tractor ID: {request.tractor?.tractorId || "Unknown"}</span>
                                </div>
                              </div>
                              <span className="flex text-sm text-gray-600 mt-1">
                                <span className="font-medium">Parts Needed:</span>{" "}
                                <ul className="flex text-sm">
                                  {request.parts?.length > 0 ? (
                                    request.parts.map((part: any, index: number) => (
                                      <li key={part.partId?._id || index}>
                                        {part.partId?.partName || "Unknown Part"} - {part.partId?.partNumber || "N/A"}
                                        {index < request.parts.length - 1 && ", "}
                                      </li>
                                    ))
                                  ) : (
                                    <li>No parts specified</li>
                                  )}
                                </ul>
                              </span>
                              <span className="text-sm">Notes: {request.notes || "No notes"}</span>
                              {/* Update Button */}
                              <div className="mt-4 flex justify-between">
                                <span className="text-sm">Status: {request.status}</span>
                                <UpdateRequestDialog
                                  request={request}
                                  onUpdate={(updatedData) => handleUpdateRequest(request._id, updatedData)}
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="completed">
                <Card>
                  <CardHeader>
                    <CardTitle>Completed Service Requests</CardTitle>
                    <CardDescription>Service requests you have completed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {assignedRequests
                        .filter((request) => request.status === "completed")
                        .map((request) => (
                          <div key={request._id} className="flex items-start p-4 border rounded-lg">
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
                              <div className="flex flex-wrap items-center mt-2 text-xs text-gray-500 gap-x-4 gap-y-1">
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  <span>{new Date(request.updatedAt).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center">
                                  <User className="h-3 w-3 mr-1" />
                                  <span>
                                    Technician:{" "}
                                    {request.technicianId
                                      ? `${request.technicianId.firstName} ${request.technicianId.lastName}`
                                      : "Not Assigned"}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Tractor className="h-3 w-3 mr-1" />
                                  <span>ID: {request.tractor?.tractorId || "Unknown"}</span>
                                </div>
                              </div>
                            </div>
                            <div className="hidden md:flex ml-4">
                              <Link href={`/service-requests/${request.tractor?.tractorId || "unknown"}`}>
                                <Button variant="outline" size="sm">
                                  View Report
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="technician">
                <Card>
                  <CardHeader>
                    <CardTitle>Technicians</CardTitle>
                    <CardDescription>List of registered technicians</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {technicianData.length === 0 ? (
                        <div className="text-center py-8">
                          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No technicians registered yet</p>
                        </div>
                      ) : (
                        technicianData.map((technician) => (
                          <div key={technician._id} className="flex items-start p-4 border rounded-lg">
                            <div className="mr-4">
                              <User className="h-8 w-8 text-blue-500" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between gap-4 items-center">
                                <h4 className="font-medium">{`${technician.firstName} ${technician.lastName}`}</h4>
                                <div className="text-sm text-gray-600 mt-1 flex items-center">
                                  <span>Status: {technician.status}</span>
                                  {technician.status === "active" ? (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="green"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="w-4 h-4 ml-2"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="red"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="w-4 h-4 ml-2"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M18.364 5.636L5.636 18.364M5.636 5.636l12.728 12.728"
                                      />
                                    </svg>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600">Email: {technician.email}</p>
                              <p className="text-sm text-gray-600 mt-1">Phone: {technician.phoneNumber}</p>
                              <div className="flex gap-4">
                                <p className="text-sm text-gray-600 mt-1">Specialty: {technician.specialty}</p>
                                <p className="text-sm text-gray-600 mt-1">
                                  Experience: {technician.experienceYears || 0} years
                                </p>
                              </div>
                              {technician.hours && (
                                <p className="text-sm text-gray-600 mt-1">
                                  Working Hours: {technician.hours.start} - {technician.hours.end}
                                </p>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Parts Inventory</CardTitle>
                <CardDescription>Current stock of maintenance parts</CardDescription>
              </CardHeader>
              <CardContent>
                <PartsManagement />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
