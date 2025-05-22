/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CheckCircle, Plus } from "lucide-react";

import Link from "next/link";
import DashboardHeader from "@/components/dashboard-header";
import axios from "axios";

export default function ServiceRequestPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    tractorId: "",
    additionalNotes: "",
    partsNeeded: false,
  });
  const [tractorOwners, setTractorOwners] = useState<any[]>([]); // State for fetched data
  const [serviceHistories, setServiceHistories] = useState<any[]>([]);
  const [upcomingServices, setUpcomingServices] = useState<any[]>([]);

  // Temporary states for new entries
  const [newServiceHistory, setNewServiceHistory] = useState<any>({
    date: "",
    description: "",
  });
  const [newUpcomingService, setNewUpcomingService] = useState<any>({
    date: "",
    description: "",
  });
  const [allocatedHours, setAllocatedHours] = useState(0);

  // Handler for updating allocated hours
  const handleAllocateHours = (newHours: number) => {
    if (newHours >= 0 && newHours <= 60) {
      setAllocatedHours(newHours);
    }
  };

  // Handlers for adding new items
  const handleAddServiceHistory = () => {
    setServiceHistories((prev) => [...prev, newServiceHistory]);
    setNewServiceHistory({ date: "", description: "" }); // Reset input
  };

  const handleAddUpcomingService = () => {
    setUpcomingServices((prev) => [...prev, newUpcomingService]);
    setNewUpcomingService({ date: "", description: "" }); // Reset input
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = formData.tractorId
          ? `/api/tractor-owners?tractorId=${formData.tractorId}`
          : "/api/tractor-owners";
        const response = await axios.get(endpoint);

        if (formData.tractorId) {
          const tractorInfo = response.data.data?.tractorInfo || {};
          const {
            hours = 0,
            serviceHistory = [],
            upcomingServices = [],
            additionalNotes = "",
            partsNeeded = false,
          } = tractorInfo;

          setAllocatedHours(hours);
          setServiceHistories(serviceHistory);
          setUpcomingServices(upcomingServices);
          setFormData((prev) => ({
            ...prev,
            additionalNotes,
            partsNeeded,
          }));
        } else {
          setTractorOwners(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching tractor data:", error);
      }
    };

    fetchData();
  }, [formData.tractorId]);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tractorId) {
      alert("Please select a tractor ID.");
      return;
    }

    try {
      const payload = {
        ...formData,
        tractorInfo: {
          hours: allocatedHours,
          serviceHistory: serviceHistories,
          upcomingServices: upcomingServices,
          additionalNotes: formData.additionalNotes,
          partsNeeded: formData.partsNeeded,
        },
      };
      await axios.put(
        `/api/tractor-owners?tractorId=${formData.tractorId}`,
        payload
      );
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting service request:", error);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-green-100 rounded-full p-4 inline-block mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Service Request Submitted
            </h1>
            <p className="text-gray-600 mb-8">
              Your service request has been successfully submitted. A technician
              will be assigned to your request shortly.
            </p>
            <div className="space-y-4">
              <Link href="/dashboard">
                <Button className="w-full">Return to Dashboard</Button>
              </Link>
              <Link href="/service-requests">
                <Button variant="outline" className="w-full">
                  View All Service Requests
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }
  console.log(tractorOwners);
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
            <h1 className="text-3xl font-bold text-gray-900">
              Service Request
            </h1>
            <p className="text-gray-600">
              Request maintenance for your tractor
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Service Request Form</CardTitle>
                <CardDescription>
                  Fill in the details to request a service
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2 w-full">
                  <Label htmlFor="tractor-id">Tractor ID</Label>

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
                        <SelectItem key={owner._id} value={owner.tractorId}>
                          {owner.name} - {owner.tractorId}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="additional-notes">Add Service History</Label>
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
                      <Label htmlFor="service-history-description">
                        Description
                      </Label>
                      <input
                        id="service-history-description"
                        value={newServiceHistory.description}
                        className="border p-2 rounded w-full"
                        onChange={(e) =>
                          setNewServiceHistory((prev: any) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Describe the service"
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent the form from submitting
                        handleAddServiceHistory();
                      }}
                      className="flex items-center"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                  </div>

                  {/* Render added histories */}
                  <ul className="mt-4 space-y-2">
                    {serviceHistories.map((history, index) => (
                      <li key={index} className="p-2 bg-gray-100 rounded">
                        <strong>{history.date}:</strong> {history.description}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Section for adding upcoming services */}
                <div className="space-y-4">
                  <Label htmlFor="additional-notes">Add Upcoming Service</Label>
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
                      <Label htmlFor="upcoming-service-description">
                        Description
                      </Label>
                      <input
                        id="upcoming-service-description"
                        className="border p-2 rounded w-full"
                        value={newUpcomingService.description}
                        onChange={(e) =>
                          setNewUpcomingService((prev: any) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Describe the upcoming service"
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent the form from submitting
                        handleAddUpcomingService();
                      }}
                      className="flex items-center"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                  </div>

                  {/* Render added upcoming services */}
                  <ul className="mt-4 space-y-2">
                    {upcomingServices.map((service, index) => (
                      <li key={index} className="p-2 bg-gray-100 rounded">
                        <strong>{service.date}:</strong> {service.description}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="parts"
                    checked={formData.partsNeeded}
                    onCheckedChange={(checked) =>
                      handleChange("partsNeeded", checked as boolean)
                    }
                  />
                  <Label htmlFor="parts">Replacement parts may be needed</Label>
                </div>

                <div className="space-y-2 w-full">
                  <Label htmlFor="additional-notes">Additional Notes</Label>
                  <Textarea
                    id="additional-notes"
                    value={formData.additionalNotes}
                    onChange={(e) =>
                      handleChange("additionalNotes", e.target.value)
                    }
                    placeholder="Any additional information that might be helpful"
                  />
                </div>
                <div className="space-y-4">
                  <Label htmlFor="allocated-hours">Allocated Hours</Label>
                  <div className="flex items-center gap-4">
                    <input
                      id="allocated-hours"
                      type="number"
                      className="border p-2 rounded w-full"
                      min="0"
                      max="60"
                      value={allocatedHours}
                      onChange={(e) => {
                        const newHours = parseInt(e.target.value, 10);
                        if (newHours <= 60) {
                          handleAllocateHours(newHours);
                        } else {
                          alert("Allocated hours cannot exceed 60.");
                        }
                      }}
                      placeholder="Enter allocated hours"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (allocatedHours < 60) {
                          handleAllocateHours(allocatedHours + 1);
                        } else {
                          alert("Allocated hours cannot exceed 60.");
                        }
                      }}
                      disabled={allocatedHours >= 60}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Hour
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (allocatedHours > 0) {
                          handleAllocateHours(allocatedHours - 1);
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
                    /60
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-orange-500 my-4 hover:bg-orange-600"
                >
                  Submit Service Request
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
