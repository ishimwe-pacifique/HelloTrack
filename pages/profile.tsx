/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, MapPin, Calendar, Tractor, PenToolIcon as Tool, Clock } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import { useNotification } from "@/components/notification-provider"

export default function ProfilePage() {
  const { showNotification } = useNotification()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "North Farm, Agritech City",
    bio: "Tractor owner with 5 years of experience in agricultural machinery management. Focused on optimizing maintenance schedules and reducing downtime.",
    joinDate: "January 15, 2022",
    role: "Tractor Owner",
  })

  const [tractors, setTractors] = useState([
    {
      id: "TR-001",
      name: "John Deere 5E",
      purchaseDate: "2022-01-15",
      lastService: "2023-04-15",
      hours: 52,
      status: "good",
    },
    {
      id: "TR-002",
      name: "Massey Ferguson 240",
      purchaseDate: "2022-03-10",
      lastService: "2023-04-02",
      hours: 58,
      status: "warning",
    },
    {
      id: "TR-003",
      name: "New Holland TD5.90",
      purchaseDate: "2022-06-22",
      lastService: "2023-05-10",
      hours: 23,
      status: "good",
    },
    {
      id: "TR-004",
      name: "Kubota M7060",
      purchaseDate: "2021-11-05",
      lastService: "2023-03-20",
      hours: 62,
      status: "critical",
    },
  ])

  const [serviceHistory, setServiceHistory] = useState([
    {
      id: "SVC-001",
      tractor: "John Deere 5E",
      date: "2023-04-15",
      technician: "Mike Johnson",
      type: "Regular Maintenance",
      notes: "Oil change, filter replacement, general inspection",
    },
    {
      id: "SVC-002",
      tractor: "Massey Ferguson 240",
      date: "2023-04-02",
      technician: "Sarah Williams",
      type: "Regular Maintenance",
      notes: "60-hour service, brake adjustment, hydraulic system check",
    },
    {
      id: "SVC-003",
      tractor: "New Holland TD5.90",
      date: "2023-05-10",
      technician: "David Brown",
      type: "Repair",
      notes: "Fixed electrical issue, replaced battery, checked alternator",
    },
    {
      id: "SVC-004",
      tractor: "Kubota M7060",
      date: "2023-03-20",
      technician: "Lisa Chen",
      type: "Regular Maintenance",
      notes: "60-hour service, oil change, filter replacement",
    },
    {
      id: "SVC-005",
      tractor: "John Deere 5E",
      date: "2023-01-10",
      technician: "Mike Johnson",
      type: "Repair",
      notes: "Replaced fuel pump, cleaned fuel system",
    },
  ])

  const handleProfileChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = () => {
    setIsEditing(false)
    showNotification("Profile Updated", "Your profile information has been successfully updated.", "success")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">View and manage your personal information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                  <AvatarFallback className="bg-orange-100 text-orange-800 text-xl">JD</AvatarFallback>
                </Avatar>
                <CardTitle>{profileData.name}</CardTitle>
                <CardDescription>{profileData.role}</CardDescription>
                <Badge className="mt-2 bg-orange-500">{tractors.length} Tractors</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{profileData.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{profileData.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{profileData.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Joined {profileData.joinDate}</span>
                </div>
                <Separator />
                <div>
                  <h3 className="font-medium mb-2">About</h3>
                  <p className="text-sm text-gray-600">{profileData.bio}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? "Cancel Editing" : "Edit Profile"}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="mb-8">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="profile">Profile Details</TabsTrigger>
                <TabsTrigger value="tractors">My Tractors</TabsTrigger>
                <TabsTrigger value="history">Service History</TabsTrigger>
              </TabsList>
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>View and update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isEditing ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={profileData.name}
                            onChange={(e) => handleProfileChange("name", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => handleProfileChange("email", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={profileData.phone}
                            onChange={(e) => handleProfileChange("phone", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={profileData.location}
                            onChange={(e) => handleProfileChange("location", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={profileData.bio}
                            onChange={(e) => handleProfileChange("bio", e.target.value)}
                            rows={4}
                          />
                        </div>

                        <Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={handleSaveProfile}>
                          Save Changes
                        </Button>
                      </>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                          <p className="mt-1">{profileData.name}</p>
                        </div>
                        <Separator />
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                          <p className="mt-1">{profileData.email}</p>
                        </div>
                        <Separator />
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                          <p className="mt-1">{profileData.phone}</p>
                        </div>
                        <Separator />
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Location</h3>
                          <p className="mt-1">{profileData.location}</p>
                        </div>
                        <Separator />
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                          <p className="mt-1 text-gray-700">{profileData.bio}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="tractors">
                <Card>
                  <CardHeader>
                    <CardTitle>My Tractors</CardTitle>
                    <CardDescription>Manage your registered tractors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tractors.map((tractor) => (
                        <div key={tractor.id} className="flex items-start p-4 border rounded-lg">
                          <div className="mr-4">
                            <Tractor
                              className={`h-8 w-8 ${
                                tractor.status === "good"
                                  ? "text-green-500"
                                  : tractor.status === "warning"
                                    ? "text-amber-500"
                                    : "text-red-500"
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <h4 className="font-medium">{tractor.name}</h4>
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
                            <p className="text-sm text-gray-600">ID: {tractor.id}</p>
                            <div className="flex flex-wrap items-center mt-2 text-xs text-gray-500 gap-x-4 gap-y-1">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>Purchased: {tractor.purchaseDate}</span>
                              </div>
                              <div className="flex items-center">
                                <Tool className="h-3 w-3 mr-1" />
                                <span>Last Service: {tractor.lastService}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>Hours: {tractor.hours}/60</span>
                              </div>
                            </div>
                          </div>
                          <div className="hidden md:flex ml-4">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600">
                      <Tractor className="mr-2 h-4 w-4" />
                      Register New Tractor
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Service History</CardTitle>
                    <CardDescription>View all your tractor service records</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {serviceHistory.map((service) => (
                        <div key={service.id} className="flex items-start p-4 border rounded-lg">
                          <div className="mr-4">
                            <Tool className="h-8 w-8 text-orange-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <h4 className="font-medium">{service.tractor}</h4>
                              <Badge className="bg-blue-500">{service.type}</Badge>
                            </div>
                            <p className="text-sm text-gray-600">Service ID: {service.id}</p>
                            <p className="text-sm text-gray-600 mt-1">{service.notes}</p>
                            <div className="flex flex-wrap items-center mt-2 text-xs text-gray-500 gap-x-4 gap-y-1">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>{service.date}</span>
                              </div>
                              <div className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                <span>Technician: {service.technician}</span>
                              </div>
                            </div>
                          </div>
                          <div className="hidden md:flex ml-4">
                            <Button variant="outline" size="sm">
                              View Report
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
