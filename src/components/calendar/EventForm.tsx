
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface Event {
  id: string
  title: string
  description: string
  event_date: string
  event_time: string
  attendees: number
}

interface EventFormProps {
  trigger: React.ReactNode
  isEdit?: boolean
  editingEvent?: Event | null
  onAddEvent: (event: {
    title: string
    description: string
    event_date: string
    event_time: string
    attendees: number
  }) => void
  onUpdateEvent: (eventId: string, event: {
    title: string
    description: string
    event_date: string
    event_time: string
    attendees: number
  }) => void
  onClose: () => void
  isOpen: boolean
}

export function EventForm({
  trigger,
  isEdit = false,
  editingEvent,
  onAddEvent,
  onUpdateEvent,
  onClose,
  isOpen
}: EventFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: editingEvent?.title || "",
    event_time: editingEvent?.event_time || "",
    event_date: editingEvent?.event_date || "",
    attendees: editingEvent?.attendees || 1,
    description: editingEvent?.description || ""
  })

  const resetForm = () => {
    setFormData({ title: "", event_time: "", event_date: "", attendees: 1, description: "" })
  }

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter an event title",
        variant: "destructive"
      })
      return
    }

    if (isEdit && editingEvent) {
      onUpdateEvent(editingEvent.id, formData)
    } else {
      onAddEvent(formData)
    }

    resetForm()
    onClose()
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Event" : "Add New Event"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter event title"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="event_time">Time</Label>
              <Input
                id="event_time"
                type="time"
                value={formData.event_time}
                onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="event_date">Date</Label>
              <Input
                id="event_date"
                type="date"
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="attendees">Number of Attendees</Label>
            <Input
              id="attendees"
              type="number"
              min="1"
              value={formData.attendees}
              onChange={(e) => setFormData({ ...formData, attendees: parseInt(e.target.value) || 1 })}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Event description (optional)"
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">
            {isEdit ? "Update Event" : "Add Event"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
