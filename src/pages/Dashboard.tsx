
import { Header } from "@/components/Header"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CheckSquare, Calendar, Brain, TrendingUp, Clock, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@clerk/clerk-react"

export default function Dashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useUser()

  const stats = [
    { title: "Notes Created", value: "0", icon: FileText, change: "+0%" },
    { title: "Tasks Completed", value: "0", icon: CheckSquare, change: "+0%" },
    { title: "Study Hours", value: "0", icon: Clock, change: "+0%" },
    { title: "Goals Achieved", value: "0", icon: TrendingUp, change: "+0%" },
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
                <p className="text-muted-foreground mt-1">Start your productivity journey by creating your first note or task.</p>
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
              {/* Empty Notes State */}
              <Card className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Recent Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No notes yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first note to get started with organizing your thoughts.</p>
                    <Button onClick={createFirstNote} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create First Note
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Empty Tasks State */}
              <Card className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5" />
                    Upcoming Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-8">
                    <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
                    <p className="text-muted-foreground mb-4">Add your first task to start managing your productivity.</p>
                    <Button onClick={createFirstTask} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create First Task
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Tips */}
            <Card className="mt-6 animate-fade-in" style={{ animationDelay: "0.6s" }}>
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
                  <p className="text-primary font-medium mb-2">💡 Getting Started Tip</p>
                  <p className="text-sm">
                    Welcome to SkillSync! Start by creating a few notes to capture your ideas, then add some tasks to organize your work. 
                    The key to productivity is consistent daily habits - even small steps count!
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
