/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Tractor,
  PenToolIcon as Tool,
  MessageSquare,
  Package,
  AlertTriangle,
  CheckCircle,
  FileText,
  Send,
  Paperclip,
  DollarSign,
  Phone,
} from "lucide-react"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard-header"
import { useNotification } from "@/components/notification-provider"
import { useRouter } from "next/router"

export default function ServiceRequestDetailPage() {
  const router = useRouter()
  const { id } = router.query;  
  const { showNotification } = useNotification()
  const [activeTab, setActiveTab] = useState("details")
  const [statusUpdate, setStatusUpdate] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  // Mock data for a service request - in a real app, this would be fetched from an API
  const [serviceRequest, setServiceRequest] = useState({
    id: id as string,
    tractor: "Massey Ferguson 240",
    tractorId: "TR-002",
    owner: {
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "+1 (555) 234-5678",
      location: "East Field",
    },
    date: "2023-06-08",
    type: "Repair",
    status: "in-progress",
    description:
      "Engine making unusual noise. Possible issue with the fuel system or timing. Tractor is still operational but performance is reduced.",
    urgency: "high",
    location: "East Field - Sector B3",
    assignedTo: {
      id: "TECH-001",
      name: "Mike Johnson",
      specialization: "Engine Repair",
      phone: "+1 (555) 987-6543",
      email: "mike.johnson@hellotractor.com",
      rating: 4.8,
    },
    estimatedCompletion: "2023-06-12",
    createdBy: "Sarah Johnson",
    createdAt: "2023-06-08 09:15 AM",
    updatedAt: "2023-06-09 02:30 PM",
    partsNeeded: [
      { id: "P001", name: "Fuel Filter", quantity: 1, status: "In Stock", cost: 45.99 },
      { id: "P002", name: "Timing Belt", quantity: 1, status: "Ordered", cost: 89.5 },
      { id: "P003", name: "Engine Oil", quantity: 5, status: "In Stock", cost: 12.99 },
    ],
    estimatedCost: 325.45,
    actualCost: null,
    paymentStatus: "Pending",
    statusHistory: [
      {
        status: "submitted",
        timestamp: "2023-06-08 09:15 AM",
        updatedBy: "Sarah Johnson",
        notes: "Service request submitted",
      },
      {
        status: "assigned",
        timestamp: "2023-06-08 11:30 AM",
        updatedBy: "Hub Lead",
        notes: "Assigned to Mike Johnson",
      },
      {
        status: "in-progress",
        timestamp: "2023-06-09 02:30 PM",
        updatedBy: "Mike Johnson",
        notes: "Initial diagnosis complete. Will need to replace fuel filter and timing belt.",
      },
    ],
    messages: [
      {
        id: "msg-001",
        sender: "Sarah Johnson",
        role: "Owner",
        timestamp: "2023-06-08 09:30 AM",
        content: "Please let me know when the technician will arrive. I need the tractor operational by next week.",
      },
      {
        id: "msg-002",
        sender: "Hub Lead",
        role: "Hub Lead",
        timestamp: "2023-06-08 10:15 AM",
        content: "We've received your request and are assigning a technician. We'll keep you updated.",
      },
      {
        id: "msg-003",
        sender: "Mike Johnson",
        role: "Technician",
        timestamp: "2023-06-09 08:45 AM",
        content: "I'll be at your location tomorrow morning around 9 AM. Please ensure access to the tractor.",
      },
      {
        id: "msg-004",
        sender: "Sarah Johnson",
        role: "Owner",
        timestamp: "2023-06-09 09:10 AM",
        content: "Thank you. The tractor will be in the main barn. Someone will be there to provide access.",
      },
    ],
    documents: [
      {
        id: "doc-001",
        name: "Initial Service Request.pdf",
        type: "application/pdf",
        size: "245 KB",
        uploadedBy: "Sarah Johnson",
        uploadedAt: "2023-06-08 09:15 AM",
      },
      {
        id: "doc-002",
        name: "Tractor Manual.pdf",
        type: "application/pdf",
        size: "3.2 MB",
        uploadedBy: "Sarah Johnson",
        uploadedAt: "2023-06-08 09:20 AM",
      },
      {
        id: "doc-003",
        name: "Diagnostic Report.pdf",
        type: "application/pdf",
        size: "1.8 MB",
        uploadedBy: "Mike Johnson",
        uploadedAt: "2023-06-09 03:15 PM",
      },
    ],
  })

  const handleStatusUpdate = () => {
    if (!statusUpdate) return

    setIsUpdating(true)

    // Simulate API call
    setTimeout(() => {
      const newStatus = {
        status: "in-progress",
        timestamp: new Date().toLocaleString(),
        updatedBy: "Current User",
        notes: statusUpdate,
      }

      setServiceRequest((prev) => ({
        ...prev,
        statusHistory: [...prev.statusHistory, newStatus],
      }))

      setStatusUpdate("")
      setIsUpdating(false)
      showNotification("Status Updated", "The service request status has been updated successfully.", "success")
    }, 1000)
  }

  const handleSendMessage = () => {
    if (!newMessage) return

    // Simulate API call
    const newMsg = {
      id: `msg-${serviceRequest.messages.length + 1}`,
      sender: "Current User",
      role: "Technician",
      timestamp: new Date().toLocaleString(),
      content: newMessage,
    }

    setServiceRequest((prev) => ({
      ...prev,
      messages: [...prev.messages, newMsg],
    }))

    setNewMessage("")
    showNotification("Message Sent", "Your message has been sent successfully.", "success")
  }

  const handleCompleteService = () => {
    // Simulate API call
    setTimeout(() => {
      setServiceRequest((prev:any) => ({
        ...prev,
        status: "completed",
        statusHistory: [
          ...prev.statusHistory,
          {
            status: "completed",
            timestamp: new Date().toLocaleString(),
            updatedBy: "Current User",
            notes: "Service completed successfully",
          },
        ],
        actualCost: prev.estimatedCost,
      }))

      showNotification("Service Completed", "The service has been marked as completed.", "success")
    }, 1000)
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
              <h1 className="text-3xl font-bold text-gray-900">Service Request {serviceRequest.id}</h1>
              <div className="flex gap-2 mt-2 md:mt-0">
                {getStatusBadge(serviceRequest.status)}
                {getUrgencyBadge(serviceRequest.urgency)}
              </div>
            </div>
            <p className="text-gray-600">
              {serviceRequest.tractor} - {serviceRequest.type}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid w-full grid-cols-5 mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="status">Status</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="parts">Parts & Costs</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
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
                          <p className="font-medium">{serviceRequest.type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date Submitted</p>
                          <p className="font-medium">{serviceRequest.date}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Created By</p>
                          <p className="font-medium">{serviceRequest.createdBy}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Last Updated</p>
                          <p className="font-medium">{serviceRequest.updatedAt}</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-2">Description</h3>
                      <p className="text-gray-700">{serviceRequest.description}</p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-2">Tractor Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Tractor Model</p>
                          <p className="font-medium">{serviceRequest.tractor}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Tractor ID</p>
                          <p className="font-medium">{serviceRequest.tractorId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{serviceRequest.location}</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-2">Owner Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="font-medium">{serviceRequest.owner.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{serviceRequest.owner.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{serviceRequest.owner.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{serviceRequest.owner.location}</p>
                        </div>
                      </div>
                    </div>

                    {serviceRequest.assignedTo && (
                      <>
                        <Separator />

                        <div>
                          <h3 className="text-lg font-medium mb-2">Assigned Technician</h3>
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src="/placeholder.svg?height=48&width=48"
                                alt={serviceRequest.assignedTo.name}
                              />
                              <AvatarFallback className="bg-orange-100 text-orange-800">
                                {serviceRequest.assignedTo.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                              <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="font-medium">{serviceRequest.assignedTo.name}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Specialization</p>
                                <p className="font-medium">{serviceRequest.assignedTo.specialization}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-medium">{serviceRequest.assignedTo.phone}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{serviceRequest.assignedTo.email}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => router.push(`/tractor/${serviceRequest.tractorId}`)}>
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
                      {serviceRequest.statusHistory.map((status, index) => (
                        <div key={index} className="relative pl-8 pb-8">
                          {index !== serviceRequest.statusHistory.length - 1 && (
                            <div className="absolute top-0 left-3 h-full w-px bg-gray-200" />
                          )}
                          <div className="absolute top-0 left-0 h-6 w-6 rounded-full bg-orange-100 border-2 border-orange-500 flex items-center justify-center">
                            {status.status === "submitted" && <AlertTriangle className="h-3 w-3 text-orange-500" />}
                            {status.status === "assigned" && <User className="h-3 w-3 text-orange-500" />}
                            {status.status === "in-progress" && <Tool className="h-3 w-3 text-orange-500" />}
                            {status.status === "completed" && <CheckCircle className="h-3 w-3 text-orange-500" />}
                          </div>
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <h4 className="font-medium capitalize">{status.status}</h4>
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
                      {serviceRequest.messages.map((message) => (
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
                      <div>
                        <h3 className="text-lg font-medium mb-4">Required Parts</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-3 px-4">Part Name</th>
                                <th className="text-left py-3 px-4">Quantity</th>
                                <th className="text-left py-3 px-4">Status</th>
                                <th className="text-right py-3 px-4">Cost</th>
                              </tr>
                            </thead>
                            <tbody>
                              {serviceRequest.partsNeeded.map((part) => (
                                <tr key={part.id} className="border-b">
                                  <td className="py-3 px-4">{part.name}</td>
                                  <td className="py-3 px-4">{part.quantity}</td>
                                  <td className="py-3 px-4">
                                    <Badge
                                      className={
                                        part.status === "In Stock"
                                          ? "bg-green-500"
                                          : part.status === "Ordered"
                                            ? "bg-blue-500"
                                            : "bg-amber-500"
                                      }
                                    >
                                      {part.status}
                                    </Badge>
                                  </td>
                                  <td className="py-3 px-4 text-right">${part.cost.toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="border-t-2">
                                <td className="py-3 px-4 font-medium" colSpan={3}>
                                  Parts Subtotal
                                </td>
                                <td className="py-3 px-4 text-right font-medium">
                                  ${serviceRequest.partsNeeded.reduce((sum, part) => sum + part.cost, 0).toFixed(2)}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-medium mb-4">Cost Summary</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Parts Cost</p>
                              <p className="font-medium">
                                ${serviceRequest.partsNeeded.reduce((sum, part) => sum + part.cost, 0).toFixed(2)}
                              </p>
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
                            <p className="font-medium">${serviceRequest.estimatedCost.toFixed(2)}</p>
                          </div>
                          {serviceRequest.actualCost && (
                            <div className="flex justify-between mt-2">
                              <p className="font-medium">Actual Total</p>
                              <p className="font-medium">${serviceRequest.actualCost}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-medium mb-4">Payment Status</h3>
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center gap-3">
                            <DollarSign className="h-5 w-5 text-orange-500" />
                            <div>
                              <p className="font-medium">Payment Status</p>
                              <p className="text-sm text-gray-500">{serviceRequest.paymentStatus}</p>
                            </div>
                          </div>
                          {serviceRequest.status === "completed" && serviceRequest.paymentStatus === "Pending" && (
                            <Button className="bg-orange-500 hover:bg-orange-600">Process Payment</Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle>Documents</CardTitle>
                    <CardDescription>Files and documents related to this service request</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-4">Document Name</th>
                              <th className="text-left py-3 px-4">Type</th>
                              <th className="text-left py-3 px-4">Size</th>
                              <th className="text-left py-3 px-4">Uploaded By</th>
                              <th className="text-left py-3 px-4">Date</th>
                              <th className="text-right py-3 px-4">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {serviceRequest.documents.map((doc) => (
                              <tr key={doc.id} className="border-b">
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-orange-500" />
                                    <span>{doc.name}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">{doc.type.split("/")[1].toUpperCase()}</td>
                                <td className="py-3 px-4">{doc.size}</td>
                                <td className="py-3 px-4">{doc.uploadedBy}</td>
                                <td className="py-3 px-4">{doc.uploadedAt}</td>
                                <td className="py-3 px-4 text-right">
                                  <Button variant="ghost" size="sm">
                                    View
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="pt-4">
                        <h3 className="text-lg font-medium mb-4">Upload Document</h3>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Paperclip className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500 mb-4">
                            Drag and drop files here, or click to select files
                          </p>
                          <Input id="file-upload" type="file" className="hidden" />
                          <Label htmlFor="file-upload" asChild>
                            <Button variant="outline">Select Files</Button>
                          </Label>
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
                  {getUrgencyBadge(serviceRequest.urgency)}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Submitted</span>
                  </div>
                  <span>{serviceRequest.date}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Est. Completion</span>
                  </div>
                  <span>{serviceRequest.estimatedCompletion}</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tractor className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Tractor</span>
                  </div>
                  <span>{serviceRequest.tractor}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Owner</span>
                  </div>
                  <span>{serviceRequest.owner.name}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Location</span>
                  </div>
                  <span>{serviceRequest.owner.location}</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tool className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Technician</span>
                  </div>
                  <span>{serviceRequest.assignedTo?.name || "Unassigned"}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Parts Required</span>
                  </div>
                  <span>{serviceRequest.partsNeeded.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Est. Cost</span>
                  </div>
                  <span>${serviceRequest.estimatedCost.toFixed(2)}</span>
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

            {serviceRequest.assignedTo && (
              <Card>
                <CardHeader>
                  <CardTitle>Assigned Technician</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg?height=48&width=48" alt={serviceRequest.assignedTo.name} />
                      <AvatarFallback className="bg-orange-100 text-orange-800">
                        {serviceRequest.assignedTo.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{serviceRequest.assignedTo.name}</p>
                      <p className="text-sm text-gray-500">{serviceRequest.assignedTo.specialization}</p>
                      <div className="flex items-center mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(serviceRequest.assignedTo.rating) ? "text-yellow-400" : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 15.934l-6.18 3.254 1.18-6.875L.11 7.695l6.9-1.004L10 .5l3.09 6.191 6.9 1.004-4.89 4.618 1.18 6.875L10 15.934z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-1 text-sm text-gray-500">{serviceRequest.assignedTo.rating}/5</span>
                      </div>
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
                  <Link href={`/tractor/${serviceRequest.tractorId}`}>
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
