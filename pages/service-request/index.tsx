"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon, ArrowLeft, CheckCircle } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard-header"

export default function ServiceRequestPage() {
  const searchParams = useSearchParams()
  const tractorId = searchParams.get("tractor") || ""

  const [date, setDate] = useState<Date>()
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    tractorId: tractorId,
    serviceType: "",
    description: "",
    urgency: "",
    preferredTime: "",
    additionalNotes: "",
    partsNeeded: false,
  })

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit the form data to an API
    setTimeout(() => {
      setSubmitted(true)
    }, 1000)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-green-100 rounded-full p-4 inline-block mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Request Submitted</h1>
            <p className="text-gray-600 mb-8">
              Your service request has been successfully submitted. A technician will be assigned to your request
              shortly.
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
    )
  }

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
            <h1 className="text-3xl font-bold text-gray-900">Service Request</h1>
            <p className="text-gray-600">Request maintenance for your tractor</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Service Request Form</CardTitle>
                <CardDescription>Fill in the details to request a service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="tractor-id">Tractor ID</Label>
                  <Input
                    id="tractor-id"
                    value={formData.tractorId}
                    onChange={(e) => handleChange("tractorId", e.target.value)}
                    placeholder="Enter tractor ID"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service-type">Service Type</Label>
                  <Select
                    value={formData.serviceType}
                    onValueChange={(value) => handleChange("serviceType", value)}
                    required
                  >
                    <SelectTrigger id="service-type">
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular Maintenance</SelectItem>
                      <SelectItem value="repair">Repair</SelectItem>
                      <SelectItem value="inspection">Inspection</SelectItem>
                      <SelectItem value="emergency">Emergency Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Describe the issue or service needed"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency</Label>
                    <Select value={formData.urgency} onValueChange={(value) => handleChange("urgency", value)} required>
                      <SelectTrigger id="urgency">
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Within 2 weeks</SelectItem>
                        <SelectItem value="medium">Medium - Within 1 week</SelectItem>
                        <SelectItem value="high">High - Within 48 hours</SelectItem>
                        <SelectItem value="critical">Critical - Immediate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferred-time">Preferred Time</Label>
                  <Select
                    value={formData.preferredTime}
                    onValueChange={(value) => handleChange("preferredTime", value)}
                  >
                    <SelectTrigger id="preferred-time">
                      <SelectValue placeholder="Select preferred time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12PM - 4PM)</SelectItem>
                      <SelectItem value="evening">Evening (4PM - 8PM)</SelectItem>
                      <SelectItem value="any">Any Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="parts"
                    checked={formData.partsNeeded}
                    onCheckedChange={(checked) => handleChange("partsNeeded", checked as boolean)}
                  />
                  <Label htmlFor="parts">Replacement parts may be needed</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional-notes">Additional Notes</Label>
                  <Textarea
                    id="additional-notes"
                    value={formData.additionalNotes}
                    onChange={(e) => handleChange("additionalNotes", e.target.value)}
                    placeholder="Any additional information that might be helpful"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                  Submit Service Request
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}
