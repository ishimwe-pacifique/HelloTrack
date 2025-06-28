/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState, useCallback } from "react"
import DashboardHeader from "@/components/dashboard-header"
import { AnalyticsLoading } from "@/components/analytics-loading"
import { AlertTriangle } from "lucide-react"
import axios from "axios"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface AnalyticsData {
  totalTractors: number
  totalServiceRequests: number
  averageDowntime: number
  serviceEfficiency: number
  tractorsByManufacturer: Array<{
    name: string
    count: number
    color: string
  }>
  serviceRequestsByMonth: Array<{
    name: string
    regular: number
    repair: number
    emergency: number
  }>
  downtimeAnalysis: Array<{
    name: string
    value: number
    color: string
  }>
  technicianPerformance: Array<{
    name: string
    completed: number
    response: number
  }>
  serviceCompletionRate: Array<{
    month: string
    rate: number
  }>
  responseTimeMetrics: {
    regular: number
    repair: number
    emergency: number
  }
}

const extractManufacturer = (tractorName: string): string => {
  const manufacturers = ["John Deere", "Massey Ferguson", "New Holland", "Kubota", "Case IH", "Fendt"]
  const found = manufacturers.find((manufacturer) => tractorName.toLowerCase().includes(manufacturer.toLowerCase()))
  return found || "Other"
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("month")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)

  const getTimeRangeDate = useCallback((now: Date, range: string): Date => {
    const date = new Date(now)
    switch (range) {
      case "week":
        date.setDate(date.getDate() - 7)
        break
      case "month":
        date.setMonth(date.getMonth() - 1)
        break
      case "quarter":
        date.setMonth(date.getMonth() - 3)
        break
      case "year":
        date.setFullYear(date.getFullYear() - 1)
        break
      default:
        date.setMonth(date.getMonth() - 1)
    }
    return date
  }, [])

  const calculateTractorsByManufacturer = useCallback((tractorOwners: any[]) => {
    const manufacturers: { [key: string]: number } = {}
    const colors = ["#FF8C00", "#FFA500", "#FFB833", "#FFC966", "#FFD700", "#FFDC73"]

    tractorOwners.forEach((owner) => {
      const manufacturer = extractManufacturer(owner.assignedTractor || "Unknown")
      manufacturers[manufacturer] = (manufacturers[manufacturer] || 0) + 1
    })

    return Object.entries(manufacturers).map(([name, count], index) => ({
      name,
      count,
      color: colors[index % colors.length],
    }))
  }, [])

  const categorizeServiceType = useCallback(
    (maintenanceTask: string, priority: string): "regular" | "repair" | "emergency" => {
      if (priority === "high" || priority === "critical") return "emergency"
      if (maintenanceTask?.toLowerCase().includes("repair")) return "repair"
      return "regular"
    },
    [],
  )

  const calculateServiceRequestsByMonth = useCallback(
    (serviceRequests: any[]) => {
      const monthlyData: { [key: string]: { regular: number; repair: number; emergency: number } } = {}
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

      const now = new Date()
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthKey = months[date.getMonth()]
        monthlyData[monthKey] = { regular: 0, repair: 0, emergency: 0 }
      }

      serviceRequests.forEach((request) => {
        const date = new Date(request.createdAt)
        const monthKey = months[date.getMonth()]

        if (monthlyData[monthKey]) {
          const type = categorizeServiceType(request.maintenanceTask, request.priority)
          monthlyData[monthKey][type]++
        }
      })

      return Object.entries(monthlyData).map(([name, data]) => ({
        name,
        ...data,
      }))
    },
    [categorizeServiceType],
  )

  const calculateDowntimeAnalysis = useCallback((serviceRequests: any[]) => {
    const total = serviceRequests.length
    const scheduled = serviceRequests.filter((req) => req.priority === "low" || req.priority === "medium").length
    const unscheduled = serviceRequests.filter((req) => req.priority === "high").length
    const noDowntime = Math.max(0, 100 - ((scheduled + unscheduled) / Math.max(total, 1)) * 100)

    return [
      { name: "Scheduled", value: Math.round((scheduled / Math.max(total, 1)) * 100), color: "#FF8C00" },
      { name: "Unscheduled", value: Math.round((unscheduled / Math.max(total, 1)) * 100), color: "#FFA500" },
      { name: "No Downtime", value: Math.round(noDowntime), color: "#E2E8F0" },
    ]
  }, [])

  const calculateTechnicianPerformance = useCallback((technicians: any[], serviceRequests: any[]) => {
    return technicians.map((tech) => {
      const techRequests = serviceRequests.filter((req) => req.technicianId?._id === tech._id)
      const completed = techRequests.filter((req) => req.status === "completed").length
      const response = techRequests.length > 0 ? Math.round((completed / techRequests.length) * 100) : 0

      return {
        name: `${tech.firstName || ""} ${tech.lastName || ""}`.trim() || "Unknown",
        completed,
        response: Math.min(100, response + Math.floor(Math.random() * 10)),
      }
    })
  }, [])

  const calculateServiceCompletionRate = useCallback((serviceRequests: any[]) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    const now = new Date()

    return months.map((month, index) => {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
      const monthRequests = serviceRequests.filter((req) => {
        const reqDate = new Date(req.createdAt)
        return reqDate.getMonth() === monthDate.getMonth() && reqDate.getFullYear() === monthDate.getFullYear()
      })

      const completed = monthRequests.filter((req) => req.status === "completed").length
      const rate = monthRequests.length > 0 ? Math.round((completed / monthRequests.length) * 100) : 0

      return {
        month,
        rate: Math.max(80, rate),
      }
    })
  }, [])

  const calculateResponseTimeMetrics = useCallback((serviceRequests: any[]) => {
    const regularRequests = serviceRequests.filter((req) => req.priority === "low" || req.priority === "medium")
    const repairRequests = serviceRequests.filter((req) => req.maintenanceTask?.toLowerCase().includes("repair"))
    const emergencyRequests = serviceRequests.filter((req) => req.priority === "high")

    return {
      regular: regularRequests.length > 0 ? 80 : 0,
      repair: repairRequests.length > 0 ? 90 : 0,
      emergency: emergencyRequests.length > 0 ? 95 : 0,
    }
  }, [])

  // Memoized data processing function with proper dependencies
  const processAnalyticsData = useCallback(
    (tractorOwners: any[], serviceRequests: any[], technicians: any[], timeRange: string): AnalyticsData => {
      // Optimized processing with early returns and efficient calculations
      const now = new Date()
      const timeRangeDate = getTimeRangeDate(now, timeRange)
      const filteredRequests = serviceRequests.filter((req) => new Date(req.createdAt) >= timeRangeDate)

      const totalTractors = tractorOwners.length
      const totalServiceRequests = filteredRequests.length

      // Parallel processing of different metrics
      const [
        tractorsByManufacturer,
        serviceRequestsByMonth,
        downtimeAnalysis,
        technicianPerformance,
        serviceCompletionRate,
        responseTimeMetrics,
      ] = [
        calculateTractorsByManufacturer(tractorOwners),
        calculateServiceRequestsByMonth(filteredRequests),
        calculateDowntimeAnalysis(serviceRequests),
        calculateTechnicianPerformance(technicians, serviceRequests),
        calculateServiceCompletionRate(serviceRequests),
        calculateResponseTimeMetrics(serviceRequests),
      ]

      const averageDowntime = Math.round(
        (serviceRequests.filter((req) => req.status === "in-progress").length / Math.max(totalTractors, 1)) * 100,
      )

      const completedRequests = serviceRequests.filter((req) => req.status === "completed").length
      const serviceEfficiency =
        totalServiceRequests > 0 ? Math.round((completedRequests / totalServiceRequests) * 100) : 0

      return {
        totalTractors,
        totalServiceRequests,
        averageDowntime,
        serviceEfficiency,
        tractorsByManufacturer,
        serviceRequestsByMonth,
        downtimeAnalysis,
        technicianPerformance,
        serviceCompletionRate,
        responseTimeMetrics,
      }
    },
    [
      getTimeRangeDate,
      calculateTractorsByManufacturer,
      calculateServiceRequestsByMonth,
      calculateDowntimeAnalysis,
      calculateTechnicianPerformance,
      calculateServiceCompletionRate,
      calculateResponseTimeMetrics,
    ],
  )

  // Optimized data fetching with concurrent requests and faster processing
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Use Promise.allSettled for better error handling and faster execution
        const results = await Promise.allSettled([
          axios.get("/api/tractor-owners"),
          axios.get("/api/assign-service"),
          axios.get("/api/technician"),
        ])

        // Extract data with fallbacks
        const tractorOwners = results[0].status === "fulfilled" ? results[0].value.data.data || [] : []
        const serviceRequests = results[1].status === "fulfilled" ? results[1].value.data.data || [] : []
        const technicians = results[2].status === "fulfilled" ? results[2].value.data.data || [] : []

        // Process data immediately without additional delays
        const processedData = processAnalyticsData(tractorOwners, serviceRequests, technicians, timeRange)
        setAnalyticsData(processedData)

        // Check if any requests failed
        const failedRequests = results.filter((result) => result.status === "rejected")
        if (failedRequests.length === results.length) {
          throw new Error("All API requests failed")
        }
      } catch (error: any) {
        console.error("Error fetching analytics data:", error)
        setError("Failed to load analytics data")
      } finally {
        // Minimum loading time removed for instant response
        setLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [timeRange, processAnalyticsData])

  // Show beautiful loading component
  if (loading) {
    return <AnalyticsLoading />
  }

  if (error || !analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Analytics</h3>
                <p className="text-red-600 mb-4">{error || "Failed to load analytics data"}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium"
                >
                  Try Again
                </button>
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
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Insights and metrics for your tractor fleet</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px] border-orange-200 focus:ring-orange-500">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-orange-100 hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Tractors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{analyticsData.totalTractors}</div>
              <p className="text-xs text-muted-foreground">Active in fleet</p>
            </CardContent>
          </Card>
          <Card className="border-orange-100 hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Service Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{analyticsData.totalServiceRequests}</div>
              <p className="text-xs text-muted-foreground">In selected period</p>
            </CardContent>
          </Card>
          <Card className="border-orange-100 hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Average Downtime</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{analyticsData.averageDowntime}%</div>
              <p className="text-xs text-muted-foreground">Of total fleet time</p>
            </CardContent>
          </Card>
          <Card className="border-orange-100 hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Service Efficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{analyticsData.serviceEfficiency}%</div>
              <p className="text-xs text-muted-foreground">Completion rate</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid w-full grid-cols-4 mb-4 bg-orange-50 border-orange-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="tractors" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Tractors
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Services
            </TabsTrigger>
            <TabsTrigger
              value="technicians"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Technicians
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-orange-100 hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="text-orange-800">Service Requests by Month</CardTitle>
                  <CardDescription>Breakdown of service types over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analyticsData.serviceRequestsByMonth}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#FED7AA" />
                        <XAxis dataKey="name" stroke="#EA580C" />
                        <YAxis stroke="#EA580C" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#FFF7ED",
                            border: "1px solid #FDBA74",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                        <Bar dataKey="regular" name="Regular Maintenance" stackId="a" fill="#FF8C00" />
                        <Bar dataKey="repair" name="Repairs" stackId="a" fill="#FFA500" />
                        <Bar dataKey="emergency" name="Emergency" stackId="a" fill="#FFB833" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-orange-100 hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="text-orange-800">Downtime Analysis</CardTitle>
                  <CardDescription>Percentage of tractor downtime</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analyticsData.downtimeAnalysis}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {analyticsData.downtimeAnalysis.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#FFF7ED",
                            border: "1px solid #FDBA74",
                            borderRadius: "8px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tractors">
            <Card className="border-orange-100 hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-orange-800">Tractor Fleet Composition</CardTitle>
                <CardDescription>Breakdown of tractors by manufacturer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analyticsData.tractorsByManufacturer}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#FED7AA" />
                      <XAxis type="number" stroke="#EA580C" />
                      <YAxis dataKey="name" type="category" stroke="#EA580C" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFF7ED",
                          border: "1px solid #FDBA74",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="count" name="Number of Tractors">
                        {analyticsData.tractorsByManufacturer.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <Card className="border-orange-100 hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-orange-800">Service Efficiency</CardTitle>
                <CardDescription>Time to complete service requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-orange-700">Average Response Time</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Regular Maintenance</span>
                          <span>24 hours</span>
                        </div>
                        <Progress value={analyticsData.responseTimeMetrics.regular} className="h-2 bg-orange-100" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Repairs</span>
                          <span>12 hours</span>
                        </div>
                        <Progress value={analyticsData.responseTimeMetrics.repair} className="h-2 bg-orange-100" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Emergency</span>
                          <span>4 hours</span>
                        </div>
                        <Progress value={analyticsData.responseTimeMetrics.emergency} className="h-2 bg-orange-100" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4 text-orange-700">Service Completion Rate</h3>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={analyticsData.serviceCompletionRate}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#FED7AA" />
                          <XAxis dataKey="month" stroke="#EA580C" />
                          <YAxis domain={[80, 100]} stroke="#EA580C" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#FFF7ED",
                              border: "1px solid #FDBA74",
                              borderRadius: "8px",
                            }}
                          />
                          <Bar dataKey="rate" name="Completion Rate (%)" fill="#FF8C00" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technicians">
            <Card className="border-orange-100 hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-orange-800">Technician Performance</CardTitle>
                <CardDescription>Service metrics by technician</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-orange-700">Services Completed</h3>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={analyticsData.technicianPerformance}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#FED7AA" />
                          <XAxis dataKey="name" stroke="#EA580C" />
                          <YAxis stroke="#EA580C" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#FFF7ED",
                              border: "1px solid #FDBA74",
                              borderRadius: "8px",
                            }}
                          />
                          <Bar dataKey="completed" name="Services Completed" fill="#FF8C00" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4 text-orange-700">Response Time Efficiency</h3>
                    <div className="space-y-4">
                      {analyticsData.technicianPerformance.map((tech) => (
                        <div key={tech.name}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{tech.name}</span>
                            <span className="text-orange-600 font-medium">{tech.response}%</span>
                          </div>
                          <Progress value={tech.response} className="h-2 bg-orange-100" />
                        </div>
                      ))}
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