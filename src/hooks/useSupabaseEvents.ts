
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface Event {
  id: string
  title: string
  description: string
  event_date: string
  event_time: string
  attendees: number
  created_at: string
  updated_at: string
  user_id: string
}

export function useSupabaseEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load events from Supabase
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setIsLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('event_date', { ascending: true })

        if (error) {
          console.error('Error loading events:', error)
          toast({
            title: "Error",
            description: "Failed to load events",
            variant: "destructive"
          })
        } else {
          setEvents(data || [])
        }
      } catch (error) {
        console.error('Error loading events:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadEvents()
  }, [toast])

  const createEvent = async (eventData: {
    title: string
    description: string
    event_date: string
    event_time: string
    attendees: number
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create events",
          variant: "destructive"
        })
        return
      }

      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            ...eventData,
            user_id: user.id
          }
        ])
        .select()
        .single()

      if (error) {
        console.error('Error creating event:', error)
        toast({
          title: "Error",
          description: "Failed to create event",
          variant: "destructive"
        })
        return
      }

      setEvents(prev => [...prev, data].sort((a, b) => 
        new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
      ))
      
      toast({
        title: "Event created",
        description: `"${eventData.title}" has been scheduled`,
      })
      return data
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
      const { data, error } = await supabase
        .from('events')
        .update({
          ...eventData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating event:', error)
        toast({
          title: "Error",
          description: "Failed to update event",
          variant: "destructive"
        })
        return
      }

      setEvents(prev => prev.map(event => 
        event.id === id ? data : event
      ).sort((a, b) => 
        new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
      ))
      
      toast({
        title: "Event updated",
        description: "Event has been successfully updated",
      })
      return data
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
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting event:', error)
        toast({
          title: "Error",
          description: "Failed to delete event",
          variant: "destructive"
        })
        return
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
