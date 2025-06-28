// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Switch } from "@/components/ui/switch"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Separator } from "@/components/ui/separator"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Bell, Smartphone, Globe, Moon } from "lucide-react"
// import DashboardHeader from "@/components/dashboard-header"

// export default function SettingsPage() {
//   const [profileData, setProfileData] = useState({
//     name: "John Doe",
//     email: "john.doe@example.com",
//     phone: "+1 (555) 123-4567",
//     role: "Tractor Owner",
//     language: "english",
//     darkMode: false,
//   })

//   const [notificationSettings, setNotificationSettings] = useState({
//     serviceReminders: true,
//     serviceCompletions: true,
//     techniciansAssigned: true,
//     systemUpdates: false,
//     email: true,
//     push: true,
//     sms: false,
//   })

//   const handleProfileChange = (field: string, value: string | boolean) => {
//     setProfileData((prev) => ({ ...prev, [field]: value }))
//   }

//   const handleNotificationChange = (field: string, value: boolean) => {
//     setNotificationSettings((prev) => ({ ...prev, [field]: value }))
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <DashboardHeader />

//       <main className="container mx-auto px-4 py-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
//           <p className="text-gray-600">Manage your account preferences</p>
//         </div>

//         <Tabs defaultValue="profile" className="mb-8">
//           <TabsList className="grid w-full grid-cols-3 mb-8">
//             <TabsTrigger value="profile">Profile</TabsTrigger>
//             <TabsTrigger value="notifications">Notifications</TabsTrigger>
//             <TabsTrigger value="security">Security</TabsTrigger>
//           </TabsList>

//           <TabsContent value="profile">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               <Card className="md:col-span-2">
//                 <CardHeader>
//                   <CardTitle>Personal Information</CardTitle>
//                   <CardDescription>Update your personal details</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="name">Full Name</Label>
//                     <Input
//                       id="name"
//                       value={profileData.name}
//                       onChange={(e) => handleProfileChange("name", e.target.value)}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="email">Email Address</Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       value={profileData.email}
//                       onChange={(e) => handleProfileChange("email", e.target.value)}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="phone">Phone Number</Label>
//                     <Input
//                       id="phone"
//                       value={profileData.phone}
//                       onChange={(e) => handleProfileChange("phone", e.target.value)}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="role">Role</Label>
//                     <Input id="role" value={profileData.role} disabled />
//                     <p className="text-xs text-muted-foreground">Your role cannot be changed</p>
//                   </div>
//                 </CardContent>
//                 <CardFooter>
//                   <Button className="bg-orange-500 hover:bg-orange-600">Save Changes</Button>
//                 </CardFooter>
//               </Card>

//               <div className="space-y-8">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Profile Picture</CardTitle>
//                     <CardDescription>Update your profile image</CardDescription>
//                   </CardHeader>
//                   <CardContent className="flex flex-col items-center">
//                     <Avatar className="h-24 w-24 mb-4">
//                       <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
//                       <AvatarFallback className="bg-orange-100 text-orange-800 text-xl">JD</AvatarFallback>
//                     </Avatar>
//                     <div className="flex gap-2">
//                       <Button variant="outline" size="sm">
//                         Upload
//                       </Button>
//                       <Button variant="outline" size="sm">
//                         Remove
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Preferences</CardTitle>
//                     <CardDescription>Customize your experience</CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="language">Language</Label>
//                       <Select
//                         value={profileData.language}
//                         onValueChange={(value) => handleProfileChange("language", value)}
//                       >
//                         <SelectTrigger id="language">
//                           <SelectValue placeholder="Select language" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="english">English</SelectItem>
//                           <SelectItem value="french">French</SelectItem>
//                           <SelectItem value="spanish">Spanish</SelectItem>
//                           <SelectItem value="swahili">Swahili</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-2">
//                         <Moon className="h-4 w-4" />
//                         <Label htmlFor="dark-mode">Dark Mode</Label>
//                       </div>
//                       <Switch
//                         id="dark-mode"
//                         checked={profileData.darkMode}
//                         onCheckedChange={(checked:any) => handleProfileChange("darkMode", checked)}
//                       />
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
//           </TabsContent>

