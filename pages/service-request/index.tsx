/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, CheckCircle, Plus } from "lucide-react"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard-header"
import axios from "axios"

// Predefined maintenance tasks and common problems
const COMMON_TRACTOR_PROBLEMS = [
  "Clutch Plate Damage",
  "Brake Disc Damage",
  "Hydraulic System Issues",
  "Overheating Engine",
  "Battery Failure",
  "Transmission Problems",
  "Steering Problems",
  "Electrical Failures",
  "Fuel System Blockages",
  "Tyre Punctures or Wear",
]

export default function ServiceRequestPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    tractorId: "",
    technicianId: "",
    priority: "medium",
    maintenanceTask: "",
    commonProblem: "",
    additionalNotes: "",
    partsNeeded: false,
  })

  const [tractorOwners, setTractorOwners] = useState<any[]>([])
  const [technicians, setTechnicians] = useState<any[]>([])
  const [serviceHistories, setServiceHistories] = useState<any[]>([])
  const [upcomingServices, setUpcomingServices] = useState<any[]>([])

  // Temporary states for new entries
  const [newServiceHistory, setNewServiceHistory] = useState<any>({
    date: "",
    description: "",
  })
  const [newUpcomingService, setNewUpcomingService] = useState<any>({
    date: "",
    description: "",
  })

  const [allocatedHours, setAllocatedHours] = useState(0)

  const [customServiceDescription, setCustomServiceDescription] = useState("")
  const [customUpcomingDescription, setCustomUpcomingDescription] = useState("")
  const [showCustomServiceInput, setShowCustomServiceInput] = useState(false)
  const [showCustomUpcomingInput, setShowCustomUpcomingInput] = useState(false)

  const [customCommonProblem, setCustomCommonProblem] = useState("")
  const [showCustomProblemInput, setShowCustomProblemInput] = useState(false)

  // Handler for updating allocated hours
  const handleAllocateHours = (newHours: number) => {
    if (newHours >= 0 && newHours <= 150) {
      setAllocatedHours(newHours)
    }
  }

  // Handlers for adding new items
  const handleAddServiceHistory = () => {
    setServiceHistories((prev) => [...prev, newServiceHistory])
    setNewServiceHistory({ date: "", description: "" })
    setShowCustomServiceInput(false)
    setCustomServiceDescription("")
  }

  const handleAddUpcomingService = () => {
    setUpcomingServices((prev) => [...prev, newUpcomingService])
    setNewUpcomingService({ date: "", description: "" })
    setShowCustomUpcomingInput(false)
    setCustomUpcomingDescription("")
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tractor owners
        console.log("Fetching tractor owners...")
        const tractorResponse = await axios.get("/api/tractor-owners")
        console.log("Tractor owners response:", tractorResponse.data)
        setTractorOwners(tractorResponse.data.data || [])

        // Fetch technicians
        console.log("Fetching technicians...")
        const technicianResponse = await axios.get("/api/technicians")
        console.log("Technicians response:", technicianResponse.data)
        setTechnicians(technicianResponse.data.data || [])

        // If a specific tractor is selected, fetch its details
        if (formData.tractorId) {
          console.log("Fetching tractor details for ID:", formData.tractorId)
          const tractorDetailResponse = await axios.get(`/api/tractor-owners?id=${formData.tractorId}`)
          const tractorInfo = tractorDetailResponse.data.data?.tractorInfo || {}
          const {
            hours = 0,
            serviceHistory = [],
            upcomingServices = [],
            additionalNotes = "",
            partsNeeded = false,
          } = tractorInfo

          setAllocatedHours(hours)
          setServiceHistories(serviceHistory)
          setUpcomingServices(upcomingServices)
          setFormData((prev) => ({
            ...prev,
            additionalNotes,
            partsNeeded,
          }))
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        if (axios.isAxiosError(error)) {
          console.error("Error response:", error.response?.data)
          console.error("Error status:", error.response?.status)
        }
        // Set empty arrays to prevent UI errors
        setTractorOwners([])
        setTechnicians([])
      }
    }

    fetchData()
  }, [formData.tractorId])

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.tractorId) {
      alert("Please select a tractor ID.")
      return
    }

    if (!formData.technicianId) {
      alert("Please select a technician.")
      return
    }

    try {
      // Prepare the payload according to ServiceRequest schema
      const payload = {
        priority: formData.priority,
        technicianId: formData.technicianId,
        tractor: formData.tractorId,
        maintenanceTask: formData.maintenanceTask,
        commonProblem: formData.commonProblem,
        notes: formData.additionalNotes,
        status: "pending",
        parts: [],
        allocatedHours,
        serviceHistory: serviceHistories,
        upcomingServices,
        partsNeeded: formData.partsNeeded,
      }

      console.log("Submitting payload:", payload)
      const response = await axios.post("/api/service-requests", payload)

      console.log("Service request created:", response.data)
      setSubmitted(true)
    } catch (error) {
      console.error("Error submitting service request:", error)
      alert("Error submitting service request. Please try again.")
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-green-100 rounded-full p-4 inline-block mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Request Submitted</h1>
            <p className="text-gray-600 mb-8">
              Your service request has been successfully submitted. A technician will be assigned to your request
              shortly.
            </p>
            <div className="space-y-4">
              <Link href="/dashboard">
                <Button className="w-full">Return to Dashboard</Button>
              </Link>
              <Link href="/service-requests">
                <Button variant="outline" className="w-full bg-transparent">
                  View All Service Requests
                </Button>
              </Link>
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
        <div className="flex items-center mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Service Request</h1>
            <p className="text-gray-600">Request maintenance for your tractor</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Service Request Form</CardTitle>
                <CardDescription>Fill in the details to request a service</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Priority Selection */}
                <div className="space-y-2 w-full">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleChange("priority", value)} required>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Technician Selection */}
                <div className="space-y-2 w-full">
                  <Label htmlFor="technician-id">Technician</Label>
                  <Select
                    value={formData.technicianId}
                    onValueChange={(value) => handleChange("technicianId", value)}
                    required
                  >
                    <SelectTrigger id="technician-id">
                      <SelectValue placeholder="Select technician" />
                    </SelectTrigger>
                    <SelectContent>
                      {technicians.map((technician) => (
                        <SelectItem key={technician._id} value={technician._id}>
                          {technician.firstName} {technician.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tractor Selection */}
                <div className="space-y-2 w-full">
                  <Label htmlFor="tractor-id">Tractor</Label>
                  <Select
                    value={formData.tractorId}
                    onValueChange={(value) => handleChange("tractorId", value)}
                    required
                  >
                    <SelectTrigger id="tractor-id">
                      <SelectValue placeholder="Select tractor" />
                    </SelectTrigger>
                    <SelectContent>
                      {tractorOwners.map((owner) => (
                        <SelectItem key={owner._id} value={owner._id}>
                          {owner.name} - {owner.tractorId}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Maintenance Task */}
                <div className="space-y-2 w-full">
                  <Label htmlFor="maintenance-task">Maintenance Task</Label>
                  <Textarea
                    id="maintenance-task"
                    value={formData.maintenanceTask}
                    onChange={(e) => handleChange("maintenanceTask", e.target.value)}
                    placeholder="Describe the maintenance task required"
                  />
                </div>

                {/* Common Problem - Enhanced with predefined options and Other option */}
                <div className="space-y-2 w-full">
                  <Label htmlFor="common-problem">Common Tractor Problem</Label>
                  <Select
                    value={formData.commonProblem}
                    onValueChange={(value) => {
                      if (value === "other") {
                        setShowCustomProblemInput(true)
                        handleChange("commonProblem", "")
                      } else {
                        setShowCustomProblemInput(false)
                        handleChange("commonProblem", value)
                      }
                    }}
                  >
                    <SelectTrigger id="common-problem">
                      <SelectValue placeholder="Select common problem" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMON_TRACTOR_PROBLEMS.map((problem) => (
                        <SelectItem key={problem} value={problem}>
                          {problem}
                        </SelectItem>
                      ))}
                      <SelectItem value="other">Other (Specify)</SelectItem>
                    </SelectContent>
                  </Select>
                  {showCustomProblemInput && (
                    <input
                      className="border p-2 rounded w-full mt-2"
                      value={customCommonProblem}
                      onChange={(e) => {
                        setCustomCommonProblem(e.target.value)
                        handleChange("commonProblem", e.target.value)
                      }}
                      placeholder="Enter custom problem description"
                    />
                  )}
                </div>

                {/* Service History Section */}
                <div className="space-y-4">
                  <Label>Add Service History</Label>
                  <div className="md:flex grid justify-between place-items-center gap-4">
                    <div className="space-y-2 w-full">
                      <Label htmlFor="service-history-date">Date</Label>
                      <input
                        id="service-history-date"
                        type="date"
                        className="border p-2 rounded w-full"
                        value={newServiceHistory.date}
                        onChange={(e) =>
                          setNewServiceHistory((prev: any) => ({
                            ...prev,
                            date: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2 w-full">
                      <Label htmlFor="service-history-description">Description</Label>
                      <Select
                        value={newServiceHistory.description}
                        onValueChange={(value) => {
                          if (value === "other") {
                            setShowCustomServiceInput(true)
                            setNewServiceHistory((prev: any) => ({
                              ...prev,
                              description: "",
                            }))
                          } else {
                            setShowCustomServiceInput(false)
                            setNewServiceHistory((prev: any) => ({
                              ...prev,
                              description: value,
                            }))
                          }
                        }}
                      >
                        <SelectTrigger id="service-history-description">
                          <SelectValue placeholder="Select service description" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "Cleaning the Air Filter",
                            "Changing Engine Oil",
                            "Replacing the Hydraulic Filter",
                            "Replacing the Engine Oil Filter",
                            "Replacing the Fuel Filter",
                            "Greasing Moving Parts",
                            "Checking and Topping Up Coolant",
                            "Inspecting and Inflating Tires",
                            "Battery Maintenance",
                            "Checking Belts and Hoses",
                          ].map((task) => (
                            <SelectItem key={task} value={task}>
                              {task}
                            </SelectItem>
                          ))}
                          <SelectItem value="other">Other (Specify)</SelectItem>
                        </SelectContent>
                      </Select>
                      {showCustomServiceInput && (
                        <input
                          className="border p-2 rounded w-full mt-2"
                          value={customServiceDescription}
                          onChange={(e) => {
                            setCustomServiceDescription(e.target.value)
                            setNewServiceHistory((prev: any) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }}
                          placeholder="Enter custom service description"
                        />
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddServiceHistory}
                      className="flex items-center bg-transparent"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {serviceHistories.map((history, index) => (
                      <li key={index} className="p-2 bg-gray-100 rounded">
                        <strong>{history.date}:</strong> {history.description}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Upcoming Services Section */}
                <div className="space-y-4">
                  <Label>Add Upcoming Service</Label>
                  <div className="md:flex grid justify-between place-items-center gap-4">
                    <div className="space-y-2 w-full">
                      <Label htmlFor="upcoming-service-date">Date</Label>
                      <input
                        id="upcoming-service-date"
                        type="date"
                        className="border p-2 rounded w-full"
                        value={newUpcomingService.date}
                        onChange={(e) =>
                          setNewUpcomingService((prev: any) => ({
                            ...prev,
                            date: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2 w-full">
                      <Label htmlFor="upcoming-service-description">Description</Label>
                      <Select
                        value={newUpcomingService.description}
                        onValueChange={(value) => {
                          if (value === "other") {
                            setShowCustomUpcomingInput(true)
                            setNewUpcomingService((prev: any) => ({
                              ...prev,
                              description: "",
                            }))
                          } else {
                            setShowCustomUpcomingInput(false)
                            setNewUpcomingService((prev: any) => ({
                              ...prev,
                              description: value,
                            }))
                          }
                        }}
                      >
                        <SelectTrigger id="upcoming-service-description">
                          <SelectValue placeholder="Select service description" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "Cleaning the Air Filter",
                            "Changing Engine Oil",
                            "Replacing the Hydraulic Filter",
                            "Replacing the Engine Oil Filter",
                            "Replacing the Fuel Filter",
                            "Greasing Moving Parts",
                            "Checking and Topping Up Coolant",
                            "Inspecting and Inflating Tires",
                            "Battery Maintenance",
                            "Checking Belts and Hoses",
                          ].map((task) => (
                            <SelectItem key={task} value={task}>
                              {task}
                            </SelectItem>
                          ))}
                          <SelectItem value="other">Other (Specify)</SelectItem>
                        </SelectContent>
                      </Select>
                      {showCustomUpcomingInput && (
                        <input
                          className="border p-2 rounded w-full mt-2"
                          value={customUpcomingDescription}
                          onChange={(e) => {
                            setCustomUpcomingDescription(e.target.value)
                            setNewUpcomingService((prev: any) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }}
                          placeholder="Enter custom service description"
                        />
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddUpcomingService}
                      className="flex items-center bg-transparent"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {upcomingServices.map((service, index) => (
                      <li key={index} className="p-2 bg-gray-100 rounded">
                        <strong>{service.date}:</strong> {service.description}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Parts Needed Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="parts"
                    checked={formData.partsNeeded}
                    onCheckedChange={(checked) => handleChange("partsNeeded", checked as boolean)}
                  />
                  <Label htmlFor="parts">Replacement parts may be needed</Label>
                </div>

                {/* Additional Notes */}
                <div className="space-y-2 w-full">
                  <Label htmlFor="additional-notes">Additional Notes</Label>
                  <Textarea
                    id="additional-notes"
                    value={formData.additionalNotes}
                    onChange={(e) => handleChange("additionalNotes", e.target.value)}
                    placeholder="Any additional information that might be helpful"
                  />
                </div>

                {/* Allocated Hours */}
                <div className="space-y-4">
                  <Label htmlFor="allocated-hours">Allocated Hours</Label>
                  <div className="flex items-center gap-4">
                    <input
                      id="allocated-hours"
                      type="number"
                      className="border p-2 rounded w-full"
                      min="0"
                      max="150"
                      value={allocatedHours}
                      onChange={(e) => {
                        const newHours = Number.parseInt(e.target.value, 10) || 0
                        if (newHours <= 150) {
                          handleAllocateHours(newHours)
                        } else {
                          alert("Allocated hours cannot exceed 150.")
                        }
                      }}
                      placeholder="Enter allocated hours"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (allocatedHours < 150) {
                          handleAllocateHours(allocatedHours + 1)
                        } else {
                          alert("Allocated hours cannot exceed 150.")
                        }
                      }}
                      disabled={allocatedHours >= 150}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Hour
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (allocatedHours > 0) {
                          handleAllocateHours(allocatedHours - 1)
                        }
                      }}
                      disabled={allocatedHours <= 0}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Subtract Hour
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Current allocated hours: <strong>{allocatedHours}</strong>
                    /150
                  </p>
                </div>
              </CardContent>

              <CardFooter>
                <Button type="submit" className="w-full bg-orange-500 my-4 hover:bg-orange-600">
                  Submit Service Request
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}