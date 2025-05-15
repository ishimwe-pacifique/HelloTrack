"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertTriangle, Clock, Calendar, User, MapPin, Search, Filter, BarChart3 } from "lucide-react"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard-header"
import { useNotification } from "@/components/notification-provider"

export default function HubLeadPage() {
  const { showNotification } = useNotification()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)
  const [assignedTechnician, setAssignedTechnician] = useState<string | null>(null)

  const serviceRequests = [
    {
      id: "SR-001",
      tractor: "John Deere 5E",
      tractorId: "TR-001",
      owner: "John Doe",
      date: "2023-06-10",
      type: "Regular Maintenance",
      status: "pending",
      description: "60-hour maintenance service",
      urgency: "medium",
      location: "North Farm",
      assignedTo: null,
    },
    {
      id: "SR-002",
      tractor: "Massey Ferguson 240",
      tractorId: "TR-002",
      owner: "Sarah Johnson",
      date: "2023-06-08",
      type: "Repair",
      status: "pending",
      description: "Engine making unusual noise",
      urgency: "high",
      location: "East Field",
      assignedTo: null,
    },
    {
      id: "SR-003",
      tractor: "Kubota M7060",
      tractorId: "TR-004",
      owner: "Emily Wilson",
      date: "2023-06-11",
      type: "Emergency",
      status: "pending",
      description: "Tractor won't start, needed for harvest",
      urgency: "critical",
      location: "West Field",
      assignedTo: null,
    },
    {
      id: "SR-004",
      tractor: "New Holland TD5.90",
      tractorId: "TR-003",
      owner: "Michael Brown",
      date: "2023-06-09",
      type: "Inspection",
      status: "assigned",
      description: "Pre-harvest inspection",
      urgency: "medium",
      location: "South Farm",
      assignedTo: "Mike Johnson",
    },
    {
      id: "SR-005",
      tractor: "John Deere 6M",
      tractorId: "TR-005",
      owner: "Robert Garcia",
      date: "2023-06-07",
      type: "Regular Maintenance",
      status: "assigned",
      description: "60-hour maintenance service",
      urgency: "low",
      location: "Central Farm",
      assignedTo: "Sarah Williams",
    },
  ]

  const technicians = [
    {
      id: "TECH-001",
      name: "Mike Johnson",
      specialization: "Engine Repair",
      rating: 4.8,
      availability: "Available",
      currentLoad: 2,
      location: "North District",
    },
    {
      id: "TECH-002",
      name: "Sarah Williams",
      specialization: "Hydraulic Systems",
      rating: 4.6,
      availability: "Available",
      currentLoad: 3,
      location: "East District",
    },
    {
      id: "TECH-003",
      name: "David Brown",
      specialization: "Electrical Systems",
      rating: 4.5,
      availability: "Busy",
      currentLoad: 5,
      location: "South District",
    },
    {
      id: "TECH-004",
      name: "Lisa Chen",
      specialization: "General Maintenance",
      rating: 4.9,
      availability: "Available",
      currentLoad: 1,
      location: "West District",
    },
  ]

  const filteredRequests = serviceRequests.filter((request) => {
    const matchesSearch =
      request.tractor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "pending" && request.status === "pending") ||
      (statusFilter === "assigned" && request.status === "assigned")

    return matchesSearch && matchesStatus
  })

  const getSelectedRequest = () => {
    return serviceRequests.find((req) => req.id === selectedRequest)
  }

  const handleAssignTechnician = () => {
    if (!selectedRequest || !assignedTechnician) return

    // In a real app, this would make an API call to assign the technician
    showNotification(
      "Technician Assigned",
      `${technicians.find((tech) => tech.id === assignedTechnician)?.name} has been assigned to service request ${selectedRequest}`,
      "success",
    )

    // Reset selection
    setSelectedRequest(null)
    setAssignedTechnician(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hub Lead Dashboard</h1>
            <p className="text-gray-600">Manage service requests and technician assignments</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <Link href="/analytics">
              <Button variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </Link>
            <Link href="/technician-management">
              <Button className="bg-orange-500 hover:bg-orange-600">Manage Technicians</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {serviceRequests.filter((req) => req.status === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground">
                {serviceRequests.filter((req) => req.urgency === "high" || req.urgency === "critical").length} high
                priority
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Assigned Requests</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {serviceRequests.filter((req) => req.status === "assigned").length}
              </div>
              <p className="text-xs text-muted-foreground">
                {serviceRequests.filter((req) => req.status === "assigned" && req.urgency === "high").length} high
                priority
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Available Technicians</CardTitle>
              <User className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {technicians.filter((tech) => tech.availability === "Available").length}
              </div>
              <p className="text-xs text-muted-foreground">
                {technicians.filter((tech) => tech.availability === "Busy").length} currently busy
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Service Requests</CardTitle>
                <CardDescription>Manage and assign service requests to technicians</CardDescription>
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by tractor, owner, or ID"
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Requests</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="assigned">Assigned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRequests.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No service requests match your filters</p>
                    </div>
                  ) : (
                    filteredRequests.map((request) => (
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
                          {request.urgency === "critical" ? (
                            <AlertTriangle className="h-8 w-8 text-red-500" />
                          ) : request.urgency === "high" ? (
                            <AlertTriangle className="h-8 w-8 text-amber-500" />
                          ) : (
                            <Clock className="h-8 w-8 text-orange-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <h4 className="font-medium">{request.tractor}</h4>
                            <Badge
                              className={
                                request.status === "pending"
                                  ? request.urgency === "critical"
                                    ? "bg-red-500"
                                    : request.urgency === "high"
                                      ? "bg-amber-500"
                                      : "bg-blue-500"
                                  : "bg-green-500"
                              }
                            >
                              {request.status === "pending"
                                ? `${request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)} Priority`
                                : "Assigned"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Request ID: {request.id} | Owner: {request.owner}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                          <div className="flex flex-wrap items-center mt-2 text-xs text-gray-500 gap-x-4 gap-y-1">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{request.date}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{request.location}</span>
                            </div>
                            {request.assignedTo && (
                              <div className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                <span>Assigned to: {request.assignedTo}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            {selectedRequest ? (
              <Card>
                <CardHeader>
                  <CardTitle>Assign Technician</CardTitle>
                  <CardDescription>Select a technician for this service request</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">
                      {getSelectedRequest()?.tractor} - {getSelectedRequest()?.type}
                    </h3>
                    <p className="text-sm text-gray-600">{getSelectedRequest()?.description}</p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{getSelectedRequest()?.location}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="technician">Select Technician</Label>
                    <Select value={assignedTechnician || ""} onValueChange={setAssignedTechnician}>
                      <SelectTrigger id="technician">
                        <SelectValue placeholder="Choose a technician" />
                      </SelectTrigger>
                      <SelectContent>
                        {technicians
                          .filter((tech) => tech.availability === "Available")
                          .map((tech) => (
                            <SelectItem key={tech.id} value={tech.id}>
                              {tech.name} - {tech.specialization}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {assignedTechnician && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Technician" />
                          <AvatarFallback className="bg-orange-100 text-orange-800">
                            {technicians
                              .find((tech) => tech.id === assignedTechnician)
                              ?.name.split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {technicians.find((tech) => tech.id === assignedTechnician)?.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {technicians.find((tech) => tech.id === assignedTechnician)?.specialization}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Rating</p>
                          <p className="font-medium">
                            {technicians.find((tech) => tech.id === assignedTechnician)?.rating}/5
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Current Load</p>
                          <p className="font-medium">
                            {technicians.find((tech) => tech.id === assignedTechnician)?.currentLoad} jobs
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Location</p>
                          <p className="font-medium">
                            {technicians.find((tech) => tech.id === assignedTechnician)?.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 flex gap-2">
                    <Button
                      className="flex-1 bg-orange-500 hover:bg-orange-600"
                      onClick={handleAssignTechnician}
                      disabled={!assignedTechnician}
                    >
                      Assign Technician
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => setSelectedRequest(null)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <User className="h-12 w-12 text-orange-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a service request to assign a technician</p>
                </CardContent>
              </Card>
            )}

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Technician Status</CardTitle>
                <CardDescription>Current availability of technicians</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {technicians.map((tech) => (
                    <div key={tech.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt={tech.name} />
                          <AvatarFallback className="bg-orange-100 text-orange-800">
                            {tech.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{tech.name}</p>
                          <p className="text-xs text-gray-500">{tech.location}</p>
                        </div>
                      </div>
                      <Badge className={tech.availability === "Available" ? "bg-green-500" : "bg-amber-500"}>
                        {tech.availability}
                      </Badge>
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
