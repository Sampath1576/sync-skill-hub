
import { Header } from "@/components/Header"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CheckSquare, Calendar, Brain, TrendingUp, Clock, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@clerk/clerk-react"
import { useSupabaseNotes } from "@/hooks/useSupabaseNotes"
import { useSupabaseTasks } from "@/hooks/useSupabaseTasks"
import { useSupabaseEvents } from "@/hooks/useSupabaseEvents"

export default function Dashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useUser()
  const { notes, isLoading: notesLoading } = useSupabaseNotes()
  const { tasks, isLoading: tasksLoading } = useSupabaseTasks()
  const { events, isLoading: eventsLoading } = useSupabaseEvents()

  // Calculate progress statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.completed).length
  const totalNotes = notes.length
  const upcomingEvents = events.filter(event => new Date(event.event_date) >= new Date()).length
  
  // Calculate completion percentage
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  
  // Calculate study hours (estimated based on completed tasks)
  const studyHours = Math.round(completedTasks * 1.5) // Assuming 1.5 hours per completed task

  const stats = [
    { title: "Notes Created", value: totalNotes.toString(), icon: FileText, change: `+${totalNotes}` },
    { title: "Tasks Completed", value: `${completedTasks}/${totalTasks}`, icon: CheckSquare, change: `${completionRate}%` },
    { title: "Study Hours", value: studyHours.toString(), icon: Clock, change: `+${studyHours}h` },
    { title: "Upcoming Events", value: upcomingEvents.toString(), icon: TrendingUp, change: `+${upcomingEvents}` },
  ]

  const getAIInsights = () => {
    toast({
      title: "Navigating to AI Insights",
      description: "Opening AI Productivity Tips page...",
    })
    navigate("/ai-tips")
  }

  const createFirstNote = () => {
    navigate("/notes")
  }

  const createFirstTask = () => {
    navigate("/tasks")
  }

  const scheduleEvent = () => {
    navigate("/calendar")
  }

  if (notesLoading || tasksLoading || eventsLoading) {
    return (
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-48 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    )
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
                <h1 className="text-3xl font-bold">
                  Welcome to SkillSync, {user?.firstName || 'User'}!
                </h1>
                <p className="text-muted-foreground mt-1">
                  {totalNotes > 0 || totalTasks > 0 
                    ? `You have ${totalNotes} notes and ${totalTasks} tasks. Keep up the great work!`
                    : "Start your productivity journey by creating your first note or task."
                  }
                </p>
              </div>
              <Button className="gap-2" onClick={getAIInsights}>
                <Brain className="h-4 w-4" />
                Get AI Insights
              </Button>
            </div>

            {/* Stats Grid */}
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
                  {notes.length > 0 ? (
                    <>
                      {notes.slice(0, 3).map((note) => (
                        <div key={note.id} className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => navigate("/notes")}>
                          <h4 className="font-medium">{note.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">{note.content}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(note.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                      {notes.length > 3 && (
                        <Button variant="outline" className="w-full" onClick={() => navigate("/notes")}>
                          View All {notes.length} Notes
                        </Button>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No notes yet</h3>
                      <p className="text-muted-foreground mb-4">Create your first note to get started with organizing your thoughts.</p>
                      <Button onClick={createFirstNote} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create First Note
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Tasks */}
              <Card className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5" />
                    Recent Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tasks.length > 0 ? (
                    <>
                      {tasks.slice(0, 3).map((task) => (
                        <div key={task.id} className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => navigate("/tasks")}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${task.completed ? 'bg-green-500' : task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-500'}`}></div>
                            <h4 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>{task.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                          </p>
                        </div>
                      ))}
                      {tasks.length > 3 && (
                        <Button variant="outline" className="w-full" onClick={() => navigate("/tasks")}>
                          View All {tasks.length} Tasks
                        </Button>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
                      <p className="text-muted-foreground mb-4">Add your first task to start managing your productivity.</p>
                      <Button onClick={createFirstTask} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create First Task
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Progress Overview */}
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
                    <p className="text-sm text-green-600">Notes created</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-700 mb-2">Upcoming Events</h4>
                    <p className="text-2xl font-bold text-blue-600">{upcomingEvents}</p>
                    <p className="text-sm text-blue-600">Events scheduled</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Tips */}
            <Card className="mt-6 animate-fade-in" style={{ animationDelay: "0.7s" }}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Productivity Tip
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => toast({ title: "New tip loaded", description: "Here's a fresh productivity tip for you!" })}>
                    Refresh
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-primary font-medium mb-2">💡 {totalTasks > 0 ? "Productivity" : "Getting Started"} Tip</p>
                  <p className="text-sm">
                    {totalTasks > 0 
                      ? `Great progress! You've completed ${completionRate}% of your tasks. Try breaking down larger tasks into smaller, manageable chunks to maintain momentum.`
                      : "Welcome to SkillSync! Start by creating a few notes to capture your ideas, then add some tasks to organize your work. The key to productivity is consistent daily habits - even small steps count!"
                    }
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
