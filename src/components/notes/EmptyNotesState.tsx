
import { Button } from "@/components/ui/button"
import { Search, Plus } from "lucide-react"

interface EmptyNotesStateProps {
  searchTerm: string
  onCreateNote: () => void
}

export function EmptyNotesState({ searchTerm, onCreateNote }: EmptyNotesStateProps) {
  return (
    <div className="text-center py-12 animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No notes found</h3>
      <p className="text-muted-foreground mb-4">
        {searchTerm ? `No notes match "${searchTerm}"` : "Start by creating your first note!"}
      </p>
      <Button onClick={onCreateNote}>
        <Plus className="h-4 w-4 mr-2" />
        Create Note
      </Button>
    </div>
  )
}
