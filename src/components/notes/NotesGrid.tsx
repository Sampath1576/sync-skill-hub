
import { NoteCard } from "./NoteCard"

interface NotesGridProps {
  notes: any[]
  onEdit: (note: any) => void
  onDelete: (id: string) => void
  onToggleFavorite: (id: string) => void
}

export function NotesGrid({ notes, onEdit, onDelete, onToggleFavorite }: NotesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.map((note, index) => (
        <NoteCard
          key={note.id}
          note={note}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  )
}
