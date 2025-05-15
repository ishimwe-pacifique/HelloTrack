/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { QrCode, Camera, Upload, Tractor, Clock, Calendar, AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard-header"

export default function QRScannerPage() {
  const [activeTab, setActiveTab] = useState("camera")
  const [scanning, setScanning] = useState(false)
  const [scannedData, setScannedData] = useState<null | {
    id: string
    name: string
    status: string
    hours: number
    lastService: string
    nextService: string
  }>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startScanning = async () => {
    setScanning(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      // In a real app, this would use a QR code scanning library
      // For demo purposes, we'll simulate a successful scan after 3 seconds
      setTimeout(() => {
        setScannedData({
          id: "TR-001",
          name: "John Deere 5E",
          status: "warning",
          hours: 58,
          lastService: "2023-04-02",
          nextService: "2023-06-15",
        })
        setScanning(false)
        // Stop the camera stream
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
          tracks.forEach((track) => track.stop())
        }
      }, 3000)
    } catch (error) {
      console.error("Error accessing camera:", error)
      setScanning(false)
    }
  }

  const stopScanning = () => {
    setScanning(false)
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
  }

  const resetScan = () => {
    setScannedData(null)
    setScanning(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, this would process the image and scan for QR codes
      // For demo purposes, we'll simulate a successful scan
      setTimeout(() => {
        setScannedData({
          id: "TR-002",
          name: "Massey Ferguson 240",
          status: "critical",
          hours: 62,
          lastService: "2023-03-20",
          nextService: "Overdue",
        })
      }, 1000)
    }
  }

  useEffect(() => {
    return () => {
      // Clean up camera stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

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
            <h1 className="text-3xl font-bold text-gray-900">QR Code Scanner</h1>
            <p className="text-gray-600">Scan tractor QR codes to view service information</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {!scannedData ? (
            <Card>
              <CardHeader>
                <CardTitle>Scan QR Code</CardTitle>
                <CardDescription>Scan a tractor QR code to view service information</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="camera">Camera</TabsTrigger>
                    <TabsTrigger value="upload">Upload Image</TabsTrigger>
                  </TabsList>
                  <TabsContent value="camera" className="mt-4">
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
                      {scanning ? (
                        <>
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-48 h-48 border-2 border-orange-500 rounded-lg"></div>
                          </div>
                          <canvas ref={canvasRef} className="hidden" />
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
                          <Camera className="h-12 w-12 text-gray-400 mb-2" />
                          <p className="text-gray-500">Camera preview will appear here</p>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-center">
                      {scanning ? (
                        <Button variant="outline" onClick={stopScanning}>
                          Cancel
                        </Button>
                      ) : (
                        <Button className="bg-orange-500 hover:bg-orange-600" onClick={startScanning}>
                          <Camera className="mr-2 h-4 w-4" />
                          Start Scanning
                        </Button>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="upload" className="mt-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 mb-4">Upload an image containing a QR code</p>
                      <label htmlFor="qr-upload">
                        <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                          <span>
                            <Upload className="mr-2 h-4 w-4" />
                            Select Image
                          </span>
                        </Button>
                      </label>
                      <input
                        id="qr-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex flex-col items-center text-center">
                <QrCode className="h-8 w-8 text-orange-500 mb-2" />
                <p className="text-sm text-gray-500">
                  Position the QR code within the frame to scan automatically, or upload an image containing the QR code
                </p>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader className="bg-orange-50">
                <div className="flex justify-between items-center">
                  <CardTitle>{scannedData.name}</CardTitle>
                  <Badge
                    className={
                      scannedData.status === "good"
                        ? "bg-green-500"
                        : scannedData.status === "warning"
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }
                  >
                    {scannedData.status === "good"
                      ? "Good"
                      : scannedData.status === "warning"
                        ? "Service Soon"
                        : "Service Required"}
                  </Badge>
                </div>
                <CardDescription>ID: {scannedData.id}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Hours since last service</span>
                    <span className="font-medium">{scannedData.hours}/60</span>
                  </div>
                  <Progress
                    value={(scannedData.hours / 60) * 100}
                    className={
                      scannedData.status === "good"
                        ? "text-green-500"
                        : scannedData.status === "warning"
                          ? "text-amber-500"
                          : "text-red-500"
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Last Service</span>
                    </div>
                    <p className="font-medium">{scannedData.lastService}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Next Service</span>
                    </div>
                    <p className="font-medium">{scannedData.nextService}</p>
                  </div>
                </div>

                {scannedData.status === "critical" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-800">Service Overdue</p>
                      <p className="text-sm text-red-600">
                        This tractor has exceeded the recommended 60-hour service interval. Schedule service immediately
                        to prevent damage.
                      </p>
                    </div>
                  </div>
                )}

                {scannedData.status === "warning" && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800">Service Due Soon</p>
                      <p className="text-sm text-amber-600">
                        This tractor is approaching the 60-hour service interval. Schedule service soon to maintain
                        optimal performance.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={resetScan}>
                  Scan Another
                </Button>
                <div className="flex gap-2">
                  <Link href={`/tractor/${scannedData.id}`}>
                    <Button variant="outline">
                      <Tractor className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </Link>
                  <Link href={`/service-request?tractor=${scannedData.id}`}>
                    <Button className="bg-orange-500 hover:bg-orange-600">Request Service</Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
