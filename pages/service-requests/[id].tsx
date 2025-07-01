/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Tractor,
  PenToolIcon as Tool,
  MessageSquare,
  Package,
  AlertTriangle,
  CheckCircle,
  Send,
  Paperclip,
  DollarSign,
  Phone,
  Loader2,
} from "lucide-react"
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
    location?: string
  }
  technicianId?: {
    _id: string
    firstName: string
    lastName: string
    email?: string
    phoneNumber?: string
    specialty?: string
  }
  description: string
  priority: "low" | "medium" | "high"
  status: "pending" | "assigned" | "in-progress" | "completed" | "cancelled"
  maintenanceTask?: string
  commonProblem?: string
  parts?: Array<{
    partId: {
      _id: string
      partName: string
      partNumber: string
      price?: number
    }
    quantity: number
  }>
  notes?: string
  createdAt: string
  updatedAt: string
  estimatedCost?: number
  actualCost?: number
  paymentStatus?: string
}

interface StatusUpdate {
  status: string
  timestamp: string
  updatedBy: string
  notes: string
}

interface Message {
  id: string
  sender: string
  role: string
  timestamp: string
  content: string
}

export default function ServiceRequestDetailPage() {
  const router = useRouter()
  const { id } = router.query

  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("details")
  const [statusUpdate, setStatusUpdate] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [statusHistory, setStatusHistory] = useState<StatusUpdate[]>([])
  const [messages, setMessages] = useState<Message[]>([])

  // Add this right after the router.query destructuring
  useEffect(() => {
    if (router.isReady) {
      console.log("Router query:", router.query)
      console.log("Service request ID:", id)
    }
  }, [router.isReady, router.query, id])

  // Fetch service request details
  useEffect(() => {
    const fetchServiceRequest = async () => {
      if (!id || !router.isReady) return

      try {
        setLoading(true)
        console.log("Fetching service request with ID:", id)

        // First, try to get all service requests and find the one we need
        let response
        try {
          // Try fetching all requests first
          response = await axios.get("/api/assign-service")
          console.log("All service requests response:", response.data)

          if (response.data.success && response.data.data) {
            const allRequests = Array.isArray(response.data.data) ? response.data.data : [response.data.data]

            // Find the request by ID, slug, or _id
            const foundRequest = allRequests.find((req: any) => req._id === id || req.slug === id || req.id === id)

            if (foundRequest) {
              console.log("Found service request:", foundRequest)
              setServiceRequest(foundRequest)
              generateMockStatusHistory(foundRequest)
              generateMockMessages(foundRequest)
            } else {
              console.log("Service request not found in list")
              setError("Service request not found")
            }
          } else {
            console.log("No service requests found")
            setError("No service requests available")
          }
        } catch (getAllError: any) {
          console.error("Error fetching all service requests:", getAllError)

          // If getting all requests fails, try with specific ID
          try {
            response = await axios.get(`/api/assign-service?id=${id}`)
            console.log("Single service request response:", response.data)

            if (response.data.success && response.data.data) {
              setServiceRequest(response.data.data)
              generateMockStatusHistory(response.data.data)
              generateMockMessages(response.data.data)
            } else {
              setError("Service request not found")
            }
          } catch (getOneError: any) {
            console.error("Error fetching single service request:", getOneError)
            console.error("Error response:", getOneError.response?.data)

            if (getOneError.response?.status === 404) {
              setError("Service request not found")
            } else if (getOneError.response?.status === 400) {
              setError("Invalid request parameters")
            } else {
              setError("Failed to fetch service request details")
            }
          }
        }
      } catch (error: any) {
        console.error("Unexpected error:", error)
        setError("An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchServiceRequest()
  }, [id, router.isReady])

  const generateMockStatusHistory = (request: ServiceRequest) => {
    const history: StatusUpdate[] = [
      {
        status: "submitted",
        timestamp: new Date(request.createdAt).toLocaleString(),
        updatedBy: "System",
        notes: "Service request submitted",
      },
    ]

    if (request.status !== "pending") {
      history.push({
        status: "assigned",
        timestamp: new Date(request.updatedAt).toLocaleString(),
        updatedBy: "Hub Lead",
        notes: `Assigned to ${request.technicianId?.firstName || "technician"}`,
      })
    }

    if (request.status === "in-progress" || request.status === "completed") {
      history.push({
        status: "in-progress",
        timestamp: new Date(request.updatedAt).toLocaleString(),
        updatedBy: request.technicianId?.firstName || "Technician",
        notes: "Work started on the service request",
      })
    }

    if (request.status === "completed") {
      history.push({
        status: "completed",
        timestamp: new Date(request.updatedAt).toLocaleString(),
        updatedBy: request.technicianId?.firstName || "Technician",
        notes: "Service completed successfully",
      })
    }

    setStatusHistory(history)
  }

  const generateMockMessages = (request: ServiceRequest) => {
    const mockMessages: Message[] = [
      {
        id: "msg-001",
        sender: "Tractor Owner",
        role: "Owner",
        timestamp: new Date(request.createdAt).toLocaleString(),
        content: "Service request submitted. Please let me know when the technician will arrive.",
      },
    ]

    if (request.technicianId) {
      mockMessages.push({
        id: "msg-002",
        sender: `${request.technicianId.firstName} ${request.technicianId.lastName}`,
        role: "Technician",
        timestamp: new Date(request.updatedAt).toLocaleString(),
        content: "I have been assigned to your service request. I will contact you to schedule a visit.",
      })
    }

    setMessages(mockMessages)
  }

  const handleStatusUpdate = async () => {
    if (!statusUpdate || !serviceRequest) return

    setIsUpdating(true)

    try {
      const response = await axios.put(`/api/assign-service?id=${serviceRequest._id}`, {
        status: "in-progress",
        notes: statusUpdate,
      })

      if (response.data.success) {
        const newStatus: StatusUpdate = {
          status: "in-progress",
          timestamp: new Date().toLocaleString(),
          updatedBy: "Current User",
          notes: statusUpdate,
        }

        setStatusHistory((prev) => [...prev, newStatus])
        setStatusUpdate("")
        alert("Status updated successfully!")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Failed to update status. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSendMessage = () => {
    if (!newMessage) return

    const newMsg: Message = {
      id: `msg-${messages.length + 1}`,
      sender: "Current User",
      role: "User",
      timestamp: new Date().toLocaleString(),
      content: newMessage,
    }

    setMessages((prev) => [...prev, newMsg])
    setNewMessage("")
    alert("Message sent successfully!")
  }

  const handleCompleteService = async () => {
    if (!serviceRequest) return

    try {
      const response = await axios.put(`/api/assign-service?id=${serviceRequest._id}`, {
        status: "completed",
        notes: "Service completed successfully",
      })

      if (response.data.success) {
        setServiceRequest((prev) => (prev ? { ...prev, status: "completed" } : null))

        const newStatus: StatusUpdate = {
          status: "completed",
          timestamp: new Date().toLocaleString(),
          updatedBy: "Current User",
          notes: "Service completed successfully",
        }

        setStatusHistory((prev) => [...prev, newStatus])
        alert("Service marked as completed!")
      }
    } catch (error) {
      console.error("Error completing service:", error)
      alert("Failed to complete service. Please try again.")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-500">Pending</Badge>
      case "assigned":
        return <Badge className="bg-blue-500">Assigned</Badge>
      case "in-progress":
        return <Badge className="bg-purple-500">In Progress</Badge>
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "low":
        return <Badge className="bg-blue-500">Low Priority</Badge>
      case "medium":
        return <Badge className="bg-amber-500">Medium Priority</Badge>
      case "high":
        return <Badge className="bg-orange-500">High Priority</Badge>
      case "critical":
        return <Badge className="bg-red-500">Critical Priority</Badge>
      default:
        return <Badge>{urgency}</Badge>
    }
  }

  const calculateTotalPartsCost = () => {
    if (!serviceRequest?.parts) return 0
    return serviceRequest.parts.reduce((sum, part) => {
      const price = part.partId.price || 0
      return sum + price * part.quantity
    }, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-lg">Loading service request details...</span>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !serviceRequest) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <Link href="/service-requests">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Service Request Not Found</h1>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-gray-600">{error || "The requested service request could not be found."}</p>
                <Link href="/service-requests">
                  <Button className="mt-4">Return to Service Requests</Button>
                </Link>
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
        <div className="flex items-center mb-8">
          <Link href="/service-requests">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Service Request {serviceRequest.slug}</h1>
              <div className="flex gap-2 mt-2 md:mt-0">
                {getStatusBadge(serviceRequest.status)}
                {getUrgencyBadge(serviceRequest.priority)}
              </div>
            </div>
            <p className="text-gray-600">
              {serviceRequest.tractor?.name || "Unknown Tractor"} - {serviceRequest.maintenanceTask || "Service"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="status">Status</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="parts">Parts & Costs</TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Service Request Details</CardTitle>
                    <CardDescription>Complete information about this service request</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Request Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Request Type</p>
                          <p className="font-medium">{serviceRequest.maintenanceTask || "Service Request"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date Submitted</p>
                          <p className="font-medium">{new Date(serviceRequest.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Priority</p>
                          <p className="font-medium capitalize">{serviceRequest.priority}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Last Updated</p>
                          <p className="font-medium">{new Date(serviceRequest.updatedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-2">Description</h3>
                      <p className="text-gray-700">{serviceRequest.description}</p>
                      {serviceRequest.commonProblem && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">Common Problem</p>
                          <p className="text-gray-700">{serviceRequest.commonProblem}</p>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-2">Tractor Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Tractor Name</p>
                          <p className="font-medium">{serviceRequest.tractor?.name || "Unknown"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Tractor ID</p>
                          <p className="font-medium">{serviceRequest.tractor?.tractorId || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{serviceRequest.tractor?.location || "Not specified"}</p>
                        </div>
                      </div>
                    </div>

                    {serviceRequest.technicianId && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="text-lg font-medium mb-2">Assigned Technician</h3>
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src="/placeholder.svg?height=48&width=48"
                                alt={`${serviceRequest.technicianId.firstName} ${serviceRequest.technicianId.lastName}`}
                              />
                              <AvatarFallback className="bg-orange-100 text-orange-800">
                                {serviceRequest.technicianId.firstName?.[0]}
                                {serviceRequest.technicianId.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                              <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="font-medium">
                                  {serviceRequest.technicianId.firstName} {serviceRequest.technicianId.lastName}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Specialization</p>
                                <p className="font-medium">{serviceRequest.technicianId.specialty || "General"}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-medium">{serviceRequest.technicianId.phoneNumber || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{serviceRequest.technicianId.email || "N/A"}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {serviceRequest.notes && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="text-lg font-medium mb-2">Additional Notes</h3>
                          <p className="text-gray-700">{serviceRequest.notes}</p>
                        </div>
                      </>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/tractor/${serviceRequest.tractor?.tractorId}`)}
                    >
                      <Tractor className="mr-2 h-4 w-4" />
                      View Tractor Details
                    </Button>
                    {serviceRequest.status !== "completed" && serviceRequest.status !== "cancelled" && (
                      <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleCompleteService}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark as Completed
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="status">
                <Card>
                  <CardHeader>
                    <CardTitle>Status History</CardTitle>
                    <CardDescription>Track the progress of this service request</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {statusHistory.map((status, index) => (
                        <div key={index} className="relative pl-8 pb-8">
                          {index !== statusHistory.length - 1 && (
                            <div className="absolute top-0 left-3 h-full w-px bg-gray-200" />
                          )}
                          <div className="absolute top-0 left-0 h-6 w-6 rounded-full bg-orange-100 border-2 border-orange-500 flex items-center justify-center">
                            {status.status === "submitted" && <AlertTriangle className="h-3 w-3 text-orange-500" />}
                            {status.status === "assigned" && <User className="h-3 w-3 text-orange-500" />}
                            {status.status === "in-progress" && <Tool className="h-3 w-3 text-orange-500" />}
                            {status.status === "completed" && <CheckCircle className="h-3 w-3 text-orange-500" />}
                          </div>
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <h4 className="font-medium capitalize">{status.status.replace("-", " ")}</h4>
                            <p className="text-sm text-gray-500">{status.timestamp}</p>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Updated by: {status.updatedBy}</p>
                          {status.notes && <p className="text-sm mt-2">{status.notes}</p>}
                        </div>
                      ))}
                    </div>

                    {serviceRequest.status !== "completed" && serviceRequest.status !== "cancelled" && (
                      <div className="mt-8 pt-6 border-t">
                        <h3 className="text-lg font-medium mb-4">Add Status Update</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="status-update">Update Notes</Label>
                            <Textarea
                              id="status-update"
                              placeholder="Enter details about the current status..."
                              value={statusUpdate}
                              onChange={(e) => setStatusUpdate(e.target.value)}
                              rows={4}
                            />
                          </div>
                          <Button
                            className="bg-orange-500 hover:bg-orange-600"
                            onClick={handleStatusUpdate}
                            disabled={!statusUpdate || isUpdating}
                          >
                            {isUpdating ? "Updating..." : "Add Update"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="messages">
                <Card>
                  <CardHeader>
                    <CardTitle>Communication</CardTitle>
                    <CardDescription>Messages between owner, technician, and hub lead</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6 max-h-[500px] overflow-y-auto mb-6 p-1">
                      {messages.map((message) => (
                        <div key={message.id} className="flex gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="/placeholder.svg?height=40&width=40" alt={message.sender} />
                            <AvatarFallback className="bg-orange-100 text-orange-800">
                              {message.sender
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                              <p className="font-medium">{message.sender}</p>
                              <Badge variant="outline" className="md:ml-2">
                                {message.role}
                              </Badge>
                              <p className="text-xs text-gray-500">{message.timestamp}</p>
                            </div>
                            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                              <p className="text-gray-700">{message.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-4">Send Message</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-message">Message</Label>
                          <Textarea
                            id="new-message"
                            placeholder="Type your message here..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            rows={3}
                          />
                        </div>
                        <div className="flex justify-between">
                          <Button variant="outline">
                            <Paperclip className="mr-2 h-4 w-4" />
                            Attach File
                          </Button>
                          <Button
                            className="bg-orange-500 hover:bg-orange-600"
                            onClick={handleSendMessage}
                            disabled={!newMessage}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="parts">
                <Card>
                  <CardHeader>
                    <CardTitle>Parts & Costs</CardTitle>
                    <CardDescription>Parts required and cost breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {serviceRequest.parts && serviceRequest.parts.length > 0 ? (
                        <div>
                          <h3 className="text-lg font-medium mb-4">Required Parts</h3>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left py-3 px-4">Part Name</th>
                                  <th className="text-left py-3 px-4">Part Number</th>
                                  <th className="text-left py-3 px-4">Quantity</th>
                                  <th className="text-right py-3 px-4">Unit Price</th>
                                  <th className="text-right py-3 px-4">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {serviceRequest.parts.map((part, index) => (
                                  <tr key={part.partId._id || index} className="border-b">
                                    <td className="py-3 px-4">{part.partId.partName}</td>
                                    <td className="py-3 px-4">{part.partId.partNumber}</td>
                                    <td className="py-3 px-4">{part.quantity}</td>
                                    <td className="py-3 px-4 text-right">${(part.partId.price || 0).toFixed(2)}</td>
                                    <td className="py-3 px-4 text-right">
                                      ${((part.partId.price || 0) * part.quantity).toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot>
                                <tr className="border-t-2">
                                  <td className="py-3 px-4 font-medium" colSpan={4}>
                                    Parts Subtotal
                                  </td>
                                  <td className="py-3 px-4 text-right font-medium">
                                    ${calculateTotalPartsCost().toFixed(2)}
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No parts specified for this service request</p>
                        </div>
                      )}

                      <Separator />

                      <div>
                        <h3 className="text-lg font-medium mb-4">Cost Summary</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Parts Cost</p>
                              <p className="font-medium">${calculateTotalPartsCost().toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Labor Cost</p>
                              <p className="font-medium">$175.00</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Travel Fee</p>
                              <p className="font-medium">$25.00</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Tax</p>
                              <p className="font-medium">$25.45</p>
                            </div>
                          </div>
                          <Separator className="my-4" />
                          <div className="flex justify-between">
                            <p className="font-medium">Estimated Total</p>
                            <p className="font-medium">${(calculateTotalPartsCost() + 175 + 25 + 25.45).toFixed(2)}</p>
                          </div>
                          {serviceRequest.actualCost && (
                            <div className="flex justify-between mt-2">
                              <p className="font-medium">Actual Total</p>
                              <p className="font-medium">${serviceRequest.actualCost}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Status</span>
                  </div>
                  {getStatusBadge(serviceRequest.status)}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Priority</span>
                  </div>
                  {getUrgencyBadge(serviceRequest.priority)}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Submitted</span>
                  </div>
                  <span>{new Date(serviceRequest.createdAt).toLocaleDateString()}</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tractor className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Tractor</span>
                  </div>
                  <span>{serviceRequest.tractor?.name || "Unknown"}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tool className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Technician</span>
                  </div>
                  <span>
                    {serviceRequest.technicianId
                      ? `${serviceRequest.technicianId.firstName} ${serviceRequest.technicianId.lastName}`
                      : "Unassigned"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Parts Required</span>
                  </div>
                  <span>{serviceRequest.parts?.length || 0}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Est. Cost</span>
                  </div>
                  <span>${(calculateTotalPartsCost() + 175 + 25 + 25.45).toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                {serviceRequest.status !== "completed" && serviceRequest.status !== "cancelled" && (
                  <Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={handleCompleteService}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Completed
                  </Button>
                )}
                <Button variant="outline" className="w-full" onClick={() => setActiveTab("messages")}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </CardFooter>
            </Card>

            {serviceRequest.technicianId && (
              <Card>
                <CardHeader>
                  <CardTitle>Assigned Technician</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src="/placeholder.svg?height=48&width=48"
                        alt={`${serviceRequest.technicianId.firstName} ${serviceRequest.technicianId.lastName}`}
                      />
                      <AvatarFallback className="bg-orange-100 text-orange-800">
                        {serviceRequest.technicianId.firstName?.[0]}
                        {serviceRequest.technicianId.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {serviceRequest.technicianId.firstName} {serviceRequest.technicianId.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{serviceRequest.technicianId.specialty || "General"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      <Phone className="mr-2 h-4 w-4" />
                      Call
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Related Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/tractor/${serviceRequest.tractor?.tractorId}`}>
                    <Tractor className="mr-2 h-4 w-4" />
                    View Tractor Details
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/service-requests">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Service Requests
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/service-request">
                    <Tool className="mr-2 h-4 w-4" />
                    Create New Service Request
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}