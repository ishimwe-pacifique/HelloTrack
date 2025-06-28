"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toast"
import { Bell, Smartphone, Globe, Moon, Loader2, Upload, X } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  profilePicture: string[]
  permissions: string[]
  role: string
  agreeTerms: boolean
  createdAt: string
  updatedAt: string
}

interface NotificationSettings {
  serviceReminders: boolean
  serviceCompletions: boolean
  techniciansAssigned: boolean
  systemUpdates: boolean
  email: boolean
  push: boolean
  sms: boolean
}

interface PasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function SettingsPage() {
  const { toast, toasts, dismiss } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [passwordChanging, setPasswordChanging] = useState(false)

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    language: "english",
    darkMode: false,
  })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    serviceReminders: true,
    serviceCompletions: true,
    techniciansAssigned: true,
    systemUpdates: false,
    email: true,
    push: true,
    sms: false,
  })

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Fetch user data function with useCallback to prevent unnecessary re-renders
  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/users")
      if (response.ok) {
        const users = await response.json()
        // For demo, get first user. In real app, filter by current user ID
        const currentUser = users[0]
        if (currentUser) {
          setUser(currentUser)
          setProfileData({
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            phone: currentUser.phone,
            role: currentUser.role,
            language: "english", // Default since not in model
            darkMode: false, // Default since not in model
          })
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch user data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  const handleProfileChange = (field: string, value: string | boolean) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = (field: keyof PasswordData, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }))
  }

  const saveProfile = async () => {
    if (!user) return

    try {
      setSaving(true)
      const response = await fetch(`/api/users?id=${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: profileData.email,
          phone: profileData.phone,
          role: profileData.role,
          permissions: user.permissions,
        }),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser)
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "Failed to update profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const changePassword = async () => {
    if (!user) return

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      })
      return
    }

    try {
      setPasswordChanging(true)
      const response = await fetch(`/api/users?id=${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          permissions: user.permissions,
          password: passwordData.newPassword,
        }),
      })

      if (response.ok) {
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
        toast({
          title: "Success",
          description: "Password updated successfully",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "Failed to update password",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating password:", error)
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      })
    } finally {
      setPasswordChanging(false)
    }
  }

  const saveNotifications = async () => {
    // In a real app, you'd save notification settings to the backend
    // For now, we'll just show a success message
    toast({
      title: "Success",
      description: "Notification preferences saved",
    })
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading settings...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">User not found</h2>
          <p className="text-gray-600">Please log in to access settings</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account preferences</p>
        </div>

        <Tabs defaultValue="profile" className="mb-8">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => handleProfileChange("firstName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => handleProfileChange("lastName", e.target.value)}
                      />
                    </div>
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
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" value={profileData.role} disabled />
                    <p className="text-xs text-muted-foreground">Your role cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Permissions</Label>
                    <div className="flex flex-wrap gap-2">
                      {user.permissions.length > 0 ? (
                        user.permissions.map((permission, index) => (
                          <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 rounded-md text-sm">
                            {permission}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No permissions assigned</span>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-orange-500 hover:bg-orange-600" onClick={saveProfile} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </CardFooter>
              </Card>

              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>Update your profile image</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 mb-4">
                      {user.profilePicture.length > 0 ? (
                        <AvatarImage src={user.profilePicture[0] || "/placeholder.svg"} alt="Profile" />
                      ) : (
                        <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                      )}
                      <AvatarFallback className="bg-orange-100 text-orange-800 text-xl">
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                      </Button>
                      {user.profilePicture.length > 0 && (
                        <Button variant="outline" size="sm">
                          <X className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>Customize your experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={profileData.language}
                        onValueChange={(value) => handleProfileChange("language", value)}
                      >
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="swahili">Swahili</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Moon className="h-4 w-4" />
                        <Label htmlFor="dark-mode">Dark Mode</Label>
                      </div>
                      <Switch
                        id="dark-mode"
                        checked={profileData.darkMode}
                        onCheckedChange={(checked) => handleProfileChange("darkMode", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Info</CardTitle>
                    <CardDescription>Account creation details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Member since:</span> {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Last updated:</span> {new Date(user.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Terms agreed:</span> {user.agreeTerms ? "Yes" : "No"}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
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
                        <Globe className="h-4 w-4" />
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
                        <Smartphone className="h-4 w-4" />
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
              <CardFooter>
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={saveNotifications}>
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={changePassword}
                    disabled={
                      passwordChanging ||
                      !passwordData.currentPassword ||
                      !passwordData.newPassword ||
                      !passwordData.confirmPassword
                    }
                  >
                    {passwordChanging ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </CardFooter>
              </Card>

              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>Add an extra layer of security to your account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">
                          Protect your account with an additional verification step
                        </p>
                      </div>
                      <Switch id="two-factor" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="bg-white text-black">
                      Setup 2FA
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">Danger Zone</CardTitle>
                    <CardDescription>Irreversible account actions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Delete Account</h4>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="destructive">Delete Account</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}