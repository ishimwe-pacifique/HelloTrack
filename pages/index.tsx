import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tractor, QrCode, Users, Bell, BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Tractor className="h-8 w-8 text-orange-500" />
            <h1 className="text-2xl font-bold text-orange-600">Hello Tractor</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-orange-500 hover:bg-orange-600">Register</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Streamline Tractor Servicing with <span className="text-orange-500">QR Codes</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Monitor service intervals, receive timely notifications, and manage service requests efficiently.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                Get Started
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <QrCode className="h-12 w-12 text-orange-500 mb-2" />
              <CardTitle>QR Code Tracking</CardTitle>
              <CardDescription>Generate and scan unique QR codes for each tractor</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Easily track service history and maintenance schedules by scanning QR codes affixed to tractors.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Bell className="h-12 w-12 text-orange-500 mb-2" />
              <CardTitle>Service Notifications</CardTitle>
              <CardDescription>Receive timely alerts for upcoming service needs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get notified when your tractor approaches the 60-hour service threshold to prevent downtime.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-orange-500 mb-2" />
              <CardTitle>Role-Based Access</CardTitle>
              <CardDescription>Tailored interfaces for different user roles</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Specific features for tractor owners, technicians, and hub leads to streamline workflow.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="bg-orange-50 rounded-lg p-8 mb-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Real-Time Analytics</h2>
              <p className="text-gray-600 mb-6">
                Track tractor downtime, service efficiency, and throughput metrics with our comprehensive analytics
                dashboard.
              </p>
              <Link href="/analytics">
                <Button className="bg-orange-500 hover:bg-orange-600">View Analytics</Button>
              </Link>
            </div>
            <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-md">
              <BarChart3 className="h-48 w-full text-orange-400" />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Tractor className="h-6 w-6 text-orange-400" />
                <h2 className="text-xl font-bold text-orange-400">Hello Tractor</h2>
              </div>
              <p className="text-gray-400">Streamlining tractor servicing through innovative QR code technology.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/dashboard" className="text-gray-400 hover:text-orange-400">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/qr-codes" className="text-gray-400 hover:text-orange-400">
                    QR Codes
                  </Link>
                </li>
                <li>
                  <Link href="/service-requests" className="text-gray-400 hover:text-orange-400">
                    Service Requests
                  </Link>
                </li>
                <li>
                  <Link href="/analytics" className="text-gray-400 hover:text-orange-400">
                    Analytics
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400 mb-2">Email: info@hellotractor.com</p>
              <p className="text-gray-400 mb-2">Phone: +1 (123) 456-7890</p>
              <p className="text-gray-400">Address: 123 Farming Lane, Agritech City</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Hello Tractor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
