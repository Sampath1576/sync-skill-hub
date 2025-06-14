
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface Event {
  id: string
  title: string
  description: string
  event_date: string
  event_time: string
  attendees: number
  created_at: string
}

export function useLocalEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load events from localStorage on mount
  useEffect(() => {
    const loadEvents = () => {
      try {
        const storedEvents = localStorage.getItem('skillsync_events')
        if (storedEvents) {
          setEvents(JSON.parse(storedEvents))
        } else {
          // Initialize with sample events for first-time users
          const tomorrow = new Date()
          tomorrow.setDate(tomorrow.getDate() + 1)
          const dayAfterTomorrow = new Date()
          dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 3)
          
          const sampleEvents: Event[] = [
            {
              id: '1',
              title: 'SkillSync Orientation',
              description: 'Get familiar with all the features and capabilities of SkillSync',
              event_date: tomorrow.toISOString().split('T')[0],
              event_time: '10:00',
              attendees: 1,
              created_at: new Date().toISOString()
            },
            {
              id: '2',
              title: 'Weekly Planning Session',
              description: 'Plan your goals and tasks for the upcoming week',
              event_date: dayAfterTomorrow.toISOString().split('T')[0],
              event_time: '14:00',
              attendees: 1,
              created_at: new Date().toISOString()
            }
          ]
          setEvents(sampleEvents)
          localStorage.setItem('skillsync_events', JSON.stringify(sampleEvents))
        }
      } catch (error) {
        console.error('Error loading events:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadEvents()
  }, [])

  const saveEventsToStorage = (updatedEvents: Event[]) => {
    localStorage.setItem('skillsync_events', JSON.stringify(updatedEvents))
    setEvents(updatedEvents)
  }

  const createEvent = async (eventData: {
    title: string
    description: string
    event_date: string
    event_time: string
    attendees: number
  }) => {
    try {
      const newEvent: Event = {
        id: Date.now().toString(),
        ...eventData,
        created_at: new Date().toISOString()
      }
      
      const updatedEvents = [...events, newEvent].sort((a, b) => 
        new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
      )
      saveEventsToStorage(updatedEvents)
      
      toast({
        title: "Event created",
        description: `"${eventData.title}" has been scheduled`,
      })
      return newEvent
    } catch (error: any) {
      console.error('Error creating event:', error)
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive"
      })
    }
  }

  const updateEvent = async (id: string, eventData: {
    title: string
    description: string
    event_date: string
    event_time: string
    attendees: number
  }) => {
    try {
      const updatedEvents = events.map(event => 
        event.id === id 
          ? { ...event, ...eventData }
          : event
      ).sort((a, b) => 
        new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
      )
      saveEventsToStorage(updatedEvents)
      
      toast({
        title: "Event updated",
        description: "Event has been successfully updated",
      })
      return updatedEvents.find(event => event.id === id)
    } catch (error: any) {
      console.error('Error updating event:', error)
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive"
      })
    }
  }

  const deleteEvent = async (id: string) => {
    try {
      const updatedEvents = events.filter(event => event.id !== id)
      saveEventsToStorage(updatedEvents)
      
      toast({
        title: "Event deleted",
        description: "Event has been removed from your calendar",
      })
    } catch (error: any) {
      console.error('Error deleting event:', error)
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive"
      })
    }
  }

  return {
    events,
    isLoading,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: () => {}
  }
}
