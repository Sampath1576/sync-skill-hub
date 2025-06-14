
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useUser } from "@clerk/clerk-react"
import { useToast } from "@/hooks/use-toast"

interface Note {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

export function useSupabaseNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useUser()
  const { toast } = useToast()

  const fetchNotes = async () => {
    if (!user) {
      setIsLoading(false)
      return
    }

    try {
      console.log('Fetching notes for user:', user.id)
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (error) {
        console.error('Error fetching notes:', error)
        throw error
      }
      
      console.log('Notes fetched:', data?.length || 0)
      setNotes(data || [])
      
      // Show welcome message for new users with sample data
      if (data && data.length > 0 && data.some(note => note.title.includes('Welcome to SkillSync'))) {
        const hasWelcomeNote = data.find(note => note.title.includes('Welcome to SkillSync'))
        if (hasWelcomeNote) {
          toast({
            title: "Welcome to SkillSync! 🎉",
            description: "We've added some sample notes to help you get started. Feel free to edit or delete them and add your own content.",
          })
        }
      }
    } catch (error: any) {
      console.error('Error fetching notes:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to load notes",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createNote = async (title: string, content: string) => {
    if (!user) return

    try {
      console.log('Creating note for user:', user.id)
      const { data, error } = await supabase
        .from('notes')
        .insert([{
          user_id: user.id,
          title,
          content
        }])
        .select()
        .single()

      if (error) {
        console.error('Error creating note:', error)
        throw error
      }
      
      setNotes(prev => [data, ...prev])
      toast({
        title: "Note created",
        description: `"${title}" has been created`,
      })
      return data
    } catch (error: any) {
      console.error('Error creating note:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to create note",
        variant: "destructive"
      })
    }
  }

  const updateNote = async (id: string, title: string, content: string) => {
    try {
      console.log('Updating note:', id)
      const { data, error } = await supabase
        .from('notes')
        .update({ title, content, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating note:', error)
        throw error
      }

      setNotes(prev => prev.map(note => note.id === id ? data : note))
      toast({
        title: "Note updated",
        description: `"${title}" has been updated`,
      })
      return data
    } catch (error: any) {
      console.error('Error updating note:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to update note",
        variant: "destructive"
      })
    }
  }

  const deleteNote = async (id: string) => {
    try {
      console.log('Deleting note:', id)
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) {
        console.error('Error deleting note:', error)
        throw error
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
        description: error.message || "Failed to delete note",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    if (user) {
      fetchNotes()
    }
  }, [user])

  return {
    notes,
    isLoading,
    createNote,
    updateNote,
    deleteNote,
    refetch: fetchNotes
  }
}
