
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useUser } from "@clerk/clerk-react"
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

export function useSupabaseEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useUser()
  const { toast } = useToast()

  const fetchEvents = async () => {
    if (!user) {
      setIsLoading(false)
      return
    }

    try {
      console.log('Fetching events for user:', user.id)
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('event_date', { ascending: true })

      if (error) {
        console.error('Error fetching events:', error)
        throw error
      }
      
      console.log('Events fetched:', data?.length || 0)
      setEvents(data || [])
    } catch (error: any) {
      console.error('Error fetching events:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to load events",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
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

    try {
      console.log('Creating event for user:', user.id)
      const { data, error } = await supabase
        .from('events')
        .insert([{
          user_id: user.id,
          ...eventData
        }])
        .select()
        .single()

      if (error) {
        console.error('Error creating event:', error)
        throw error
      }
      
      setEvents(prev => [...prev, data])
      toast({
        title: "Event created",
        description: `"${eventData.title}" has been scheduled`,
      })
      return data
    } catch (error: any) {
      console.error('Error creating event:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to create event",
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
      console.log('Updating event:', id)
      const { data, error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating event:', error)
        throw error
      }

      setEvents(prev => prev.map(event => event.id === id ? data : event))
      toast({
        title: "Event updated",
        description: "Event has been successfully updated",
      })
      return data
    } catch (error: any) {
      console.error('Error updating event:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to update event",
        variant: "destructive"
      })
    }
  }

  const deleteEvent = async (id: string) => {
    try {
      console.log('Deleting event:', id)
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) {
        console.error('Error deleting event:', error)
        throw error
      }

      setEvents(prev => prev.filter(event => event.id !== id))
      toast({
        title: "Event deleted",
        description: "Event has been removed from your calendar",
      })
    } catch (error: any) {
      console.error('Error deleting event:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete event",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    if (user) {
      fetchEvents()
    }
  }, [user])

  return {
    events,
    isLoading,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents
  }
}
