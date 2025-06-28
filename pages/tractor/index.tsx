/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardHeader from "@/components/dashboard-header";
import TractorRegistrationForm from "@/components/TractorRegistrationForm";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import Link from "next/link";

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

export default function DashboardPage() {
  const [tractorOwners, setTractorOwners] = useState<any[]>([]); // State for fetched data
  const qrRef = useRef<HTMLDivElement>(null); // Ref for the QR code container

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
  }, []);

  const handleGenerateQRCode = async (tractor: TractorOwner) => {
   const qrCodeValue = `https://hellotractor.vercel.app/tractor/${tractor.tractorId}`;

    try {
      await axios.put(`/api/tractor-owners?id=${tractor._id}`, {
        qrCodeValue,
      });
      console.log("QR Code saved successfully!");
    } catch (error: any) {
      console.error("Error saving QR Code:", error);
    }
  };

  const handleDownloadQRCode = (tractor: TractorOwner) => {
    if (!qrRef.current) return;

    const canvas = qrRef.current.querySelector("canvas");
    if (canvas) {
      const link = document.createElement("a");
      link.download = `${tractor.tractorId}-QRCode.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <TractorRegistrationForm />
          <h2 className="text-xl font-bold text-gray-800">Tractor Owners</h2>
          {tractorOwners.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tractorOwners.map((tractor) => (
                <Card key={tractor._id} className="overflow-hidden">
                  <CardHeader className="bg-orange-50 pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{tractor.name}</CardTitle>
                      <Badge
                        className={
                          tractor.welcomeEmailStatus === "sent"
                            ? "bg-green-500"
                            : tractor.welcomeEmailStatus === "warning"
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }
                      >
                        {tractor.welcomeEmailStatus === "sent"
                          ? "Sent"
                          : tractor.welcomeEmailStatus === "warning"
                          ? "Service Soon"
                          : "Service Required"}
                      </Badge>
                    </div>
                    <CardDescription>
                      Tractor ID: {tractor.tractorId}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Owner Name</span>
                        <span className="font-medium">{tractor.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Email:</span>
                        <span>{tractor.email}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Phone:</span>
                        <span>{tractor.phoneNumber}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>New Registration Number:</span>
                        <span>{tractor.newRegistrationNumber}</span>
                      </div>

                      <div className="flex justify-end">
                        <Link href={`/tractor/${tractor.tractorId}`}>
                          <Button
                            variant="outline"
                            className="text-white"
                            size="sm"
                          >
                            View Details
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          className="bg-orange-500 hover:bg-orange-600"
                          onClick={() => handleGenerateQRCode(tractor)}
                        >
                          {tractor.qrCodeValue
                            ? "Regenerate QR Code"
                            : "Generate QR Code"}
                        </Button>
                      </div>

                      {tractor.qrCodeValue && (
                        <div
                          ref={qrRef}
                          className="mt-4 flex flex-col items-center"
                        >
                          <QRCode
                            value={tractor.qrCodeValue}
                            size={128}
                          />
                          <Button
                            size="sm"
                            className="mt-2 bg-blue-500 hover:bg-blue-600"
                            onClick={() => handleDownloadQRCode(tractor)}
                          >
                            Download QR Code
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-gray-600">No tractor owners found.</p>
          )}
        </div>
      </main>
    </div>
  );
}