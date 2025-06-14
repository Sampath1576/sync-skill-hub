
import { useState } from "react"
import { Header } from "@/components/Header"
import { AppSidebar } from "@/components/AppSidebar"
import { FloatingActionButton } from "@/components/FloatingActionButton"
import { NotesHeader } from "@/components/notes/NotesHeader"
import { NotesGrid } from "@/components/notes/NotesGrid"
import { EmptyNotesState } from "@/components/notes/EmptyNotesState"
import { CreateNoteDialog } from "@/components/notes/CreateNoteDialog"
import { Plus } from "lucide-react"
import { useLocalNotes } from "@/hooks/useLocalNotes"

export default function Notes() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newNoteTitle, setNewNoteTitle] = useState("")
  const [newNoteContent, setNewNoteContent] = useState("")
  const [editingNote, setEditingNote] = useState<any>(null)
  
  const { notes, isLoading, createNote, updateNote, deleteNote, toggleFavorite } = useLocalNotes()

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Sort notes: favorites first, then by updated date
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.favorite && !b.favorite) return -1
    if (!a.favorite && b.favorite) return 1
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  })

  const editNote = (note: any) => {
    setEditingNote(note)
    setNewNoteTitle(note.title)
    setNewNoteContent(note.content)
    setIsDialogOpen(true)
  }

  const saveNote = async () => {
    if (!newNoteTitle.trim()) return

    if (editingNote) {
      await updateNote(editingNote.id, newNoteTitle, newNoteContent)
    } else {
      await createNote(newNoteTitle, newNoteContent)
    }

    setIsDialogOpen(false)
    setNewNoteTitle("")
    setNewNoteContent("")
    setEditingNote(null)
  }

  const openNewNoteDialog = () => {
    setEditingNote(null)
    setNewNoteTitle("")
    setNewNoteContent("")
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setNewNoteTitle("")
    setNewNoteContent("")
    setEditingNote(null)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-48 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-48 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="animate-fade-in">
            <NotesHeader
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              notes={notes}
              onCreateNote={openNewNoteDialog}
            />

            {sortedNotes.length > 0 ? (
              <NotesGrid
                notes={sortedNotes}
                onEdit={editNote}
                onDelete={deleteNote}
                onToggleFavorite={toggleFavorite}
              />
            ) : (
              <EmptyNotesState
                searchTerm={searchTerm}
                onCreateNote={openNewNoteDialog}
              />
            )}
          </div>
        </main>
      </div>

      <CreateNoteDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        title={newNoteTitle}
        content={newNoteContent}
        setTitle={setNewNoteTitle}
        setContent={setNewNoteContent}
        onSave={saveNote}
        editingNote={editingNote}
      />

      <FloatingActionButton 
        onClick={openNewNoteDialog}
        icon={<Plus className="h-6 w-6" />}
        ariaLabel="Create new note"
      />
    </div>
  )
}
