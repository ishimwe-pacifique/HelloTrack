"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, PenToolIcon as Tool, Calendar, AlertTriangle, CheckCircle, ArrowLeft, BarChart3 } from "lucide-react"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard-header"

export default function TractorDetailsPage({ params }: { params: { id: string } }) {
  const [tractorData] = useState({
    id: params.id,
    name: "John Deere 5E",
    status: "warning",
    hours: 58,
    lastService: "2023-04-02",
    nextService: "2023-06-15",
    purchaseDate: "2022-01-15",
    owner: "John Doe",
    location: "North Farm",
    serviceHistory: [
      {
        id: "SVC-001",
        date: "2023-04-02",
        technician: "Mike Johnson",
        hours: 0,
        notes: "Regular maintenance, oil change, filter replacement",
      },
      {
        id: "SVC-002",
        date: "2023-01-10",
        technician: "Sarah Williams",
        hours: 0,
        notes: "Brake adjustment, hydraulic system check",
      },
      {
        id: "SVC-003",
        date: "2022-10-05",
        technician: "David Brown",
        hours: 0,
        notes: "Engine tune-up, replaced air filter",
      },
    ],
    upcomingServices: [{ id: "USVC-001", date: "2023-06-15", type: "Regular Maintenance", status: "scheduled" }],
  })

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
            <h1 className="text-3xl font-bold text-gray-900">{tractorData.name}</h1>
            <p className="text-gray-600">ID: {tractorData.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Badge
                className={
                  tractorData.status === "good"
                    ? "bg-green-500"
                    : tractorData.status === "warning"
                      ? "bg-amber-500"
                      : "bg-red-500"
                }
              >
                {tractorData.status === "good"
                  ? "Good"
                  : tractorData.status === "warning"
                    ? "Service Soon"
                    : "Service Required"}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Hours since last service</span>
                    <span className="font-medium">{tractorData.hours}/60</span>
                  </div>
                  <Progress
                    value={(tractorData.hours / 60) * 100}
                    className={
                      tractorData.status === "good"
                        ? "text-green-500"
                        : tractorData.status === "warning"
                          ? "text-amber-500"
                          : "text-red-500"
                    }
                  />
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
              <div className="text-2xl font-bold">{tractorData.lastService}</div>
              <p className="text-xs text-muted-foreground">By Mike Johnson</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Next Service</CardTitle>
              <Calendar className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tractorData.nextService}</div>
              <p className="text-xs text-muted-foreground">In 14 days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Owner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-medium">{tractorData.owner}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-medium">{tractorData.location}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Purchase Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-medium">{tractorData.purchaseDate}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-medium">{tractorData.serviceHistory.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end mb-8">
          <Link href={`/service-request?tractor=${tractorData.id}`}>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Tool className="mr-2 h-4 w-4" />
              Request Service
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="history" className="mb-8">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="history">Service History</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Services</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Service History</CardTitle>
                <CardDescription>Past maintenance records for this tractor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tractorData.serviceHistory.map((service) => (
                    <div key={service.id} className="flex items-start p-4 border rounded-lg">
                      <div className="mr-4">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Service ID: {service.id}</h4>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{service.date}</span>
                          <span className="mx-2">•</span>
                          <Tool className="h-3 w-3 mr-1" />
                          <span>{service.technician}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{service.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Services</CardTitle>
                <CardDescription>Scheduled maintenance for this tractor</CardDescription>
              </CardHeader>
              <CardContent>
                {tractorData.upcomingServices.length > 0 ? (
                  <div className="space-y-4">
                    {tractorData.upcomingServices.map((service) => (
                      <div key={service.id} className="flex items-start p-4 border rounded-lg">
                        <div className="mr-4">
                          <Calendar className="h-8 w-8 text-orange-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{service.type}</h4>
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{service.date}</span>
                          </div>
                        </div>
                        <Badge className="bg-blue-500">Scheduled</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 text-orange-300 mx-auto mb-4" />
                    <p className="text-gray-500">No upcoming services scheduled</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-orange-500 hover:bg-orange-600">Schedule Service</Button>
              </CardFooter>
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
                  <div>
                    <h3 className="text-lg font-medium mb-4">Hours Operated by Month</h3>
                    <div className="h-64 flex items-end justify-between gap-2">
                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, i) => {
                        const height = [40, 65, 35, 80, 55, 70][i]
                        return (
                          <div key={month} className="flex flex-col items-center">
                            <div className="bg-orange-500 w-12 rounded-t-md" style={{ height: `${height}%` }}></div>
                            <span className="text-xs mt-2">{month}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Maintenance Efficiency</h3>
                      <div className="flex items-center justify-center">
                        <div className="relative h-40 w-40">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold">92%</span>
                          </div>
                          <BarChart3 className="h-full w-full text-orange-400" />
                        </div>
                      </div>
                      <p className="text-sm text-center text-gray-500 mt-2">
                        Maintenance efficiency score based on service history
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Downtime Analysis</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Scheduled Maintenance</span>
                            <span>3%</span>
                          </div>
                          <Progress value={3} className="h-2 bg-gray-100" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Unscheduled Repairs</span>
                            <span>5%</span>
                          </div>
                          <Progress value={5} className="h-2 bg-gray-100" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Total Downtime</span>
                            <span>8%</span>
                          </div>
                          <Progress value={8} className="h-2 bg-gray-100" />
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
