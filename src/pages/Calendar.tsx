
import { Header } from "@/components/Header"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar as CalendarIcon, Plus, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const { toast } = useToast()

  const upcomingEvents = [
    { title: "Team Meeting", time: "10:00 AM", date: "Today", attendees: 5 },
    { title: "Project Review", time: "2:00 PM", date: "Today", attendees: 3 },
    { title: "Client Call", time: "9:00 AM", date: "Tomorrow", attendees: 2 },
  ]

  const addEvent = () => {
    toast({
      title: "Add Event",
      description: "Event creation dialog would open here",
    })
    console.log("Add event clicked")
  }

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">Calendar</h1>
                <p className="text-muted-foreground mt-1">Manage your schedule and events</p>
              </div>
              <Button className="gap-2" onClick={addEvent}>
                <Plus className="h-4 w-4" />
                Add Event
              </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Calendar Widget */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">{event.time} • {event.date}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{event.attendees} attendees</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
