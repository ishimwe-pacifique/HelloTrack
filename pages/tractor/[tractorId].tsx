/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Clock,
  PenToolIcon as Tool,
  Calendar,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  BarChart3,
  Phone,
  Mail,
  MapPin,
  FileText,
} from "lucide-react"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard-header"
import axios from "axios"
import QRCode from "react-qr-code"

interface TractorOwner {
  _id?: string
  name: string
  phoneNumber: string
  email: string
  physicalAddress: string
  location: string
  assignedTractor: string
  newRegistrationNumber: string
  tractorId: string
  welcomeEmailStatus: string
  qrCodeValue?: string
  createdAt?: string
  updatedAt?: string
}

interface ServiceRecord {
  id: string
  date: string
  technician: string
  notes: string
  type: string
  status: "completed" | "pending" | "scheduled"
}

export default function TractorDetailsPage() {
  const router = useRouter()
  const { tractorId } = router.query

  const [tractorOwner, setTractorOwner] = useState<TractorOwner | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [serviceHistory, setServiceHistory] = useState<ServiceRecord[]>([])

  // Fetch tractor owner details
  useEffect(() => {
    const fetchTractorDetails = async () => {
      if (!tractorId || !router.isReady) return

      try {
        setLoading(true)
        console.log("Fetching tractor with ID:", tractorId) // Debug log

        const response = await axios.get(`/api/tractor-owners`, {
          params: { tractorId },
        })

        console.log("API Response:", response.data) // Debug log

        if (response.data.success && response.data.data) {
          // Since the API returns a single object when tractorId is provided, not an array
          const owner = response.data.data
          console.log("Found owner:", owner) // Debug log

          setTractorOwner(owner)
          // Generate mock service history for demonstration
          generateMockServiceHistory(owner.tractorId)
        } else {
          console.log("No data found in response") // Debug log
          setError("Tractor not found")
        }
      } catch (error: any) {
        console.error("Error fetching tractor details:", error)
        if (error.response?.status === 404) {
          setError("Tractor not found")
        } else {
          setError("Failed to fetch tractor details")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTractorDetails()
  }, [tractorId, router.isReady])

  const generateMockServiceHistory = (tractorId: string) => {
    const mockHistory: ServiceRecord[] = [
      {
        id: `${tractorId}-001`,
        date: "2024-01-15",
        technician: "Mike Johnson",
        notes: "Regular maintenance - oil change, filter replacement, general inspection",
        type: "Routine Maintenance",
        status: "completed",
      },
      {
        id: `${tractorId}-002`,
        date: "2023-12-10",
        technician: "Sarah Williams",
        notes: "Engine diagnostic and repair - replaced spark plugs and air filter",
        type: "Engine Service",
        status: "completed",
      },
      {
        id: `${tractorId}-003`,
        date: "2023-11-05",
        technician: "David Brown",
        notes: "Hydraulic system maintenance and fluid replacement",
        type: "Hydraulic Service",
        status: "completed",
      },
    ]
    setServiceHistory(mockHistory)
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "sent":
        return { color: "bg-green-500", text: "Active", hours: 25, maxHours: 150 }
      case "warning":
        return { color: "bg-amber-500", text: "Service Soon", hours: 45, maxHours: 150 }
      default:
        return { color: "bg-red-500", text: "Service Required", hours: 58, maxHours: 150 }
    }
  }

  const calculateDaysFromDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading tractor details...</div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !tractorOwner) {
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
            <h1 className="text-3xl font-bold text-gray-900">Tractor Not Found</h1>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-gray-600">{error || "The requested tractor could not be found."}</p>
                <Link href="/dashboard">
                  <Button className="mt-4">Return to Dashboard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const statusInfo = getStatusInfo(tractorOwner.welcomeEmailStatus)
  const lastServiceDate = serviceHistory.length > 0 ? serviceHistory[0].date : "N/A"
  const daysSinceLastService = serviceHistory.length > 0 ? calculateDaysFromDate(serviceHistory[0].date) : 0

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
            <h1 className="text-3xl font-bold text-gray-900">{tractorOwner.name}</h1>
            <p className="text-gray-600">Tractor ID: {tractorOwner.tractorId}</p>
          </div>
        </div>

        {/* Status Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Badge className={statusInfo.color}>{statusInfo.text}</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Hours since last service</span>
                    <span className="font-medium">
                      {statusInfo.hours}/{statusInfo.maxHours}
                    </span>
                  </div>
                  <Progress value={(statusInfo.hours / statusInfo.maxHours) * 100} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Last Service</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lastServiceDate}</div>
              <p className="text-xs text-muted-foreground">
                {daysSinceLastService > 0 ? `${daysSinceLastService} days ago` : "No service record"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Registration</CardTitle>
              <FileText className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tractorOwner.newRegistrationNumber}</div>
              <p className="text-xs text-muted-foreground">Registration Number</p>
            </CardContent>
          </Card>
        </div>

        {/* Owner Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Phone className="h-4 w-4 mr-2 text-orange-500" />
                Phone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-medium">{tractorOwner.phoneNumber}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Mail className="h-4 w-4 mr-2 text-orange-500" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-medium text-sm">{tractorOwner.email}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-medium">{tractorOwner.location}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-medium">{serviceHistory.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* QR Code Section */}
        {tractorOwner.qrCodeValue && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>QR Code</CardTitle>
              <CardDescription>Scan to access tractor information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <QRCode value={tractorOwner.qrCodeValue} size={200} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end mb-8 gap-4">
          <Link href={`/service-request?tractor=${tractorOwner.tractorId}`}>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Tool className="mr-2 h-4 w-4" />
              Request Service
            </Button>
          </Link>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="details" className="mb-8">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="history">Service History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Tractor Details</CardTitle>
                <CardDescription>Complete information about this tractor and owner</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Owner Name</label>
                      <p className="text-lg font-medium">{tractorOwner.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone Number</label>
                      <p className="text-lg">{tractorOwner.phoneNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email Address</label>
                      <p className="text-lg">{tractorOwner.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Physical Address</label>
                      <p className="text-lg">{tractorOwner.physicalAddress}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Tractor ID</label>
                      <p className="text-lg font-medium">{tractorOwner.tractorId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Registration Number</label>
                      <p className="text-lg">{tractorOwner.newRegistrationNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Assigned Tractor</label>
                      <p className="text-lg">{tractorOwner.assignedTractor}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Location</label>
                      <p className="text-lg">{tractorOwner.location}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Service History</CardTitle>
                <CardDescription>Past maintenance records for this tractor</CardDescription>
              </CardHeader>
              <CardContent>
                {serviceHistory.length > 0 ? (
                  <div className="space-y-4">
                    {serviceHistory.map((service) => (
                      <div key={service.id} className="flex items-start p-4 border rounded-lg">
                        <div className="mr-4">
                          <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{service.type}</h4>
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{service.date}</span>
                            <span className="mx-2">•</span>
                            <Tool className="h-3 w-3 mr-1" />
                            <span>{service.technician}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">{service.notes}</p>
                        </div>
                        <Badge className="bg-green-500">Completed</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 text-orange-300 mx-auto mb-4" />
                    <p className="text-gray-500">No service history available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Tractor Analytics</CardTitle>
                <CardDescription>Performance and maintenance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Service Efficiency</h3>
                      <div className="flex items-center justify-center">
                        <div className="relative h-32 w-32">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold">
                              {tractorOwner.welcomeEmailStatus === "sent"
                                ? "95%"
                                : tractorOwner.welcomeEmailStatus === "warning"
                                  ? "75%"
                                  : "45%"}
                            </span>
                          </div>
                          <BarChart3 className="h-full w-full text-orange-400" />
                        </div>
                      </div>
                      <p className="text-sm text-center text-gray-500 mt-2">Overall efficiency score</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Service Status</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Completed Services</span>
                            <span>{serviceHistory.length}</span>
                          </div>
                          <Progress value={serviceHistory.length * 20} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Service Hours</span>
                            <span>{statusInfo.hours}h</span>
                          </div>
                          <Progress value={(statusInfo.hours / statusInfo.maxHours) * 100} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Maintenance Score</span>
                            <span>
                              {tractorOwner.welcomeEmailStatus === "sent"
                                ? "Excellent"
                                : tractorOwner.welcomeEmailStatus === "warning"
                                  ? "Good"
                                  : "Needs Attention"}
                            </span>
                          </div>
                          <Progress
                            value={
                              tractorOwner.welcomeEmailStatus === "sent"
                                ? 95
                                : tractorOwner.welcomeEmailStatus === "warning"
                                  ? 75
                                  : 45
                            }
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}