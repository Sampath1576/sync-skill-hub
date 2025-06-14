
import { useState, useEffect } from "react"
import { useUser } from "@clerk/clerk-react"
import { useStockData } from "@/contexts/StockDataContext"
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
  const { user } = useUser()
  const { isUsingStockData, stockData, updateStockData } = useStockData()
  const { toast } = useToast()

  const getUserStorageKey = () => {
    return user ? `skillsync_events_${user.id}` : 'skillsync_events_guest'
  }

  const loadEvents = () => {
    if (!user) {
      setIsLoading(false)
      return
    }

    if (isUsingStockData) {
      setEvents(stockData.events)
    } else {
      const storageKey = getUserStorageKey()
      const savedEvents = localStorage.getItem(storageKey)
      
      if (savedEvents) {
        try {
          const parsedEvents = JSON.parse(savedEvents)
          setEvents(parsedEvents)
        } catch (error) {
          console.error('Error parsing saved events:', error)
          setEvents([])
        }
      } else {
        // Initialize with empty array for new users
        setEvents([])
      }
    }
    setIsLoading(false)
  }

  const saveEvents = (updatedEvents: Event[]) => {
    if (!user) return

    if (isUsingStockData) {
      updateStockData({ events: updatedEvents })
    } else {
      const storageKey = getUserStorageKey()
      localStorage.setItem(storageKey, JSON.stringify(updatedEvents))
    }
  }

  const createEvent = async (eventData: {
    title: string
    description: string
    event_date: string
    event_time: string
    attendees: number
  }) => {
    if (!user) return

    const newEvent: Event = {
      id: crypto.randomUUID(),
      title: eventData.title,
      description: eventData.description,
      event_date: eventData.event_date,
      event_time: eventData.event_time,
      attendees: eventData.attendees,
      created_at: new Date().toISOString(),
    }

    const updatedEvents = [newEvent, ...events]
    setEvents(updatedEvents)
    saveEvents(updatedEvents)

    toast({
      title: "Event created",
      description: `"${eventData.title}" has been scheduled`,
    })
    return newEvent
  }

  const updateEvent = async (id: string, eventData: {
    title: string
    description: string
    event_date: string
    event_time: string
    attendees: number
  }) => {
    const updatedEvents = events.map(event =>
      event.id === id ? { ...event, ...eventData } : event
    )
    setEvents(updatedEvents)
    saveEvents(updatedEvents)

    toast({
      title: "Event updated",
      description: "Event has been successfully updated",
    })
  }

  const deleteEvent = async (id: string) => {
    const updatedEvents = events.filter(event => event.id !== id)
    setEvents(updatedEvents)
    saveEvents(updatedEvents)

    toast({
      title: "Event deleted",
      description: "Event has been removed from your calendar",
    })
  }

  useEffect(() => {
    loadEvents()
  }, [user, isUsingStockData, stockData])

  return {
    events,
    isLoading,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: loadEvents
  }
}
