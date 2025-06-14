
import { Header } from "@/components/Header"
import { AppSidebar } from "@/components/AppSidebar"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { CalendarWidget } from "@/components/calendar/CalendarWidget"
import { EventList } from "@/components/calendar/EventList"
import { EventForm } from "@/components/calendar/EventForm"
import { useLocalEvents } from "@/hooks/useLocalEvents"

interface EventFormData {
  title: string
  description: string
  event_date: string
  event_time: string
  attendees: number
}

export default function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<any>(null)
  const { events, createEvent, updateEvent, deleteEvent } = useLocalEvents()

  const handleAddEvent = async (eventData: EventFormData) => {
    await createEvent(eventData)
    setIsAddEventOpen(false)
  }

  const handleUpdateEvent = async (eventId: string, eventData: EventFormData) => {
    await updateEvent(eventId, eventData)
    setEditingEvent(null)
  }

  const handleEditEvent = (event: any) => {
    setEditingEvent(event)
  }

  const handleCloseEditDialog = () => {
    setEditingEvent(null)
  }

  const handleOpenAddDialog = () => {
    setIsAddEventOpen(true)
  }

  const handleCloseAddDialog = () => {
    setIsAddEventOpen(false)
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
                <h1 className="text-3xl font-bold">Calendar</h1>
                <p className="text-muted-foreground mt-1">Manage your schedule and events</p>
              </div>
              <Button className="gap-2" onClick={handleOpenAddDialog}>
                <Plus className="h-4 w-4" />
                Add Event
              </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <CalendarWidget date={date} onDateSelect={setDate} />
              <EventList 
                events={events}
                onEditEvent={handleEditEvent}
                onDeleteEvent={deleteEvent}
              />
            </div>

            <EventForm
              trigger={<div />}
              onAddEvent={handleAddEvent}
              onUpdateEvent={handleUpdateEvent}
              onClose={handleCloseAddDialog}
              isOpen={isAddEventOpen}
            />

            {editingEvent && (
              <EventForm
                trigger={<div />}
                isEdit={true}
                editingEvent={editingEvent}
                onAddEvent={handleAddEvent}
                onUpdateEvent={handleUpdateEvent}
                onClose={handleCloseEditDialog}
                isOpen={!!editingEvent}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
