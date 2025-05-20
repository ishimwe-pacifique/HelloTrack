import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Tractor,
  Clock,
  AlertTriangle,
  CheckCircle,
  PenToolIcon as Tool,
  Bell,
} from "lucide-react";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard-header";
import { utilities } from "@/utils/utilities";
import TractorRegistrationForm from "@/components/TractorRegistrationForm";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, John Doe</p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/qr-generator">
              <Button className="bg-orange-500 hover:bg-orange-600">
                Generate QR Code
              </Button>
            </Link>
            <Link href="/service-request">
              <Button variant="outline">Request Service</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Tractors
              </CardTitle>
              <Tractor className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Services
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                5 completed this month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                Tractors need immediate service
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tractors" className="mb-8">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="tractors">My Tractors</TabsTrigger>
            <TabsTrigger value="services">Service History</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="tractors">
            <>
              <TractorRegistrationForm />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {utilities.map((tractor) => (
                  <Card key={tractor.id} className="overflow-hidden">
                    <CardHeader className="bg-orange-50 pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                          {tractor.name}
                        </CardTitle>
                        <Badge
                          className={
                            tractor.status === "good"
                              ? "bg-green-500"
                              : tractor.status === "warning"
                              ? "bg-amber-500"
                              : "bg-red-500"
                          }
                        >
                          {tractor.status === "good"
                            ? "Good"
                            : tractor.status === "warning"
                            ? "Service Soon"
                            : "Service Required"}
                        </Badge>
                      </div>
                      <CardDescription>ID: {tractor.id}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Hours since last service</span>
                            <span className="font-medium">
                              {tractor.hours}/60
                            </span>
                          </div>
                          <Progress
                            value={(tractor.hours / 60) * 100}
                            className={
                              tractor.status === "good"
                                ? "text-green-500"
                                : tractor.status === "warning"
                                ? "text-amber-500"
                                : "text-red-500"
                            }
                          />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Last service date:</span>
                          <span>{tractor.lastService}</span>
                        </div>
                        <div className="flex justify-between">
                          <Link href={`/tractor/${tractor.id}`}>
                            <Button
                              variant="outline"
                              className="text-white"
                              size="sm"
                            >
                              View Details
                            </Button>
                          </Link>
                          <Link href={`/service-request?tractor=${tractor.id}`}>
                            <Button
                              size="sm"
                              className="bg-orange-500 hover:bg-orange-600"
                            >
                              Request Service
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          </TabsContent>
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Recent Service History</CardTitle>
                <CardDescription>
                  View all your tractor service records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: "SVC-001",
                      tractor: "John Deere 5E",
                      date: "2023-04-15",
                      technician: "Mike Johnson",
                      status: "completed",
                    },
                    {
                      id: "SVC-002",
                      tractor: "Massey Ferguson 240",
                      date: "2023-04-02",
                      technician: "Sarah Williams",
                      status: "completed",
                    },
                    {
                      id: "SVC-003",
                      tractor: "New Holland TD5.90",
                      date: "2023-05-10",
                      technician: "David Brown",
                      status: "completed",
                    },
                    {
                      id: "SVC-004",
                      tractor: "Kubota M7060",
                      date: "2023-03-20",
                      technician: "Lisa Chen",
                      status: "completed",
                    },
                  ].map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center p-4 border rounded-lg"
                    >
                      <div className="mr-4">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{service.tractor}</h4>
                        <p className="text-sm text-gray-600">
                          Service ID: {service.id}
                        </p>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <Tool className="h-3 w-3 mr-1" />
                          <span>{service.technician}</span>
                          <span className="mx-2">•</span>
                          <span>{service.date}</span>
                        </div>
                      </div>
                      <Badge className="bg-green-500">Completed</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>
                  Stay updated on your tractor maintenance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: 1,
                      title: "Service Required",
                      message:
                        "Your Kubota M7060 has exceeded 60 hours since last service",
                      time: "2 hours ago",
                      type: "critical",
                    },
                    {
                      id: 2,
                      title: "Service Reminder",
                      message:
                        "Your Massey Ferguson 240 is approaching the 60-hour service mark",
                      time: "1 day ago",
                      type: "warning",
                    },
                    {
                      id: 3,
                      title: "Service Completed",
                      message:
                        "Service for New Holland TD5.90 has been completed",
                      time: "5 days ago",
                      type: "info",
                    },
                    {
                      id: 4,
                      title: "Technician Assigned",
                      message:
                        "Mike Johnson has been assigned to your service request",
                      time: "1 week ago",
                      type: "info",
                    },
                  ].map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start p-4 border rounded-lg"
                    >
                      <div className="mr-4">
                        <Bell
                          className={`h-5 w-5 ${
                            notification.type === "critical"
                              ? "text-red-500"
                              : notification.type === "warning"
                              ? "text-amber-500"
                              : "text-blue-500"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{notification.title}</h4>
                        <p className="text-sm text-gray-600">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.time}
                        </p>
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
  );
}
