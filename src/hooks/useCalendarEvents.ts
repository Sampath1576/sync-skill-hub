
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Event } from "@/types/calendar"

const INITIAL_EVENTS: Event[] = [
  { id: 1, title: "Team Meeting", time: "10:00 AM", date: "Today", attendees: 5, description: "Weekly team standup" },
  { id: 2, title: "Project Review", time: "2:00 PM", date: "Today", attendees: 3, description: "Q3 project review" },
  { id: 3, title: "Client Call", time: "9:00 AM", date: "Tomorrow", attendees: 2, description: "Monthly client check-in" },
]

export function useCalendarEvents() {
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS)
  const { toast } = useToast()

  const addEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      id: Date.now(),
      ...eventData,
      attendees: Number(eventData.attendees)
    }

    setEvents(prev => [...prev, newEvent])
    
    toast({
      title: "Event Added",
      description: `"${newEvent.title}" has been added to your calendar`,
    })
  }

  const updateEvent = (eventId: number, eventData: Omit<Event, 'id'>) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, ...eventData, attendees: Number(eventData.attendees) }
        : event
    ))
    
    toast({
      title: "Event Updated",
      description: "Event has been successfully updated",
    })
  }

  const deleteEvent = (eventId: number) => {
    setEvents(prev => prev.filter(event => event.id !== eventId))
    toast({
      title: "Event Deleted",
      description: "Event has been removed from your calendar",
    })
  }

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent
  }
}
