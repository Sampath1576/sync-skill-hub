
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Bell } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function NotificationSettings() {
  const { toast } = useToast()
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    tasks: true,
    reminders: true,
  })

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
  )
}
