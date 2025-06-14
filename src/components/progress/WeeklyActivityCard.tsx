
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WeeklyActivityData {
  day: string;
  tasks: number;
  hours: number;
  notes: number;
  events: number;
}

interface WeeklyActivityCardProps {
  weeklyData: WeeklyActivityData[];
}

export function WeeklyActivityCard({ weeklyData }: WeeklyActivityCardProps) {
  const { toast } = useToast()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Weekly Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {weeklyData.map((day, index) => (
            <div 
              key={day.day} 
              className="flex items-center justify-between hover:bg-muted/50 p-2 rounded cursor-pointer transition-colors"
              onClick={() => {
                toast({
                  title: `${day.day} Activity`,
                  description: `${day.tasks} tasks completed, ${day.hours} hours studied, ${day.notes} notes created, ${day.events} events`,
                })
              }}
            >
              <span className="text-sm font-medium w-12">{day.day}</span>
              <div className="flex-1 mx-4">
                <div className="flex gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (day.tasks / Math.max(1, Math.max(...weeklyData.map(d => d.tasks)))) * 100)}%` }}
                    />
                  </div>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-secondary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (day.notes / Math.max(1, Math.max(...weeklyData.map(d => d.notes)))) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Tasks: {day.tasks}</span>
                  <span>Notes: {day.notes}</span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground w-20 text-right">
                {day.events} events
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