//           <TabsContent value="notifications">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Notification Preferences</CardTitle>
//                 <CardDescription>Choose what notifications you receive</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-8">
//                 <div>
//                   <h3 className="text-lg font-medium mb-4">Notification Types</h3>
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <div className="space-y-0.5">
//                         <Label htmlFor="service-reminders">Service Reminders</Label>
//                         <p className="text-sm text-muted-foreground">
//                           Receive notifications when your tractor needs service
//                         </p>
//                       </div>
//                       <Switch
//                         id="service-reminders"
//                         checked={notificationSettings.serviceReminders}
//                         onCheckedChange={(checked:any) => handleNotificationChange("serviceReminders", checked)}
//                       />
//                     </div>
//                     <Separator />
//                     <div className="flex items-center justify-between">
//                       <div className="space-y-0.5">
//                         <Label htmlFor="service-completions">Service Completions</Label>
//                         <p className="text-sm text-muted-foreground">
//                           Receive notifications when a service is completed
//                         </p>
//                       </div>
//                       <Switch
//                         id="service-completions"
//                         checked={notificationSettings.serviceCompletions}
//                         onCheckedChange={(checked:any) => handleNotificationChange("serviceCompletions", checked)}
//                       />
//                     </div>
//                     <Separator />
//                     <div className="flex items-center justify-between">
//                       <div className="space-y-0.5">
//                         <Label htmlFor="technicians-assigned">Technician Assignments</Label>
//                         <p className="text-sm text-muted-foreground">
//                           Receive notifications when a technician is assigned to your request
//                         </p>
//                       </div>
//                       <Switch
//                         id="technicians-assigned"
//                         checked={notificationSettings.techniciansAssigned}
//                         onCheckedChange={(checked:any) => handleNotificationChange("techniciansAssigned", checked)}
//                       />
//                     </div>
//                     <Separator />
//                     <div className="flex items-center justify-between">
//                       <div className="space-y-0.5">
//                         <Label htmlFor="system-updates">System Updates</Label>
//                         <p className="text-sm text-muted-foreground">
//                           Receive notifications about system updates and new features
//                         </p>
//                       </div>
//                       <Switch
//                         id="system-updates"
//                         checked={notificationSettings.systemUpdates}
//                         onCheckedChange={(checked:any) => handleNotificationChange("systemUpdates", checked)}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="text-lg font-medium mb-4">Notification Channels</h3>
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-2">
//                         <Globe className="h-4 w-4" />
//                         <Label htmlFor="email-notifications">Email Notifications</Label>
//                       </div>
//                       <Switch
//                         id="email-notifications"
//                         checked={notificationSettings.email}
//                         onCheckedChange={(checked:any) => handleNotificationChange("email", checked)}
//                       />
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-2">
//                         <Bell className="h-4 w-4" />
//                         <Label htmlFor="push-notifications">Push Notifications</Label>
//                       </div>
//                       <Switch
//                         id="push-notifications"
//                         checked={notificationSettings.push}
//                         onCheckedChange={(checked:any) => handleNotificationChange("push", checked)}
//                       />
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-2">
//                         <Smartphone className="h-4 w-4" />
//                         <Label htmlFor="sms-notifications">SMS Notifications</Label>
//                       </div>
//                       <Switch
//                         id="sms-notifications"
//                         checked={notificationSettings.sms}
//                         onCheckedChange={(checked:any) => handleNotificationChange("sms", checked)}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//               <CardFooter>
//                 <Button className="bg-orange-500 hover:bg-orange-600">Save Preferences</Button>
//               </CardFooter>
//             </Card>
//           </TabsContent>

//           <TabsContent value="security">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Change Password</CardTitle>
//                   <CardDescription>Update your password to keep your account secure</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="current-password">Current Password</Label>
//                     <Input id="current-password" type="password" />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="new-password">New Password</Label>
//                     <Input id="new-password" type="password" />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="confirm-password">Confirm New Password</Label>
//                     <Input id="confirm-password" type="password" />
//                   </div>
//                 </CardContent>
//                 <CardFooter>
//                   <Button className="bg-orange-500 hover:bg-orange-600">Update Password</Button>
//                 </CardFooter>
//               </Card>

//               <div className="space-y-8">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Two-Factor Authentication</CardTitle>
//                     <CardDescription>Add an extra layer of security to your account</CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <div className="space-y-0.5">
//                         <Label>Two-Factor Authentication</Label>
//                         <p className="text-sm text-muted-foreground">
//                           Protect your account with an additional verification step
//                         </p>
//                       </div>
//                       <Switch id="two-factor" />
//                     </div>
//                   </CardContent>
//                   <CardFooter>
//                     <Button variant="outline">Setup 2FA</Button>
//                   </CardFooter>
//                 </Card>

//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="text-red-600">Danger Zone</CardTitle>
//                     <CardDescription>Irreversible account actions</CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="space-y-2">
//                       <h4 className="font-medium">Delete Account</h4>
//                       <p className="text-sm text-muted-foreground">
//                         Permanently delete your account and all associated data
//                       </p>
//                     </div>
//                   </CardContent>
//                   <CardFooter>
//                     <Button variant="destructive">Delete Account</Button>
//                   </CardFooter>
//                 </Card>
//               </div>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </main>
//     </div>
//   )
// }
