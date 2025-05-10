import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, CheckCircle, AlertTriangle, PenToolIcon as Tool, Calendar, User } from "lucide-react"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard-header"

export default function ServiceRequestsPage() {
  const pendingRequests = [
    {
      id: "SR-001",
      tractor: "John Deere 5E",
      tractorId: "TR-001",
      date: "2023-06-10",
      type: "Regular Maintenance",
      status: "pending",
      description: "60-hour maintenance service",
      urgency: "medium",
    },
    {
      id: "SR-002",
      tractor: "Massey Ferguson 240",
      tractorId: "TR-002",
      date: "2023-06-08",
      type: "Repair",
      status: "assigned",
      description: "Engine making unusual noise",
      urgency: "high",
      technician: "Mike Johnson",
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
      technician: "David Brown",
    },
    {
      id: "SR-004",
      tractor: "Kubota M7060",
      tractorId: "TR-004",
      date: "2023-03-20",
      type: "Repair",
      status: "completed",
      description: "Hydraulic system repair",
      technician: "Lisa Chen",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Service Requests</h1>
            <p className="text-gray-600">Manage your tractor service requests</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/service-request">
              <Button className="bg-orange-500 hover:bg-orange-600">New Service Request</Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="pending" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedRequests.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Service Requests</CardTitle>
                <CardDescription>Service requests that are pending or in progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="flex items-start p-4 border rounded-lg">
                      <div className="mr-4">
                        {request.status === "pending" ? (
                          <Clock className="h-8 w-8 text-amber-500" />
                        ) : (
                          <Tool className="h-8 w-8 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <h4 className="font-medium">{request.tractor}</h4>
                          <Badge className={request.status === "pending" ? "bg-amber-500" : "bg-blue-500"}>
                            {request.status === "pending" ? "Pending" : "Assigned"}
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
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            <span>Urgency: {request.urgency}</span>
                          </div>
                          {request.technician && (
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              <span>Technician: {request.technician}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="hidden md:flex ml-4">
                        <Link href={`/service-requests/${request.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
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
                <CardDescription>Service requests that have been completed</CardDescription>
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
                            <span>Technician: {request.technician}</span>
                          </div>
                        </div>
                      </div>
                      <div className="hidden md:flex ml-4">
                        <Link href={`/service-requests/${request.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
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
      </main>
    </div>
  )
}
