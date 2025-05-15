"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  PenToolIcon as Tool,
  Settings,
  Trash2,
  Mail,
  Phone,
} from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Service Required",
      message: "Your Kubota M7060 has exceeded 60 hours since last service",
      time: "2 hours ago",
      type: "critical",
      read: false,
      category: "service",
    },
    {
      id: 2,
      title: "Service Reminder",
      message: "Your Massey Ferguson 240 is approaching the 60-hour service mark",
      time: "1 day ago",
      type: "warning",
      read: false,
      category: "service",
    },
    {
      id: 3,
      title: "Service Completed",
      message: "Service for New Holland TD5.90 has been completed",
      time: "5 days ago",
      type: "info",
      read: true,
      category: "service",
    },
    {
      id: 4,
      title: "Technician Assigned",
      message: "Mike Johnson has been assigned to your service request",
      time: "1 week ago",
      type: "info",
      read: true,
      category: "service",
    },
    {
      id: 5,
      title: "New Feature Available",
      message: "QR code scanning is now available in the mobile app",
      time: "2 weeks ago",
      type: "info",
      read: true,
      category: "system",
    },
    {
      id: 6,
      title: "Account Security",
      message: "Your password was changed successfully",
      time: "3 weeks ago",
      type: "info",
      read: true,
      category: "account",
    },
  ])

  const [notificationSettings, setNotificationSettings] = useState({
    serviceReminders: true,
    serviceCompletions: true,
    techniciansAssigned: true,
    systemUpdates: false,
    email: true,
    push: true,
    sms: false,
  })

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [field]: value }))
  }

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600">Manage your notifications and preferences</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
            <Button variant="outline" onClick={clearAllNotifications} disabled={notifications.length === 0}>
              Clear all
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="all">
              All
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-orange-500" variant="secondary">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="service">Service</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Notifications</CardTitle>
                <CardDescription>View and manage all your notifications</CardDescription>
              </CardHeader>
              <CardContent>
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No notifications to display</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start p-4 border rounded-lg ${
                          !notification.read ? "bg-orange-50 border-orange-200" : ""
                        }`}
                      >
                        <div className="mr-4">
                          {notification.type === "critical" ? (
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                          ) : notification.type === "warning" ? (
                            <Clock className="h-5 w-5 text-amber-500" />
                          ) : (
                            <Bell className="h-5 w-5 text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{notification.title}</h4>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                        <div className="flex gap-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span className="sr-only">Mark as read</span>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="service">
            <Card>
              <CardHeader>
                <CardTitle>Service Notifications</CardTitle>
                <CardDescription>Notifications related to tractor services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.filter((n) => n.category === "service").length === 0 ? (
                    <div className="text-center py-8">
                      <Tool className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No service notifications to display</p>
                    </div>
                  ) : (
                    notifications
                      .filter((n) => n.category === "service")
                      .map((notification) => (
                        <div
                          key={notification.id}
                          className={`flex items-start p-4 border rounded-lg ${
                            !notification.read ? "bg-orange-50 border-orange-200" : ""
                          }`}
                        >
                          <div className="mr-4">
                            {notification.type === "critical" ? (
                              <AlertTriangle className="h-5 w-5 text-red-500" />
                            ) : notification.type === "warning" ? (
                              <Clock className="h-5 w-5 text-amber-500" />
                            ) : (
                              <Tool className="h-5 w-5 text-blue-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{notification.title}</h4>
                            <p className="text-sm text-gray-600">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                          <div className="flex gap-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span className="sr-only">Mark as read</span>
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>System Notifications</CardTitle>
                <CardDescription>Updates and announcements about the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.filter((n) => n.category === "system").length === 0 ? (
                    <div className="text-center py-8">
                      <Settings className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No system notifications to display</p>
                    </div>
                  ) : (
                    notifications
                      .filter((n) => n.category === "system")
                      .map((notification) => (
                        <div
                          key={notification.id}
                          className={`flex items-start p-4 border rounded-lg ${
                            !notification.read ? "bg-orange-50 border-orange-200" : ""
                          }`}
                        >
                          <div className="mr-4">
                            <Settings className="h-5 w-5 text-blue-500" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{notification.title}</h4>
                            <p className="text-sm text-gray-600">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                          <div className="flex gap-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span className="sr-only">Mark as read</span>
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what notifications you receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Notification Types</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="service-reminders">Service Reminders</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications when your tractor needs service
                        </p>
                      </div>
                      <Switch
                        id="service-reminders"
                        checked={notificationSettings.serviceReminders}
                        onCheckedChange={(checked) => handleNotificationChange("serviceReminders", checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="service-completions">Service Completions</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications when a service is completed
                        </p>
                      </div>
                      <Switch
                        id="service-completions"
                        checked={notificationSettings.serviceCompletions}
                        onCheckedChange={(checked) => handleNotificationChange("serviceCompletions", checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="technicians-assigned">Technician Assignments</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications when a technician is assigned to your request
                        </p>
                      </div>
                      <Switch
                        id="technicians-assigned"
                        checked={notificationSettings.techniciansAssigned}
                        onCheckedChange={(checked) => handleNotificationChange("techniciansAssigned", checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="system-updates">System Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about system updates and new features
                        </p>
                      </div>
                      <Switch
                        id="system-updates"
                        checked={notificationSettings.systemUpdates}
                        onCheckedChange={(checked) => handleNotificationChange("systemUpdates", checked)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Notification Channels</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={notificationSettings.email}
                        onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4" />
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={notificationSettings.push}
                        onCheckedChange={(checked) => handleNotificationChange("push", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      </div>
                      <Switch
                        id="sms-notifications"
                        checked={notificationSettings.sms}
                        onCheckedChange={(checked) => handleNotificationChange("sms", checked)}
                      />
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
