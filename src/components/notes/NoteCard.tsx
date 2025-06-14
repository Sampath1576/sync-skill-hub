
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Star } from "lucide-react"

interface NoteCardProps {
  note: {
    id: string
    title: string
    content: string
    created_at: string
    updated_at: string
    favorite?: boolean
  }
  index: number
  onEdit: (note: any) => void
  onDelete: (id: string) => void
  onToggleFavorite: (id: string) => void
}

export function NoteCard({ note, index, onEdit, onDelete, onToggleFavorite }: NoteCardProps) {
  return (
    <Card 
      className={`card-hover animate-scale-in cursor-pointer group ${
        note.favorite 
          ? 'ring-2 ring-yellow-400 dark:ring-yellow-500 bg-yellow-50/30 dark:bg-yellow-950/20' 
          : ''
      }`}
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
                onToggleFavorite(note.id)
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
                onEdit(note)
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
                onDelete(note.id)
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
  )
}
