
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

interface ProgressOverviewProps {
  completedTasks: number
  totalTasks: number
  totalNotes: number
  favoriteNotes: number
  upcomingEvents: number
}

export function ProgressOverview({ 
  completedTasks, 
  totalTasks, 
  totalNotes, 
  favoriteNotes, 
  upcomingEvents 
}: ProgressOverviewProps) {
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <Card className="mt-6 animate-fade-in" style={{ animationDelay: "0.6s" }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Progress Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <h4 className="font-semibold text-primary mb-2">Task Completion Rate</h4>
            <p className="text-2xl font-bold">{completionRate}%</p>
            <p className="text-sm text-muted-foreground">{completedTasks} of {totalTasks} tasks completed</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-700 mb-2">Knowledge Base</h4>
            <p className="text-2xl font-bold text-green-600">{totalNotes}</p>
            <p className="text-sm text-green-600">Notes created ({favoriteNotes} favorites)</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-700 mb-2">Upcoming Events</h4>
            <p className="text-2xl font-bold text-blue-600">{upcomingEvents}</p>
            <p className="text-sm text-blue-600">Events scheduled</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
