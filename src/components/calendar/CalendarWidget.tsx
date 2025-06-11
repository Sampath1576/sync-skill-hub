
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CalendarWidgetProps {
  date: Date | undefined
  onDateSelect: (date: Date | undefined) => void
}

export function CalendarWidget({ date, onDateSelect }: CalendarWidgetProps) {
  const { toast } = useToast()

  const handleDateSelect = (newDate: Date | undefined) => {
    onDateSelect(newDate)
    if (newDate) {
      toast({
        title: "Date Selected",
        description: `Selected ${newDate.toDateString()}`,
      })
    }
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          className="rounded-md border"
        />
      </CardContent>
    </Card>
  )
}
