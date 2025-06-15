
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface Note {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  favorite?: boolean
  user_id: string
}

export function useSupabaseNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load notes from Supabase
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setIsLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .order('updated_at', { ascending: false })

        if (error) {
          console.error('Error loading notes:', error)
          toast({
            title: "Error",
            description: "Failed to load notes",
            variant: "destructive"
          })
        } else {
          // Transform the data to ensure favorite field exists
          const transformedNotes = (data || []).map(note => ({
            ...note,
            favorite: (note as any).favorite || false
          }))
          setNotes(transformedNotes)
        }
      } catch (error) {
        console.error('Error loading notes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadNotes()
  }, [toast])

  const createNote = async (title: string, content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create notes",
          variant: "destructive"
        })
        return
      }

      const { data, error } = await supabase
        .from('notes')
        .insert([
          {
            title,
            content,
            user_id: user.id,
            favorite: false
          }
        ])
        .select()
        .single()

      if (error) {
        console.error('Error creating note:', error)
        toast({
          title: "Error",
          description: "Failed to create note",
          variant: "destructive"
        })
        return
      }

      setNotes(prev => [{...data, favorite: (data as any).favorite || false}, ...prev])
      
      toast({
        title: "Note created",
        description: `"${title}" has been created`,
      })
      return data
    } catch (error: any) {
      console.error('Error creating note:', error)
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive"
      })
    }
  }

  const updateNote = async (id: string, title: string, content: string) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .update({ title, content, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating note:', error)
        toast({
          title: "Error",
          description: "Failed to update note",
          variant: "destructive"
        })
        return
      }

      setNotes(prev => prev.map(note => 
        note.id === id ? {...data, favorite: (data as any).favorite || false} : note
      ))
      
      toast({
        title: "Note updated",
        description: `"${title}" has been updated`,
      })
      return data
    } catch (error: any) {
      console.error('Error updating note:', error)
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive"
      })
    }
  }

  const toggleFavorite = async (id: string) => {
    try {
      const note = notes.find(n => n.id === id)
      if (!note) return

      const { data, error } = await supabase
        .from('notes')
        .update({ favorite: !note.favorite, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error toggling favorite:', error)
        toast({
          title: "Error",
          description: "Failed to update favorite status",
          variant: "destructive"
        })
        return
      }

      setNotes(prev => prev.map(n => 
        n.id === id ? {...data, favorite: (data as any).favorite || false} : n
      ))
      
      const favoriteStatus = (data as any).favorite || false
      toast({
        title: favoriteStatus ? "Added to favorites" : "Removed from favorites",
        description: `"${data.title}" has been ${favoriteStatus ? 'added to' : 'removed from'} favorites`,
      })
    } catch (error: any) {
      console.error('Error toggling favorite:', error)
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive"
      })
    }
  }

  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting note:', error)
        toast({
          title: "Error",
          description: "Failed to delete note",
          variant: "destructive"
        })
        return
      }

      setNotes(prev => prev.filter(note => note.id !== id))
      
      toast({
        title: "Note deleted",
        description: "Note has been deleted",
        variant: "destructive"
      })
    } catch (error: any) {
      console.error('Error deleting note:', error)
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive"
      })
    }
  }

  return {
    notes,
    isLoading,
    createNote,
    updateNote,
    deleteNote,
    toggleFavorite,
    refetch: () => {}
  }
}
