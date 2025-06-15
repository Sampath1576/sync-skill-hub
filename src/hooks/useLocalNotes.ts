
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface Note {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  favorite?: boolean
}

export function useLocalNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load notes from localStorage on mount
  useEffect(() => {
    const loadNotes = () => {
      try {
        const storedNotes = localStorage.getItem('skillsync_notes')
        if (storedNotes) {
          setNotes(JSON.parse(storedNotes))
        } else {
          // Initialize with sample notes for first-time users
          const sampleNotes: Note[] = [
            {
              id: '1',
              title: 'Welcome to SkillSync! 📚',
              content: 'This is a sample note to get you started. You can edit or delete this note and create your own. Notes are perfect for capturing ideas, meeting summaries, or study materials.',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              favorite: true
            },
            {
              id: '2',
              title: 'Getting Started Guide',
              content: 'Here are some tips to maximize your productivity:\n\n1. Use the Tasks section to track your to-dos\n2. Schedule events in the Calendar\n3. Check your Progress to see how you\'re doing\n4. Visit AI Tips for personalized suggestions\n\nFeel free to customize this note or delete it when you\'re ready!',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              favorite: false
            },
            {
              id: '3',
              title: 'Study Techniques',
              content: 'Effective study methods:\n\n• Pomodoro Technique: 25 min focus + 5 min break\n• Active recall: Test yourself instead of re-reading\n• Spaced repetition: Review material at increasing intervals\n• Take handwritten notes for better retention\n\nThis is sample content - replace with your own study notes!',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              favorite: false
            }
          ]
          setNotes(sampleNotes)
          localStorage.setItem('skillsync_notes', JSON.stringify(sampleNotes))
        }
      } catch (error) {
        console.error('Error loading notes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadNotes()
  }, [])

  const saveNotesToStorage = (updatedNotes: Note[]) => {
    localStorage.setItem('skillsync_notes', JSON.stringify(updatedNotes))
    setNotes(updatedNotes)
  }

  const createNote = async (title: string, content: string) => {
    try {
      const newNote: Note = {
        id: Date.now().toString(),
        title,
        content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        favorite: false
      }
      
      const updatedNotes = [newNote, ...notes]
      saveNotesToStorage(updatedNotes)
      
      toast({
        title: "Note created",
        description: `"${title}" has been created`,
      })
      return newNote
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
      const updatedNotes = notes.map(note => 
        note.id === id 
          ? { ...note, title, content, updated_at: new Date().toISOString() }
          : note
      )
      saveNotesToStorage(updatedNotes)
      
      toast({
        title: "Note updated",
        description: `"${title}" has been updated`,
      })
      return updatedNotes.find(note => note.id === id)
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
      const updatedNotes = notes.map(note => 
        note.id === id 
          ? { ...note, favorite: !note.favorite, updated_at: new Date().toISOString() }
          : note
      )
      saveNotesToStorage(updatedNotes)
      
      const note = updatedNotes.find(n => n.id === id)
      toast({
        title: note?.favorite ? "Added to favorites" : "Removed from favorites",
        description: `"${note?.title}" has been ${note?.favorite ? 'added to' : 'removed from'} favorites`,
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
      const updatedNotes = notes.filter(note => note.id !== id)
      saveNotesToStorage(updatedNotes)
      
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
