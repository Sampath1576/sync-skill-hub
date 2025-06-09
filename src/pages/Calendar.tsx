
import { Header } from "@/components/Header"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar as CalendarIcon, Plus, Clock, Users, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const { toast } = useToast()
  const [events, setEvents] = useState([
    { id: 1, title: "Team Meeting", time: "10:00 AM", date: "Today", attendees: 5, description: "Weekly team standup" },
    { id: 2, title: "Project Review", time: "2:00 PM", date: "Today", attendees: 3, description: "Q3 project review" },
    { id: 3, title: "Client Call", time: "9:00 AM", date: "Tomorrow", attendees: 2, description: "Monthly client check-in" },
  ])
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<any>(null)
  const [newEvent, setNewEvent] = useState({
    title: "",
    time: "",
    date: "",
    attendees: 1,
    description: ""
  })

  const addEvent = () => {
    if (!newEvent.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter an event title",
        variant: "destructive"
      })
      return
    }

    const event = {
      id: Date.now(),
      ...newEvent,
      attendees: Number(newEvent.attendees)
    }

    setEvents([...events, event])
    setNewEvent({ title: "", time: "", date: "", attendees: 1, description: "" })
    setIsAddEventOpen(false)
    
    toast({
      title: "Event Added",
      description: `"${event.title}" has been added to your calendar`,
    })
  }

  const editEvent = (event: any) => {
    setEditingEvent(event)
    setNewEvent({
      title: event.title,
      time: event.time,
      date: event.date,
      attendees: event.attendees,
      description: event.description
    })
  }

  const updateEvent = () => {
    if (!newEvent.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter an event title",
        variant: "destructive"
      })
      return
    }

    setEvents(events.map(event => 
      event.id === editingEvent.id 
        ? { ...event, ...newEvent, attendees: Number(newEvent.attendees) }
        : event
    ))
    
    setEditingEvent(null)
    setNewEvent({ title: "", time: "", date: "", attendees: 1, description: "" })
    
    toast({
      title: "Event Updated",
      description: "Event has been successfully updated",
    })
  }

  const deleteEvent = (eventId: number) => {
    setEvents(events.filter(event => event.id !== eventId))
    toast({
      title: "Event Deleted",
      description: "Event has been removed from your calendar",
    })
  }

  const EventDialog = ({ trigger, isEdit = false }: { trigger: React.ReactNode, isEdit?: boolean }) => (
    <Dialog open={isEdit ? !!editingEvent : isAddEventOpen} onOpenChange={isEdit ? () => setEditingEvent(null) : setIsAddEventOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Event" : "Add New Event"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              placeholder="Enter event title"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                placeholder="e.g., 10:00 AM"
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                placeholder="e.g., Today"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="attendees">Number of Attendees</Label>
            <Input
              id="attendees"
              type="number"
              min="1"
              value={newEvent.attendees}
              onChange={(e) => setNewEvent({ ...newEvent, attendees: parseInt(e.target.value) || 1 })}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              placeholder="Event description (optional)"
            />
          </div>
          <Button onClick={isEdit ? updateEvent : addEvent} className="w-full">
            {isEdit ? "Update Event" : "Add Event"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )

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
              <EventDialog 
                trigger={
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Event
                  </Button>
                }
              />
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
                    onSelect={(newDate) => {
                      setDate(newDate)
                      toast({
                        title: "Date Selected",
                        description: `Selected ${newDate?.toDateString()}`,
                      })
                    }}
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
                  {events.map((event) => (
                    <div key={event.id} className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-muted-foreground">{event.time} • {event.date}</p>
                          <div className="flex items-center gap-1 mt-2">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{event.attendees} attendees</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <EventDialog
                            trigger={
                              <Button variant="ghost" size="sm" onClick={() => editEvent(event)}>
                                <Edit className="h-3 w-3" />
                              </Button>
                            }
                            isEdit={true}
                          />
                          <Button variant="ghost" size="sm" onClick={() => deleteEvent(event.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
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
