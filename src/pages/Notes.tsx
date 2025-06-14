
import { useState } from "react"
import { Header } from "@/components/Header"
import { AppSidebar } from "@/components/AppSidebar"
import { FloatingActionButton } from "@/components/FloatingActionButton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Trash2, Search, Plus, Star, Download } from "lucide-react"
import { useLocalNotes } from "@/hooks/useLocalNotes"
import { useToast } from "@/hooks/use-toast"
import { exportToPDF } from "@/utils/pdfExport"
import { useUser } from "@/contexts/UserContext"

export default function Notes() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newNoteTitle, setNewNoteTitle] = useState("")
  const [newNoteContent, setNewNoteContent] = useState("")
  const [editingNote, setEditingNote] = useState<any>(null)
  const [isExporting, setIsExporting] = useState(false)
  
  const { notes, isLoading, createNote, updateNote, deleteNote, toggleFavorite } = useLocalNotes()
  const { toast } = useToast()
  const { user } = useUser()

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

  const exportNotes = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "User information not available",
        variant: "destructive"
      })
      return
    }

    setIsExporting(true)
    toast({
      title: "Exporting Notes",
      description: "Generating PDF with all your notes...",
    })
    
    try {
      await exportToPDF({
        profile: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username
        },
        notes: notes,
        exportDate: new Date().toISOString()
      })
      
      setIsExporting(false)
      toast({
        title: "Export Complete",
        description: "Your notes have been downloaded as PDF",
      })
    } catch (error) {
      setIsExporting(false)
      toast({
        title: "Export Failed",
        description: "There was an error exporting your notes",
        variant: "destructive"
      })
    }
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
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">Notes</h1>
                <p className="text-muted-foreground mt-1">Organize and search your knowledge base</p>
              </div>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  className="gap-2" 
                  onClick={exportNotes}
                  disabled={isExporting}
                >
                  <Download className="h-4 w-4" />
                  {isExporting ? 'Exporting...' : 'Export PDF'}
                </Button>
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedNotes.map((note, index) => (
                <Card 
                  key={note.id} 
                  className={`card-hover animate-scale-in cursor-pointer group ${note.favorite ? 'ring-2 ring-yellow-400 bg-yellow-50' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg leading-tight flex items-center gap-2">
                        {note.title}
                        {note.favorite && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                      </h3>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(note.id)
                          }}
                        >
                          <Star className={`h-4 w-4 ${note.favorite ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            editNote(note)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNote(note.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {note.content}
                    </p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>
                        Created {new Date(note.created_at).toLocaleDateString()}
                      </span>
                      <span className="font-medium">
                        Modified {new Date(note.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {sortedNotes.length === 0 && (
              <div className="text-center py-12 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No notes found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? `No notes match "${searchTerm}"` : "Start by creating your first note!"}
                </p>
                <Button onClick={openNewNoteDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Note
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingNote ? "Edit Note" : "Create New Note"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input 
              placeholder="Note title..." 
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
            />
            <Textarea 
              placeholder="Start writing your note..." 
              className="min-h-[300px]"
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveNote}>
                {editingNote ? "Update Note" : "Save Note"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <FloatingActionButton 
        onClick={openNewNoteDialog}
        icon={<Plus className="h-6 w-6" />}
        ariaLabel="Create new note"
      />
    </div>
  )
}
