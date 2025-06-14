
import { Header } from "@/components/Header"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Lightbulb, RefreshCw, Star, Clock, Target, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface AITip {
  id: number;
  category: string;
  title: string;
  content: string;
  icon: any;
  color: string;
  instructions: string;
  applied?: boolean;
}

export default function AITips() {
  const { toast } = useToast()
  const [favoriteTips, setFavoriteTips] = useState<number[]>([])
  const [appliedTips, setAppliedTips] = useState<number[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedTip, setSelectedTip] = useState<AITip | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [allTips] = useState<AITip[]>([
    {
      id: 1,
      category: "Focus",
      title: "Optimal Focus Windows",
      content: "Based on your productivity patterns, your peak focus time is between 9-11 AM. Schedule your most demanding tasks during this window.",
      icon: Target,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      instructions: "1. Identify your most challenging or important tasks\n2. Block your calendar from 9-11 AM daily\n3. Turn off notifications during this time\n4. Prepare your workspace the night before\n5. Start with the most difficult task first\n6. Track your productivity during these hours for a week"
    },
    {
      id: 2,
      category: "Time Management",
      title: "Break Optimization",
      content: "Your productivity increases by 23% when you take 5-minute breaks every 25 minutes. Consider using the Pomodoro technique.",
      icon: Clock,
      color: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
      instructions: "1. Download a Pomodoro timer app or use a browser timer\n2. Work for exactly 25 minutes on one task\n3. Take a 5-minute break (walk, stretch, hydrate)\n4. Repeat for 4 cycles, then take a 15-30 minute break\n5. During breaks, avoid screens and social media\n6. Track which tasks work best with this technique"
    },
    {
      id: 3,
      category: "Task Planning",
      title: "Task Batching Strategy",
      content: "Group similar tasks together. You complete similar tasks 40% faster when batched versus switching between different types.",
      icon: Brain,
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
      instructions: "1. List all your weekly tasks\n2. Group similar tasks (emails, calls, writing, research)\n3. Assign specific time blocks for each batch\n4. Complete all tasks in one category before moving to the next\n5. Minimize context switching between different types of work\n6. Schedule the most demanding batches during your peak energy hours"
    },
    {
      id: 4,
      category: "Motivation",
      title: "Progress Visualization",
      content: "Visualizing your completed tasks can boost motivation by 35%. Review your achievements at the end of each day.",
      icon: Lightbulb,
      color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
      instructions: "1. Set aside 10 minutes at the end of each day\n2. List all tasks you completed that day\n3. Note any progress made on larger projects\n4. Celebrate small wins and milestones\n5. Take screenshots or photos of your accomplishments\n6. Keep a weekly progress journal\n7. Share your achievements with someone supportive"
    },
    {
      id: 5,
      category: "Energy Management",
      title: "Energy-Based Scheduling",
      content: "Schedule high-energy tasks when you feel most alert. Your energy patterns show peaks at 10 AM and 3 PM.",
      icon: Target,
      color: "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
      instructions: "1. Track your energy levels hourly for a week\n2. Identify your natural high and low energy periods\n3. Schedule creative and analytical work during high-energy times\n4. Use low-energy periods for routine tasks and admin work\n5. Plan breaks before energy dips\n6. Adjust your schedule based on your energy patterns"
    },
    {
      id: 6,
      category: "Learning",
      title: "Spaced Repetition",
      content: "Review important concepts at increasing intervals: 1 day, 3 days, 1 week, 2 weeks. This improves retention by 60%.",
      icon: BookOpen,
      color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
      instructions: "1. Create flashcards or notes for key concepts\n2. Review new material after 1 day\n3. Review again after 3 days if remembered correctly\n4. Next review after 1 week\n5. Final review after 2 weeks\n6. If you forget at any stage, restart the cycle\n7. Use apps like Anki or create a simple spreadsheet to track timing"
    }
  ])

  const [displayedTips, setDisplayedTips] = useState<AITip[]>([])

  useEffect(() => {
    // Load applied tips from localStorage
    const stored = localStorage.getItem('skillsync_applied_tips')
    if (stored) {
      setAppliedTips(JSON.parse(stored))
    }
    
    // Show first 4 tips initially
    setDisplayedTips(allTips.slice(0, 4))
  }, [])

  const refreshTips = async () => {
    setIsRefreshing(true)
    toast({
      title: "Refreshing AI Tips",
      description: "Generating new personalized productivity insights...",
    })
    
    setTimeout(() => {
      // Get tips that haven't been shown yet
      const unusedTips = allTips.filter(tip => !displayedTips.some(d => d.id === tip.id))
      
      if (unusedTips.length >= 2) {
        // Show 2 new tips plus 2 from current display
        const newTips = [...unusedTips.slice(0, 2), ...displayedTips.slice(0, 2)]
        setDisplayedTips(newTips)
      } else {
        // If we're running low on unused tips, shuffle and show different ones
        const shuffled = [...allTips].sort(() => Math.random() - 0.5)
        setDisplayedTips(shuffled.slice(0, 4))
      }
      
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

  const openTipDialog = (tip: AITip) => {
    setSelectedTip(tip)
    setIsDialogOpen(true)
  }

  const confirmApplyTip = () => {
    if (selectedTip) {
      const newAppliedTips = [...appliedTips, selectedTip.id]
      setAppliedTips(newAppliedTips)
      localStorage.setItem('skillsync_applied_tips', JSON.stringify(newAppliedTips))
      
      toast({
        title: "Tip Applied Successfully!",
        description: `"${selectedTip.title}" has been added to your productivity plan!`,
      })
      
      setIsDialogOpen(false)
      setSelectedTip(null)
    }
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
              {displayedTips.map((tip, index) => (
                <Card key={tip.id} className="card-hover animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tip.color}`}>
                          <tip.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold flex items-center gap-2">
                            {tip.title}
                            {appliedTips.includes(tip.id) && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Applied</span>}
                          </h3>
                          <span className="text-sm text-muted-foreground">{tip.category}</span>
                        </div>
                      </div>
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
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-4">{tip.content}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => openTipDialog(tip)}
                      disabled={appliedTips.includes(tip.id)}
                    >
                      {appliedTips.includes(tip.id) ? 'Tip Applied ✓' : 'Apply This Tip'}
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

      {/* Tip Application Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Apply: {selectedTip?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Detailed Instructions:</h4>
              <div className="whitespace-pre-line text-sm">{selectedTip?.instructions}</div>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground">
                By confirming, this tip will be marked as applied and you'll receive guidance on implementing these strategies in your workflow.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={confirmApplyTip}>
                Confirm & Apply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
