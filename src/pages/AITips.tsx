
import { Header } from "@/components/Header"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Lightbulb, RefreshCw, Star, Clock, Target, Share, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function AITips() {
  const { toast } = useToast()
  const [favoriteTips, setFavoriteTips] = useState<number[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [aiTips, setAiTips] = useState([
    {
      id: 1,
      category: "Focus",
      title: "Optimal Focus Windows",
      content: "Based on your productivity patterns, your peak focus time is between 9-11 AM. Schedule your most demanding tasks during this window.",
      icon: Target,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
    },
    {
      id: 2,
      category: "Time Management",
      title: "Break Optimization",
      content: "Your productivity increases by 23% when you take 5-minute breaks every 25 minutes. Consider using the Pomodoro technique.",
      icon: Clock,
      color: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
    },
    {
      id: 3,
      category: "Task Planning",
      title: "Task Batching Strategy",
      content: "Group similar tasks together. You complete similar tasks 40% faster when batched versus switching between different types.",
      icon: Brain,
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
    },
    {
      id: 4,
      category: "Motivation",
      title: "Progress Visualization",
      content: "Visualizing your completed tasks can boost motivation by 35%. Review your achievements at the end of each day.",
      icon: Lightbulb,
      color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
    },
  ])

  const refreshTips = async () => {
    setIsRefreshing(true)
    toast({
      title: "Refreshing AI Tips",
      description: "Generating new personalized productivity insights...",
    })
    
    // Simulate AI tip generation
    setTimeout(() => {
      const newTips = [
        {
          id: Date.now() + 1,
          category: "Energy Management",
          title: "Energy-Based Scheduling",
          content: "Schedule high-energy tasks when you feel most alert. Your energy patterns show peaks at 10 AM and 3 PM.",
          icon: Target,
          color: "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
        },
        {
          id: Date.now() + 2,
          category: "Learning",
          title: "Spaced Repetition",
          content: "Review important concepts at increasing intervals: 1 day, 3 days, 1 week, 2 weeks. This improves retention by 60%.",
          icon: BookOpen,
          color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
        }
      ]
      
      setAiTips(prev => [...newTips, ...prev.slice(0, 2)])
      setIsRefreshing(false)
      
      toast({
        title: "AI Tips Refreshed",
        description: "New personalized productivity insights generated!",
      })
    }, 2000)
  }

  const toggleFavorite = (tipId: number) => {
    setFavoriteTips(prev => 
      prev.includes(tipId) 
        ? prev.filter(id => id !== tipId)
        : [...prev, tipId]
    )
    toast({
      title: favoriteTips.includes(tipId) ? "Removed from favorites" : "Added to favorites",
      description: "Tip favorite status updated",
    })
  }

  const shareTip = (tip: any) => {
    if (navigator.share) {
      navigator.share({
        title: tip.title,
        text: tip.content,
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${tip.title}: ${tip.content}`)
      toast({
        title: "Tip Copied",
        description: "Tip has been copied to your clipboard!",
      })
    }
  }

  const applyTip = (tip: any) => {
    toast({
      title: "Tip Applied",
      description: `"${tip.title}" has been added to your productivity plan!`,
    })
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
                <h1 className="text-3xl font-bold">AI Productivity Tips</h1>
                <p className="text-muted-foreground mt-1">Personalized insights to boost your productivity</p>
              </div>
              <Button 
                className="gap-2" 
                onClick={refreshTips}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Generating...' : 'Refresh Tips'}
              </Button>
            </div>

            {/* Daily Insight */}
            <Card className="mb-8 border-primary/20 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => {
              toast({
                title: "Daily Insight Expanded",
                description: "Wednesday productivity patterns have been analyzed and saved to your profile.",
              })
            }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Brain className="h-6 w-6" />
                  💡 Today's Key Insight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">
                  You're most productive on Wednesdays! Consider scheduling important meetings and tasks 
                  for mid-week to maximize your output.
                </p>
              </CardContent>
            </Card>

            {/* AI Tips Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {aiTips.map((tip, index) => (
                <Card key={tip.id} className="card-hover animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tip.color}`}>
                          <tip.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{tip.title}</h3>
                          <span className="text-sm text-muted-foreground">{tip.category}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(tip.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Star 
                            className={`h-4 w-4 ${
                              favoriteTips.includes(tip.id) 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-muted-foreground'
                            }`} 
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => shareTip(tip)}
                          className="h-8 w-8 p-0"
                        >
                          <Share className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-4">{tip.content}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => applyTip(tip)}
                    >
                      Apply This Tip
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Productivity Score */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Your Productivity Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div 
                    className="text-center cursor-pointer hover:bg-muted/50 p-4 rounded-lg transition-colors"
                    onClick={() => {
                      toast({
                        title: "Morning Person Profile",
                        description: "Your peak productivity hours and tips for maximizing morning performance.",
                      })
                    }}
                  >
                    <div className="text-3xl font-bold text-primary mb-2">Morning Person</div>
                    <p className="text-sm text-muted-foreground">You're 45% more productive in the morning</p>
                  </div>
                  <div 
                    className="text-center cursor-pointer hover:bg-muted/50 p-4 rounded-lg transition-colors"
                    onClick={() => {
                      toast({
                        title: "High Focus Profile",
                        description: "Your focus patterns and strategies for maintaining concentration.",
                      })
                    }}
                  >
                    <div className="text-3xl font-bold text-green-600 mb-2">High Focus</div>
                    <p className="text-sm text-muted-foreground">Average focus session: 32 minutes</p>
                  </div>
                  <div 
                    className="text-center cursor-pointer hover:bg-muted/50 p-4 rounded-lg transition-colors"
                    onClick={() => {
                      toast({
                        title: "Task Switcher Profile",
                        description: "Your multitasking patterns and optimization recommendations.",
                      })
                    }}
                  >
                    <div className="text-3xl font-bold text-blue-600 mb-2">Task Switcher</div>
                    <p className="text-sm text-muted-foreground">You handle 8.5 different tasks per day</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
