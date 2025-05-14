"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, CheckCircle, AlertTriangle, PenToolIcon as Tool, Calendar, User, Tractor, Package } from "lucide-react"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard-header"

export default function TechnicianPage() {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)
  const [partsInventory, setPartsInventory] = useState([
    { id: "P001", name: "Oil Filter", quantity: 15, status: "In Stock" },
    { id: "P002", name: "Air Filter", quantity: 8, status: "In Stock" },
    { id: "P003", name: "Fuel Filter", quantity: 5, status: "Low Stock" },
    { id: "P004", name: "Hydraulic Fluid", quantity: 20, status: "In Stock" },
    { id: "P005", name: "Engine Oil", quantity: 25, status: "In Stock" },
    { id: "P006", name: "Transmission Fluid", quantity: 3, status: "Low Stock" },
    { id: "P007", name: "Spark Plugs", quantity: 0, status: "Out of Stock" },
  ])

  const assignedRequests = [
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

  const completedRequests = [
    {
      id: "SR-003",
      tractor: "New Holland TD5.90",
      tractorId: "TR-003",
      date: "2023-05-10",
      type: "Regular Maintenance",
      status: "completed",
      description: "60-hour maintenance service",
      owner: "Michael Brown",
      location: "South Farm",
    },
    {
      id: "SR-004",
      tractor: "Kubota M7060",
      tractorId: "TR-004",
      date: "2023-03-20",
      type: "Repair",
      status: "completed",
      description: "Hydraulic system repair",
      owner: "Emily Wilson",
      location: "West Field",
    },
  ]

  const getSelectedRequest = () => {
    return assignedRequests.find((req) => req.id === selectedRequest)
  }

  const handleUpdateInventory = (id: string, newQuantity: number) => {
    setPartsInventory(
      partsInventory.map((part) => {
        if (part.id === id) {
          const status = newQuantity === 0 ? "Out of Stock" : newQuantity <= 5 ? "Low Stock" : "In Stock"
          return { ...part, quantity: newQuantity, status }
        }
        return part
      }),
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
              <p className="text-xs text-muted-foreground">2 high priority</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed This Week</CardTitle>
              <CheckCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
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
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="assigned">Assigned ({assignedRequests.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedRequests.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="assigned">
                <Card>
                  <CardHeader>
                    <CardTitle>Assigned Service Requests</CardTitle>
                    <CardDescription>Service requests assigned to you</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {assignedRequests.map((request) => (
                        <div
                          key={request.id}
                          className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedRequest === request.id
                              ? "border-orange-500 bg-orange-50"
                              : "hover:border-orange-200 hover:bg-orange-50/50"
                          }`}
                          onClick={() => setSelectedRequest(request.id)}
                        >
                          <div className="mr-4">
                            {request.urgency === "high" ? (
                              <AlertTriangle className="h-8 w-8 text-red-500" />
                            ) : (
                              <Clock className="h-8 w-8 text-orange-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <h4 className="font-medium">{request.tractor}</h4>
                              <Badge
                                className={
                                  request.urgency === "high"
                                    ? "bg-red-500"
                                    : request.urgency === "medium"
                                      ? "bg-amber-500"
                                      : "bg-blue-500"
                                }
                              >
                                {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)} Priority
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">Request ID: {request.id}</p>
                            <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                            <div className="flex flex-wrap items-center mt-2 text-xs text-gray-500 gap-x-4 gap-y-1">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>{request.date}</span>
                              </div>
                              <div className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                <span>Owner: {request.owner}</span>
                              </div>
                              <div className="flex items-center">
                                <Tractor className="h-3 w-3 mr-1" />
                                <span>ID: {request.tractorId}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
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
                      {completedRequests.map((request) => (
                        <div key={request.id} className="flex items-start p-4 border rounded-lg">
                          <div className="mr-4">
                            <CheckCircle className="h-8 w-8 text-green-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <h4 className="font-medium">{request.tractor}</h4>
                              <Badge className="bg-green-500">Completed</Badge>
                            </div>
                            <p className="text-sm text-gray-600">Request ID: {request.id}</p>
                            <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                            <div className="flex flex-wrap items-center mt-2 text-xs text-gray-500 gap-x-4 gap-y-1">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>{request.date}</span>
                              </div>
                              <div className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                <span>Owner: {request.owner}</span>
                              </div>
                              <div className="flex items-center">
                                <Tractor className="h-3 w-3 mr-1" />
                                <span>ID: {request.tractorId}</span>
                              </div>
                            </div>
                          </div>
                          <div className="hidden md:flex ml-4">
                            <Link href={`/service-reports/${request.id}`}>
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
            </Tabs>
          </div>

          <div>
            {selectedRequest ? (
              <Card>
                <CardHeader>
                  <CardTitle>Service Details</CardTitle>
                  <CardDescription>Complete the service request</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">{getSelectedRequest()?.tractor}</h3>
                    <p className="text-sm text-gray-600">{getSelectedRequest()?.description}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Required Parts</h4>
                    <div className="space-y-2">
                      {getSelectedRequest()?.partsNeeded.map((part, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Checkbox id={`part-${index}`} />
                          <Label htmlFor={`part-${index}`}>{part}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service-notes">Service Notes</Label>
                    <Textarea id="service-notes" placeholder="Enter service details and observations" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service-hours">Hours on Tractor</Label>
                    <Input id="service-hours" type="number" placeholder="Enter current hours" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service-status">Update Status</Label>
                    <Select>
                      <SelectTrigger id="service-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="parts-needed">Parts Needed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 flex gap-2">
                    <Button className="flex-1 bg-orange-500 hover:bg-orange-600">Update Service</Button>
                    <Button variant="outline" className="flex-1">
                      Request Parts
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Tool className="h-12 w-12 text-orange-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a service request to view details</p>
                </CardContent>
              </Card>
            )}

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Parts Inventory</CardTitle>
                <CardDescription>Current stock of maintenance parts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {partsInventory.map((part) => (
                    <div key={part.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{part.name}</p>
                        <Badge
                          className={
                            part.status === "In Stock"
                              ? "bg-green-500"
                              : part.status === "Low Stock"
                                ? "bg-amber-500"
                                : "bg-red-500"
                          }
                        >
                          {part.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleUpdateInventory(part.id, Math.max(0, part.quantity - 1))}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{part.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleUpdateInventory(part.id, part.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
