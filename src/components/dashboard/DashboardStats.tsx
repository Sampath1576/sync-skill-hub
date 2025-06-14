
import { Card, CardContent } from "@/components/ui/card"
import { FileText, CheckSquare, Clock, TrendingUp } from "lucide-react"

interface DashboardStatsProps {
  totalNotes: number
  favoriteNotes: number
  completedTasks: number
  totalTasks: number
  studyHours: number
  upcomingEvents: number
}

export function DashboardStats({ 
  totalNotes, 
  favoriteNotes, 
  completedTasks, 
  totalTasks, 
  studyHours, 
  upcomingEvents 
}: DashboardStatsProps) {
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const stats = [
    { title: "Notes Created", value: `${totalNotes} (${favoriteNotes} ⭐)`, icon: FileText, change: `+${totalNotes}` },
    { title: "Tasks Completed", value: `${completedTasks}/${totalTasks}`, icon: CheckSquare, change: `${completionRate}%` },
    { title: "Study Hours", value: studyHours.toString(), icon: Clock, change: `+${studyHours}h` },
    { title: "Upcoming Events", value: upcomingEvents.toString(), icon: TrendingUp, change: `+${upcomingEvents}` },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={stat.title} className="card-hover animate-scale-in cursor-pointer" style={{ animationDelay: `${index * 0.1}s` }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground font-medium">{stat.change}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
