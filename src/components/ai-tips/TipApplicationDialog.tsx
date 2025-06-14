
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Lightbulb } from "lucide-react"

interface AITip {
  id: number
  category: string
  title: string
  content: string
  icon: any
  color: string
  instructions: string
}

interface TipApplicationDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedTip: AITip | null
  onConfirm: () => void
}

export function TipApplicationDialog({ 
  isOpen, 
  onClose, 
  selectedTip, 
  onConfirm 
}: TipApplicationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Apply: {selectedTip?.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Detailed Instructions:</h4>
            <div className="whitespace-pre-line text-sm">{selectedTip?.instructions}</div>
          </div>
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground">
              By confirming, this tip will be marked as applied and you'll receive guidance on implementing these strategies in your workflow.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onConfirm}>
              Confirm & Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
