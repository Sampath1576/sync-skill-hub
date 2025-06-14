
import { useState, useEffect } from "react"
import { useUser } from "@clerk/clerk-react"
import { useStockData } from "@/contexts/StockDataContext"
import { useToast } from "@/hooks/use-toast"

interface Note {
  id: string
  title: string
  content: string
  favorite: boolean
  created_at: string
  updated_at: string
}

export function useLocalNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useUser()
  const { isUsingStockData, stockData, updateStockData } = useStockData()
  const { toast } = useToast()

  const getUserStorageKey = () => {
    return user ? `skillsync_notes_${user.id}` : 'skillsync_notes_guest'
  }

  const loadNotes = () => {
    if (!user) {
      setIsLoading(false)
      return
    }

    if (isUsingStockData) {
      setNotes(stockData.notes)
    } else {
      const storageKey = getUserStorageKey()
      const savedNotes = localStorage.getItem(storageKey)
      
      if (savedNotes) {
        try {
          const parsedNotes = JSON.parse(savedNotes)
          setNotes(parsedNotes)
        } catch (error) {
          console.error('Error parsing saved notes:', error)
          setNotes([])
        }
      } else {
        // Initialize with empty array for new users
        setNotes([])
      }
    }
    setIsLoading(false)
  }

  const saveNotes = (updatedNotes: Note[]) => {
    if (!user) return

    if (isUsingStockData) {
      updateStockData({ notes: updatedNotes })
    } else {
      const storageKey = getUserStorageKey()
      localStorage.setItem(storageKey, JSON.stringify(updatedNotes))
    }
  }

  const createNote = async (title: string, content: string) => {
    if (!user) return

    const newNote: Note = {
      id: crypto.randomUUID(),
      title,
      content,
      favorite: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const updatedNotes = [newNote, ...notes]
    setNotes(updatedNotes)
    saveNotes(updatedNotes)

    toast({
      title: "Note created",
      description: `"${title}" has been created`,
    })
    return newNote
  }

  const updateNote = async (id: string, title: string, content: string) => {
    const updatedNotes = notes.map(note =>
      note.id === id
        ? { ...note, title, content, updated_at: new Date().toISOString() }
        : note
    )
    setNotes(updatedNotes)
    saveNotes(updatedNotes)

    toast({
      title: "Note updated",
      description: `"${title}" has been updated`,
    })
  }

  const deleteNote = async (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id)
    setNotes(updatedNotes)
    saveNotes(updatedNotes)

    toast({
      title: "Note deleted",
      description: "Note has been deleted",
      variant: "destructive"
    })
  }

  const toggleFavorite = async (id: string) => {
    const updatedNotes = notes.map(note =>
      note.id === id
        ? { ...note, favorite: !note.favorite, updated_at: new Date().toISOString() }
        : note
    )
    setNotes(updatedNotes)
    saveNotes(updatedNotes)
  }

  useEffect(() => {
    loadNotes()
  }, [user, isUsingStockData, stockData])

  return {
    notes,
    isLoading,
    createNote,
    updateNote,
    deleteNote,
    toggleFavorite,
    refetch: loadNotes
  }
}
