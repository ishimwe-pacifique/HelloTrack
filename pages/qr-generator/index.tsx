"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QrCode, Printer, Download } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import QRCode from "react-qr-code"

export default function QRGeneratorPage() {
  const [tractorId, setTractorId] = useState("")
  const [tractorModel, setTractorModel] = useState("")
  const [tractorType, setTractorType] = useState("")
  const [qrGenerated, setQrGenerated] = useState(false)
  const [qrValue, setQrValue] = useState("")

  const handleGenerateQR = () => {
    if (!tractorId || !tractorModel || !tractorType) return

    // In a real app, this would create a unique identifier and store it in a database
    const uniqueId = `HT-${tractorId}-${Date.now()}`
    setQrValue(uniqueId)
    setQrGenerated(true)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // In a real app, this would generate and download a PNG of the QR code
    alert("QR code downloaded")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">QR Code Generator</h1>
          <p className="text-gray-600">Create unique QR codes for your tractors</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Tractor Information</CardTitle>
              <CardDescription>Enter the details of the tractor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tractor-id">Tractor ID</Label>
                <Input
                  id="tractor-id"
                  placeholder="Enter tractor ID"
                  value={tractorId}
                  onChange={(e) => setTractorId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tractor-model">Tractor Model</Label>
                <Input
                  id="tractor-model"
                  placeholder="e.g. John Deere 5E"
                  value={tractorModel}
                  onChange={(e) => setTractorModel(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tractor-type">Tractor Type</Label>
                <Select value={tractorType} onValueChange={setTractorType}>
                  <SelectTrigger id="tractor-type">
                    <SelectValue placeholder="Select tractor type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="utility">Utility</SelectItem>
                    <SelectItem value="row-crop">Row Crop</SelectItem>
                    <SelectItem value="garden">Garden</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600"
                onClick={handleGenerateQR}
                disabled={!tractorId || !tractorModel || !tractorType}
              >
                <QrCode className="mr-2 h-4 w-4" />
                Generate QR Code
              </Button>
            </CardFooter>
          </Card>

          <Card className={qrGenerated ? "" : "flex items-center justify-center bg-gray-100"}>
            {qrGenerated ? (
              <>
                <CardHeader>
                  <CardTitle>Generated QR Code</CardTitle>
                  <CardDescription>Scan this code to access tractor information</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="bg-white p-4 rounded-lg mb-4">
                    <QRCode value={qrValue} size={200} />
                  </div>
                  <div className="text-center mb-4">
                    <p className="font-medium">{tractorModel}</p>
                    <p className="text-sm text-gray-500">ID: {tractorId}</p>
                    <p className="text-sm text-gray-500">Type: {tractorType}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center gap-4">
                  <Button variant="outline" onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                  <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </CardFooter>
              </>
            ) : (
              <div className="text-center p-8">
                <QrCode className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Fill in the tractor details and generate a QR code</p>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}
