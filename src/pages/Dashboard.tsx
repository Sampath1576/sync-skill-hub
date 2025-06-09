
import { Header } from "@/components/Header"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CheckSquare, Calendar, Brain, TrendingUp, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const stats = [
    { title: "Notes Created", value: "24", icon: FileText, change: "+12%" },
    { title: "Tasks Completed", value: "18", icon: CheckSquare, change: "+8%" },
    { title: "Study Hours", value: "42", icon: Clock, change: "+15%" },
    { title: "Goals Achieved", value: "6", icon: TrendingUp, change: "+25%" },
  ]

  const recentNotes = [
    { title: "JavaScript Fundamentals", updated: "2 hours ago", tags: ["coding", "web-dev"] },
    { title: "Machine Learning Basics", updated: "5 hours ago", tags: ["ai", "python"] },
    { title: "Project Planning", updated: "1 day ago", tags: ["productivity", "planning"] },
  ]

  const upcomingTasks = [
    { title: "Complete React assignment", due: "Today", priority: "high" },
    { title: "Review meeting notes", due: "Tomorrow", priority: "medium" },
    { title: "Update portfolio", due: "This week", priority: "low" },
  ]

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">Welcome back, John!</h1>
                <p className="text-muted-foreground mt-1">Here's what's happening with your productivity today.</p>
              </div>
              <Button className="gap-2">
                <Brain className="h-4 w-4" />
                Get AI Insights
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <Card key={stat.title} className="card-hover animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className="text-sm text-success font-medium">{stat.change}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <stat.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Notes */}
              <Card className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Recent Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentNotes.map((note, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium">{note.title}</h4>
                        <p className="text-sm text-muted-foreground">{note.updated}</p>
                        <div className="flex gap-1 mt-2">
                          {note.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">View All Notes</Button>
                </CardContent>
              </Card>

              {/* Upcoming Tasks */}
              <Card className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5" />
                    Upcoming Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingTasks.map((task, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-muted-foreground">{task.due}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          task.priority === 'high' ? 'bg-destructive/10 text-destructive' :
                          task.priority === 'medium' ? 'bg-warning/10 text-warning' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {task.priority}
                        </span>
                        <Button variant="ghost" size="sm">
                          <CheckSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">View All Tasks</Button>
                </CardContent>
              </Card>
            </div>

            {/* AI Tips */}
            <Card className="mt-6 animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Productivity Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-primary font-medium mb-2">💡 Focus Time Recommendation</p>
                  <p className="text-sm">
                    Based on your productivity patterns, your optimal focus time is between 9-11 AM. 
                    Consider scheduling your most important tasks during this window for maximum efficiency.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
