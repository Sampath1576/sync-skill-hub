
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Users, Edit, Trash2 } from "lucide-react"
import { Event } from "@/types/calendar"

interface EventListProps {
  events: Event[]
  onEditEvent: (event: Event) => void
  onDeleteEvent: (eventId: number) => void
}

export function EventList({ events, onEditEvent, onDeleteEvent }: EventListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium">{event.title}</h4>
                <p className="text-sm text-muted-foreground">{event.time} • {event.date}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{event.attendees} attendees</span>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => onEditEvent(event)}>
                  <Edit className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDeleteEvent(event.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
