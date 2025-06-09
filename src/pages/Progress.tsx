
import { Header } from "@/components/Header"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Target, Clock, Trophy, BarChart3, PieChart, Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

export default function Progress() {
  const { toast } = useToast()
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [progressStats, setProgressStats] = useState([
    { title: "Tasks Completed", value: "156", total: "200", percentage: 78, icon: Target },
    { title: "Study Hours", value: "42", total: "60", percentage: 70, icon: Clock },
    { title: "Goals Achieved", value: "8", total: "10", percentage: 80, icon: Trophy },
    { title: "Productivity Score", value: "85", total: "100", percentage: 85, icon: TrendingUp },
  ])

  const weeklyData = [
    { day: "Mon", tasks: 12, hours: 6 },
    { day: "Tue", tasks: 8, hours: 4 },
    { day: "Wed", tasks: 15, hours: 8 },
    { day: "Thu", tasks: 10, hours: 5 },
    { day: "Fri", tasks: 18, hours: 7 },
    { day: "Sat", tasks: 5, hours: 3 },
    { day: "Sun", tasks: 3, hours: 2 },
  ]

  const generateReport = async () => {
    setIsGeneratingReport(true)
    toast({
      title: "Generating Report",
      description: "Your detailed progress report is being generated...",
    })
    
    // Simulate report generation
    setTimeout(() => {
      setIsGeneratingReport(false)
      toast({
        title: "Report Ready!",
        description: "Your progress report has been generated and is ready for download.",
      })
    }, 3000)
  }

  const refreshData = async () => {
    setIsRefreshing(true)
    toast({
      title: "Refreshing Data",
      description: "Updating your latest progress statistics...",
    })
    
    // Simulate data refresh
    setTimeout(() => {
      // Update some random values to show refresh worked
      setProgressStats(prev => prev.map(stat => ({
        ...stat,
        percentage: Math.min(100, stat.percentage + Math.floor(Math.random() * 5))
      })))
      
      setIsRefreshing(false)
      toast({
        title: "Data Updated",
        description: "Your progress statistics have been refreshed with the latest data.",
      })
    }, 2000)
  }

  const exportData = () => {
    toast({
      title: "Exporting Data",
      description: "Your progress data is being exported to CSV format...",
    })
    
    // Simulate data export
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Progress data exported successfully!",
      })
    }, 1500)
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
                <h1 className="text-3xl font-bold">Progress Tracker</h1>
                <p className="text-muted-foreground mt-1">Monitor your productivity and achievements</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="gap-2" 
                  onClick={refreshData}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2" 
                  onClick={exportData}
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button 
                  className="gap-2" 
                  onClick={generateReport}
                  disabled={isGeneratingReport}
                >
                  <BarChart3 className="h-4 w-4" />
                  {isGeneratingReport ? 'Generating...' : 'Generate Report'}
                </Button>
              </div>
            </div>

            {/* Progress Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {progressStats.map((stat, index) => (
                <Card key={stat.title} className="card-hover cursor-pointer" onClick={() => {
                  toast({
                    title: stat.title,
                    description: `Current progress: ${stat.value}/${stat.total} (${stat.percentage}%)`,
                  })
                }}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <stat.icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-2xl font-bold">{stat.percentage}%</span>
                    </div>
                    <h3 className="font-medium mb-2">{stat.title}</h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{stat.value}/{stat.total}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-3">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Weekly Activity */}
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
                            description: `${day.tasks} tasks completed, ${day.hours} hours studied`,
                          })
                        }}
                      >
                        <span className="text-sm font-medium w-12">{day.day}</span>
                        <div className="flex-1 mx-4">
                          <div className="flex gap-2">
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${(day.tasks / 20) * 100}%` }}
                              />
                            </div>
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div 
                                className="bg-secondary h-2 rounded-full"
                                style={{ width: `${(day.hours / 10) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground w-16 text-right">
                          {day.tasks}t {day.hours}h
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Achievement Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Achievement Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div 
                        className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-primary/20 transition-colors"
                        onClick={() => {
                          toast({
                            title: "Productivity Score",
                            description: "Great job! You're performing above average this month.",
                          })
                        }}
                      >
                        <div className="text-3xl font-bold text-primary">85%</div>
                      </div>
                      <p className="text-sm text-muted-foreground">Overall Productivity Score</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div 
                        className="text-center cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors"
                        onClick={() => {
                          toast({
                            title: "Task Completion",
                            description: "Excellent task completion rate this week!",
                          })
                        }}
                      >
                        <div className="text-2xl font-bold text-green-600">92%</div>
                        <p className="text-xs text-muted-foreground">Task Completion</p>
                      </div>
                      <div 
                        className="text-center cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors"
                        onClick={() => {
                          toast({
                            title: "Goal Achievement",
                            description: "You're on track to meet your monthly goals!",
                          })
                        }}
                      >
                        <div className="text-2xl font-bold text-blue-600">78%</div>
                        <p className="text-xs text-muted-foreground">Goal Achievement</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
