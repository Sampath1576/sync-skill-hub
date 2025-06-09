
import { Header } from "@/components/Header"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function Settings() {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    tasks: true,
    reminders: true,
  })

  const saveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile changes have been saved successfully",
    })
    console.log("Profile saved")
  }

  const exportData = () => {
    toast({
      title: "Data Export",
      description: "Your data export will be ready shortly",
    })
    console.log("Data export initiated")
  }

  const updateNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
    toast({
      title: "Notification Settings Updated",
      description: `${key} notifications ${notifications[key] ? 'disabled' : 'enabled'}`,
    })
  }

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="animate-fade-in max-w-4xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground mt-1">Manage your account and application preferences</p>
            </div>

            <div className="grid gap-6">
              {/* Profile Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder.svg" alt="Profile" />
                      <AvatarFallback className="text-lg">JD</AvatarFallback>
                    </Avatar>
                    <Button variant="outline">Change Avatar</Button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john@example.com" />
                  </div>
                  
                  <Button onClick={saveProfile}>Save Changes</Button>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive email updates about your activity</p>
                    </div>
                    <Switch 
                      id="email-notifications"
                      checked={notifications.email}
                      onCheckedChange={() => updateNotification('email')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                    </div>
                    <Switch 
                      id="push-notifications"
                      checked={notifications.push}
                      onCheckedChange={() => updateNotification('push')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="task-notifications">Task Reminders</Label>
                      <p className="text-sm text-muted-foreground">Get notified about upcoming task deadlines</p>
                    </div>
                    <Switch 
                      id="task-notifications"
                      checked={notifications.tasks}
                      onCheckedChange={() => updateNotification('tasks')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="reminder-notifications">Calendar Reminders</Label>
                      <p className="text-sm text-muted-foreground">Receive reminders for calendar events</p>
                    </div>
                    <Switch 
                      id="reminder-notifications"
                      checked={notifications.reminders}
                      onCheckedChange={() => updateNotification('reminders')}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Security */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                  
                  <Button variant="outline">Update Password</Button>
                </CardContent>
              </Card>

              {/* Data & Privacy */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Data & Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Export Your Data</h4>
                      <p className="text-sm text-muted-foreground">Download a copy of all your data</p>
                    </div>
                    <Button variant="outline" onClick={exportData}>Export</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Delete Account</h4>
                      <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive">Delete</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
