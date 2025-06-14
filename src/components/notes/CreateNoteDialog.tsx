
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface CreateNoteDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string
  setTitle: (title: string) => void
  setContent: (content: string) => void
  onSave: () => void
  editingNote: any
}

export function CreateNoteDialog({
  isOpen,
  onClose,
  title,
  content,
  setTitle,
  setContent,
  onSave,
  editingNote
}: CreateNoteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingNote ? "Edit Note" : "Create New Note"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input 
            placeholder="Note title..." 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea 
            placeholder="Start writing your note..." 
            className="min-h-[300px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onSave}>
              {editingNote ? "Update Note" : "Save Note"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
