
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface Note {
  id: string
  title: string
  content: string
  favorite: boolean
  updated_at: string
}

interface RecentNotesProps {
  notes: Note[]
}

export function RecentNotes({ notes }: RecentNotesProps) {
  const navigate = useNavigate()

  return (
    <Card className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Recent Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notes.length > 0 ? (
          <>
            {notes.slice(0, 3).map((note) => (
              <div key={note.id} className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => navigate("/notes")}>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{note.title}</h4>
                  {note.favorite && <span className="text-yellow-500">⭐</span>}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{note.content}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Last modified {new Date(note.updated_at).toLocaleDateString()}
                </p>
              </div>
            ))}
            {notes.length > 3 && (
              <Button variant="outline" className="w-full" onClick={() => navigate("/notes")}>
                View All {notes.length} Notes
              </Button>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No notes yet</h3>
            <p className="text-muted-foreground mb-4">Create your first note to get started with organizing your thoughts.</p>
            <Button onClick={() => navigate("/notes")} className="gap-2">
              <Plus className="h-4 w-4" />
              Create First Note
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
