"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import DashboardHeader from "@/components/dashboard-header"
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

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("month")

  const tractorData = [
    { name: "John Deere", count: 5, color: "#FF8C00" },
    { name: "Massey Ferguson", count: 3, color: "#FFA500" },
    { name: "New Holland", count: 2, color: "#FFB833" },
    { name: "Kubota", count: 2, color: "#FFC966" },
  ]

  const serviceData = [
    { name: "Jan", regular: 5, repair: 2, emergency: 1 },
    { name: "Feb", regular: 4, repair: 3, emergency: 0 },
    { name: "Mar", regular: 6, repair: 1, emergency: 1 },
    { name: "Apr", regular: 3, repair: 4, emergency: 2 },
    { name: "May", regular: 7, repair: 2, emergency: 0 },
    { name: "Jun", regular: 5, repair: 3, emergency: 1 },
  ]

  const downtimeData = [
    { name: "Scheduled", value: 3, color: "#FF8C00" },
    { name: "Unscheduled", value: 5, color: "#FFA500" },
    { name: "No Downtime", value: 92, color: "#E2E8F0" },
  ]

  const technicianData = [
    { name: "Mike Johnson", completed: 12, response: 95 },
    { name: "Sarah Williams", completed: 10, response: 92 },
    { name: "David Brown", completed: 8, response: 88 },
    { name: "Lisa Chen", completed: 14, response: 97 },
  ]

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
              <SelectTrigger className="w-[180px]">
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
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Tractors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Service Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+5 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Downtime</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8%</div>
              <p className="text-xs text-muted-foreground">-2% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Service Efficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">93%</div>
              <p className="text-xs text-muted-foreground">+3% from last month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tractors">Tractors</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="technicians">Technicians</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Service Requests by Month</CardTitle>
                  <CardDescription>Breakdown of service types over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={serviceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="regular" name="Regular Maintenance" stackId="a" fill="#FF8C00" />
                        <Bar dataKey="repair" name="Repairs" stackId="a" fill="#FFA500" />
                        <Bar dataKey="emergency" name="Emergency" stackId="a" fill="#FFB833" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Downtime Analysis</CardTitle>
                  <CardDescription>Percentage of tractor downtime</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={downtimeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {downtimeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="tractors">
            <Card>
              <CardHeader>
                <CardTitle>Tractor Fleet Composition</CardTitle>
                <CardDescription>Breakdown of tractors by manufacturer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tractorData} layout="vertical" margin={{ top: 20, right: 30, left: 60, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Number of Tractors">
                        {tractorData.map((entry, index) => (
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
            <Card>
              <CardHeader>
                <CardTitle>Service Efficiency</CardTitle>
                <CardDescription>Time to complete service requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Average Response Time</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Regular Maintenance</span>
                          <span>24 hours</span>
                        </div>
                        <Progress value={80} className="h-2 bg-gray-100" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Repairs</span>
                          <span>12 hours</span>
                        </div>
                        <Progress value={90} className="h-2 bg-gray-100" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Emergency</span>
                          <span>4 hours</span>
                        </div>
                        <Progress value={95} className="h-2 bg-gray-100" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Service Completion Rate</h3>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { month: "Jan", rate: 92 },
                            { month: "Feb", rate: 88 },
                            { month: "Mar", rate: 94 },
                            { month: "Apr", rate: 91 },
                            { month: "May", rate: 95 },
                            { month: "Jun", rate: 93 },
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis domain={[80, 100]} />
                          <Tooltip />
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
            <Card>
              <CardHeader>
                <CardTitle>Technician Performance</CardTitle>
                <CardDescription>Service metrics by technician</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Services Completed</h3>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={technicianData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="completed" name="Services Completed" fill="#FF8C00" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Response Time Efficiency</h3>
                    <div className="space-y-4">
                      {technicianData.map((tech) => (
                        <div key={tech.name}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{tech.name}</span>
                            <span>{tech.response}%</span>
                          </div>
                          <Progress value={tech.response} className="h-2 bg-gray-100" />
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
