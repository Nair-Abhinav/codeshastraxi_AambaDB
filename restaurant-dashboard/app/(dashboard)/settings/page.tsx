"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Camera, Check, Globe, Mail, Moon, Save, Shield, Sun, User } from "lucide-react"

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        <Button className="gradient-bg gradient-bg-hover">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your profile details and public information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                      <AvatarFallback>
                        <User className="h-12 w-12" />
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input id="first-name" defaultValue="Alex" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input id="last-name" defaultValue="Johnson" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="alex@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        rows={3}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        defaultValue="Frontend developer with a passion for creating beautiful and functional user interfaces."
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Social Profiles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input id="twitter" defaultValue="twitter.com/alexj" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="github">GitHub</Label>
                      <Input id="github" defaultValue="github.com/alexj" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input id="linkedin" defaultValue="linkedin.com/in/alexj" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" defaultValue="alexjohnson.dev" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Language & Region</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <select
                        id="language"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="ja">Japanese</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <select
                        id="timezone"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="utc-8">Pacific Time (UTC-8)</option>
                        <option value="utc-5">Eastern Time (UTC-5)</option>
                        <option value="utc+0">UTC</option>
                        <option value="utc+1">Central European Time (UTC+1)</option>
                        <option value="utc+9">Japan Standard Time (UTC+9)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h3 className="text-lg font-medium">Public Profile</h3>
                      <p className="text-sm text-muted-foreground">Allow others to see your profile information</p>
                    </div>
                    <Switch checked={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h3 className="text-lg font-medium">Show Activity Status</h3>
                      <p className="text-sm text-muted-foreground">Display when you're active on the platform</p>
                    </div>
                    <Switch checked={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h3 className="text-lg font-medium">Allow Tagging</h3>
                      <p className="text-sm text-muted-foreground">Let others tag you in their posts and comments</p>
                    </div>
                    <Switch checked={false} />
                  </div>
                </div>

                <Separator />

                <div className="pt-2">
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how the application looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <Moon className="h-5 w-5 mr-2" />
                        <h3 className="text-lg font-medium">Dark Mode</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">Use dark theme across the application</p>
                    </div>
                    <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        darkMode ? "border-purple-500 bg-purple-500/10" : "border-border hover:border-foreground/30"
                      }`}
                      onClick={() => setDarkMode(true)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Dark</h4>
                        {darkMode && <Check className="h-4 w-4 text-purple-500" />}
                      </div>
                      <div className="h-20 bg-background rounded-md border border-border flex items-center justify-center">
                        <Moon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    </div>

                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        !darkMode ? "border-purple-500 bg-purple-500/10" : "border-border hover:border-foreground/30"
                      }`}
                      onClick={() => setDarkMode(false)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Light</h4>
                        {!darkMode && <Check className="h-4 w-4 text-purple-500" />}
                      </div>
                      <div className="h-20 bg-white rounded-md border border-gray-200 flex items-center justify-center">
                        <Sun className="h-6 w-6 text-gray-600" />
                      </div>
                    </div>

                    <div className="border border-border rounded-lg p-4 cursor-pointer hover:border-foreground/30 transition-all">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">System</h4>
                      </div>
                      <div className="h-20 bg-gradient-to-r from-background to-white rounded-md border border-border flex items-center justify-center">
                        <Globe className="h-6 w-6 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Theme Color</h3>
                  <div className="flex flex-wrap gap-3">
                    {["purple", "blue", "green", "red", "orange", "pink"].map((color, i) => (
                      <div
                        key={i}
                        className={`h-8 w-8 rounded-full cursor-pointer ${
                          color === "purple"
                            ? "bg-purple-500 ring-2 ring-purple-500 ring-offset-2 ring-offset-background"
                            : color === "blue"
                              ? "bg-blue-500 hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 hover:ring-offset-background"
                              : color === "green"
                                ? "bg-green-500 hover:ring-2 hover:ring-green-500 hover:ring-offset-2 hover:ring-offset-background"
                                : color === "red"
                                  ? "bg-red-500 hover:ring-2 hover:ring-red-500 hover:ring-offset-2 hover:ring-offset-background"
                                  : color === "orange"
                                    ? "bg-orange-500 hover:ring-2 hover:ring-orange-500 hover:ring-offset-2 hover:ring-offset-background"
                                    : "bg-pink-500 hover:ring-2 hover:ring-pink-500 hover:ring-offset-2 hover:ring-offset-background"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 mr-2" />
                        <h3 className="text-lg font-medium">Email Notifications</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <Bell className="h-5 w-5 mr-2" />
                        <h3 className="text-lg font-medium">Push Notifications</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                    </div>
                    <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 mr-2" />
                        <h3 className="text-lg font-medium">Marketing Emails</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">Receive marketing and promotional emails</p>
                    </div>
                    <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Types</h3>

                  {[
                    { title: "New Comments", description: "When someone comments on your post" },
                    { title: "Mentions", description: "When someone mentions you in a comment" },
                    { title: "Direct Messages", description: "When someone sends you a direct message" },
                    { title: "System Updates", description: "Important updates about the platform" },
                  ].map((notification, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                      </div>
                      <Switch defaultChecked={i < 3} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button className="gradient-bg gradient-bg-hover">Update Password</Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
                  </div>

                  {twoFactorAuth && (
                    <div className="mt-4 p-4 border rounded-lg bg-secondary/50">
                      <h4 className="font-medium mb-2">Setup Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Scan the QR code with your authenticator app or enter the code manually.
                      </p>
                      <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="bg-white p-2 rounded-lg">
                          <div className="h-40 w-40 bg-[url('/placeholder.svg?height=160&width=160')] bg-center bg-no-repeat bg-contain" />
                        </div>
                        <div className="space-y-4 flex-1">
                          <div className="space-y-2">
                            <Label htmlFor="auth-code">Manual Entry Code</Label>
                            <Input id="auth-code" value="ABCD EFGH IJKL MNOP" readOnly className="font-mono" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="verification-code">Verification Code</Label>
                            <Input id="verification-code" placeholder="Enter code from authenticator app" />
                          </div>
                          <Button className="gradient-bg gradient-bg-hover">Verify and Activate</Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Login Sessions</h3>
                  <div className="space-y-3">
                    {[
                      { device: "MacBook Pro", location: "San Francisco, CA", time: "Current session" },
                      { device: "iPhone 13", location: "San Francisco, CA", time: "2 hours ago" },
                      { device: "Windows PC", location: "New York, NY", time: "Yesterday" },
                    ].map((session, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{session.device}</p>
                          <p className="text-sm text-muted-foreground">
                            {session.location} • {session.time}
                          </p>
                        </div>
                        {i === 0 ? (
                          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Current</Badge>
                        ) : (
                          <Button variant="outline" size="sm" className="text-muted-foreground hover:text-foreground">
                            Logout
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="text-muted-foreground hover:text-foreground">
                    Logout of All Devices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

