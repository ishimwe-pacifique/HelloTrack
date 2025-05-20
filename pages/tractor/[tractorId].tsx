/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, PenToolIcon as Tool, Calendar, AlertTriangle, CheckCircle, ArrowLeft, BarChart3 } from "lucide-react"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard-header"
import { utilities } from "@/utils/utilities"
import { useRouter } from "next/router"
import axios from "axios"
interface TractorOwner {
  _id?: string; // Adding an ID for fetched data
  name: string;
  phoneNumber: string;
  email: string;
  physicalAddress: string;
  location: string;
  assignedTractor: string;
  newRegistrationNumber: string;
  tractorId: string;
  welcomeEmailStatus: string;
}

export default function TractorDetailsPage() {
    const router = useRouter();
 const [tractorId, setTractorId] = useState<string | undefined>(undefined); // State to store tractorId
  const [qrCodeValue, setQrCodeValue] = useState<Record<string, string>>({});
  const [tractorData, setTractorData] = useState<any | null>(null);
  const [tractorOwner, setTractorOwner] = useState<TractorOwner>();

  // Wait for `router.isReady` to get `tractorId`
  useEffect(() => {
    if (router.isReady) {
      const { tractorId } = router.query;
      console.log("Tractor ID:", tractorId); // Debug log
      setTractorId(tractorId as string); // Set the tractorId in state
    }
  }, [router.isReady, router.query]);

  // Fetch QR Code
  useEffect(() => {
    if (tractorId) {
      const fetchQRCode = async () => {
        try {
          const response = await axios.get("/api/save-qr-code", {
            params: { tractorId },
          });

          if (response.data?.qrCodeValue) {
            setQrCodeValue(response.data.qrCodeValue);
          } else {
            console.error("No QR Code found for tractor:", tractorId);
          }
        } catch (error) {
          console.error("Error fetching QR Code:", error);
        }
      };

      fetchQRCode();
    }
  }, [tractorId]);

  // Fetch Tractor Data
  useEffect(() => {
    if (tractorId) {
      const tractor = utilities.find((u) => u.id === tractorId);

      if (tractor) {
        setTractorData(tractor);
      } else {
        console.error(`Tractor with ID ${tractorId} not found.`);
      }
    }
  }, [tractorId]);

   useEffect(() => {
    const fetchTractorOwners = async () => {
      try {
  const response = await axios.get("/api/tractor-owners", {
            params: { tractorId },
          });
        setTractorOwner(response.data.data); // Assuming API returns a list of tractor owners
      } catch (error: any) {
        console.error("Error fetching tractor owners:", error);
      }
    };

    fetchTractorOwners();
  }, []);

  if (!tractorId) {
    return <div>Loading tractor details...</div>; // Show loading state while waiting for router.query
  }

  if (!tractorData) {
    return <div>Loading tractor data...</div>; // Show loading state while waiting for tractorData
  }
  console.log(qrCodeValue)
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
            <h1 className="text-3xl font-bold text-gray-900">{tractorOwner?.name}</h1>
            <p className="text-gray-600">ID: {tractorOwner?.tractorId}</p>
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
              <div className="font-medium">{tractorData?.serviceHistory?.length || 0}</div>
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
                  {tractorData.serviceHistory.map((service:any) => (
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
                    {tractorData.upcomingServices.map((service:any) => (
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
