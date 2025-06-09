
import { useState } from "react"
import { Header } from "@/components/Header"
import { AppSidebar } from "@/components/AppSidebar"
import { FloatingActionButton } from "@/components/FloatingActionButton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Trash2, Search, Plus, Star } from "lucide-react"

export default function Notes() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const notes = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      content: "Variables, functions, loops, and conditionals. ES6 features including arrow functions, destructuring...",
      tags: ["coding", "javascript", "web-dev"],
      lastModified: "2 hours ago",
      favorite: true
    },
    {
      id: 2,
      title: "Machine Learning Basics",
      content: "Introduction to ML concepts: supervised learning, unsupervised learning, neural networks...",
      tags: ["ai", "python", "data-science"],
      lastModified: "5 hours ago",
      favorite: false
    },
    {
      id: 3,
      title: "Project Planning Methods",
      content: "Agile vs Waterfall, sprint planning, user stories, estimation techniques...",
      tags: ["productivity", "planning", "agile"],
      lastModified: "1 day ago",
      favorite: true
    },
    {
      id: 4,
      title: "CSS Grid Layout",
      content: "Grid container, grid items, fr units, grid-template-areas, responsive grids...",
      tags: ["css", "web-dev", "layout"],
      lastModified: "2 days ago",
      favorite: false
    },
    {
      id: 5,
      title: "Database Design Principles",
      content: "Normalization, relationships, indexing, performance optimization...",
      tags: ["database", "sql", "backend"],
      lastModified: "3 days ago",
      favorite: false
    }
  ]

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note, index) => (
                <Card 
                  key={note.id} 
                  className="card-hover animate-scale-in cursor-pointer group" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg leading-tight">{note.title}</h3>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Star className={`h-4 w-4 ${note.favorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {note.content}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {note.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Last modified {note.lastModified}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredNotes.length === 0 && (
              <div className="text-center py-12 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No notes found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? `No notes match "${searchTerm}"` : "Start by creating your first note!"}
                </p>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Note
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Note</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input placeholder="Note title..." />
                      <Textarea 
                        placeholder="Start writing your note..." 
                        className="min-h-[300px]"
                      />
                      <Input placeholder="Add tags (comma separated)..." />
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setIsDialogOpen(false)}>
                          Save Note
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </main>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Note title..." />
            <Textarea 
              placeholder="Start writing your note..." 
              className="min-h-[300px]"
            />
            <Input placeholder="Add tags (comma separated)..." />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                Save Note
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <FloatingActionButton 
        onClick={() => setIsDialogOpen(true)}
        icon={<Plus className="h-6 w-6" />}
      />
    </div>
  )
}
