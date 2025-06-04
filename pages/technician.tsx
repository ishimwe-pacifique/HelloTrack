/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  PenToolIcon as Tool,
  Calendar,
  User,
  Tractor,
  Package,
} from "lucide-react";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard-header";
import TechnicianForm from "@/components/TechnicianRegistrationForm";
import axios from "axios";
import AssignService from "@/components/AssignService";
import PartsManagement from "@/components/PartsManagement";
import UpdateRequestDialog from "@/components/UpdateRequestDialog";

export default function TechnicianPage() {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  const [technicianData, setTechnicianData] = useState<any[]>([]);
  const [partsData, setPartsData] = useState<any[]>([]);
  const [assignedRequests, setAssignedRequests] = useState<any[]>([]);
  const [tractorOwners, setTractorOwners] = useState<any[]>([]);
  const requests = [
    {
      id: "SR-002",
      tractor: "Massey Ferguson 240",
      tractorId: "TR-002",
      date: "2023-06-08",
      type: "Repair",
      status: "assigned",
      description: "Engine making unusual noise",
      urgency: "high",
      owner: "John Doe",
      location: "North Farm",
      partsNeeded: ["Engine Oil", "Oil Filter"],
    },
    {
      id: "SR-005",
      tractor: "John Deere 5E",
      tractorId: "TR-001",
      date: "2023-06-12",
      type: "Regular Maintenance",
      status: "assigned",
      description: "60-hour maintenance service",
      urgency: "medium",
      owner: "Sarah Johnson",
      location: "East Field",
      partsNeeded: ["Oil Filter", "Air Filter", "Fuel Filter"],
    },
  ];
  // Fetch tractor owners
  useEffect(() => {
    const fetchTractorOwners = async () => {
      try {
        const response = await axios.get("/api/tractor-owners");
        console.log(response.data.data);
        setTractorOwners(response.data.data);
      } catch (error: any) {
        console.error("Error fetching tractor owners:", error);
      }
    };
    fetchTractorOwners();
    const fetchServices = async () => {
      try {
        const response = await axios.get("/api/assign-service");
        console.log(response.data.data);
        setAssignedRequests(response.data.data);
      } catch (error: any) {
        console.error("Error fetching tractor owners:", error);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchTechnicianData = async () => {
      try {
        const response = await axios.get("/api/technician");
        console.log(response.data.data);
        setTechnicianData(response.data.data);
      } catch (error: any) {
        console.error("Error fetching tractor owners:", error);
      }
    };
    fetchTechnicianData();

    const fetchPartsData = async () => {
      try {
        const response = await axios.get("/api/parts");
        setPartsData(response.data);
      } catch (error: any) {
        console.error("Error fetching parts:", error);
      }
    };
    fetchPartsData();
  }, []);

  const handleAssignService = async (
    technicianId: string,
    requestId: string,
    tractor: string,
    maintenanceTask: string,
    commonProblem: string,
    priority: string,
    parts: { partId: string; quantity: number }[]
  ) => {
    try {
      await axios.post("/api/assign-service", {
        technicianId,
        requestId,
        tractor,
        maintenanceTask,
        commonProblem,
        parts,
        priority,
      });

      setAssignedRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId
            ? {
                ...request,
                assignedTo: technicianId,
                tractor: tractor,
                maintenanceTask: maintenanceTask,
                commonProblem: commonProblem,
                parts,
                priority,
                status: "in-progress",
              }
            : request
        )
      );

      alert(
        `Service Request ${requestId} assigned to Technician ${technicianId}. Maintenance Task: "${maintenanceTask}", Common Problem: "${commonProblem}"`
      );
    } catch (error) {
      console.error("Error assigning service:", error);
    }
  };

  const handleUpdateRequest = async (requestId: string, updatedData: any) => {
    try {
      const response = await fetch(`/api/assign-service?id=${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update the request.");
      }

      const updatedRequest = await response.json();

      // Update state
      setAssignedRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === requestId ? { ...req, ...updatedRequest } : req
        )
      );
    } catch (error) {
      console.error("Error updating request:", error);
      alert("Failed to update the request. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Technician Dashboard
            </h1>
            <p className="text-gray-600">
              Manage service requests and track maintenance
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <TechnicianForm />
            <Link href="/qr-scanner">
              <Button variant="outline">Scan QR Code</Button>
            </Link>
            <Link href="/parts-request">
              <Button className="bg-orange-500 hover:bg-orange-600">
                Request Parts
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Assigned Requests
              </CardTitle>
              <Tool className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {assignedRequests.length}
              </div>
              <p className="text-xs text-muted-foreground">2 high priority</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Completed This Week
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Parts Needed
              </CardTitle>
              <Package className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                2 items low in stock
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="assigned" className="mb-8">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="assigned">
                  Assigned ({assignedRequests.length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed (
                  {
                    assignedRequests.filter(
                      (request) => request.status === "completed"
                    ).length
                  }
                  )
                </TabsTrigger>
                <TabsTrigger value="technician">
                  Technicians ({technicianData.length})
                </TabsTrigger>
                assignedRequests
              </TabsList>
              <TabsContent value="assigned">
                <AssignService
                  technicians={technicianData}
                  tractor={tractorOwners}
                  requests={requests}
                  onAssign={handleAssignService}
                  parts={partsData}
                />
                <Card>
                  <CardHeader>
                    <CardTitle>Assigned Service Requests</CardTitle>
                    <CardDescription>
                      Service requests assigned to you
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {assignedRequests.map((request) => (
                        <div
                          key={request._id}
                          className={`flex flex-col md:flex-row items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedRequest === request._id
                              ? "border-orange-500 bg-orange-50"
                              : "hover:border-orange-200 hover:bg-orange-50/50"
                          }`}
                          onClick={() => setSelectedRequest(request._id)}
                        >
                          <div className="mr-4">
                            {request.priority === "high" ? (
                              <AlertTriangle className="h-8 w-8 text-red-500" />
                            ) : (
                              <Clock className="h-8 w-8 text-orange-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <h4 className="font-medium">
                                {request.tractor.name}
                              </h4>
                              <Badge
                                className={
                                  request.priority === "high"
                                    ? "bg-red-500"
                                    : request.priority === "medium"
                                    ? "bg-amber-500"
                                    : "bg-blue-500"
                                }
                              >
                                {request.priority.charAt(0).toUpperCase() +
                                  request.priority.slice(1)}{" "}
                                Priority
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              Request ID: {request.slug}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {request.description}
                            </p>
                            <div className="flex flex-wrap items-center mt-2 text-xs text-gray-500 gap-x-4 gap-y-1">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>
                                  {new Date(request.updatedAt).toLocaleString()}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                <span>
                                  Technician: {request.technicianId.firstName}{" "}
                                  {request.technicianId.lastName}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Tractor className="h-3 w-3 mr-1" />
                                <span>
                                  Tractor ID: {request.tractor.tractorId}
                                </span>
                              </div>
                            </div>
                            <span className="flex text-sm text-gray-600 mt-1">
                              <span className="font-medium">Parts Needed:</span>{" "}
                              <ul className="flex text-sm">
                                {request.parts?.map((part: any) => (
                                  <li key={part.partId._id}>
                                    {part.partId.partName} -{" "}
                                    {part.partId.partNumber}
                                  </li>
                                ))}
                              </ul>
                            </span>
                            <span className="text-sm">
                              Notes: {request.notes}
                            </span>

                            {/* Update Button */}
                            <div className="mt-4 flex justify-between">
                              <span className="text-sm">
                                Status: {request.status}
                              </span>
                              <UpdateRequestDialog
                                request={request}
                                onUpdate={(updatedData) =>
                                  handleUpdateRequest(request._id, updatedData)
                                }
                              />
                            </div>
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
                    <CardDescription>
                      Service requests you have completed
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {assignedRequests
                        .filter((request) => request.status === "completed")
                        .map((request) => (
                          <div
                            key={request._id}
                            className="flex items-start p-4 border rounded-lg"
                          >
                            <div className="mr-4">
                              <CheckCircle className="h-8 w-8 text-green-500" />
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <h4 className="font-medium">
                                  {" "}
                                  {request.tractor.name}
                                </h4>
                                <Badge className="bg-green-500">
                                  Completed
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                Request ID: {request.slug}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {request.description}
                              </p>
                              <div className="flex flex-wrap items-center mt-2 text-xs text-gray-500 gap-x-4 gap-y-1">
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  <span>
                                    {new Date(
                                      request.updatedAt
                                    ).toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <User className="h-3 w-3 mr-1" />
                                  <span>
                                    Technician: {request.technicianId.firstName}{" "}
                                    {request.technicianId.lastName}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Tractor className="h-3 w-3 mr-1" />
                                  <span>ID: {request.tractor.tractorId}</span>
                                </div>
                              </div>
                            </div>
                            <div className="hidden md:flex ml-4">
                              <Link
                                href={`/service-requests/${request.tractor.tractorId}`}
                              >
                                <Button variant="outline" size="sm">
                                  View Report
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="technician">
                <Card>
                  <CardHeader>
                    <CardTitle>Technicians</CardTitle>
                    <CardDescription>
                      List of registered technicians
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {technicianData.map((technician) => (
                        <div
                          key={technician._id}
                          className="flex items-start p-4 border rounded-lg"
                        >
                          <div className="mr-4">
                            <User className="h-8 w-8 text-blue-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between gap-4 items-center">
                              <h4 className="font-medium">{`${technician.firstName} ${technician.lastName}`}</h4>
                              <div className="text-sm text-gray-600 mt-1 flex items-center">
                                <span>Status: {technician.status}</span>
                                {technician.status === "active" ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="green"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-4 h-4 ml-2"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M4.5 12.75l6 6 9-13.5"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="red"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-4 h-4 ml-2"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M18.364 5.636L5.636 18.364M5.636 5.636l12.728 12.728"
                                    />
                                  </svg>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">
                              Email: {technician.email}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              Phone: {technician.phoneNumber}
                            </p>
                            <div className="flex gap-4">
                              <p className="text-sm text-gray-600 mt-1">
                                Specialty: {technician.specialty}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Parts Inventory</CardTitle>
                <CardDescription>
                  Current stock of maintenance parts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PartsManagement />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
