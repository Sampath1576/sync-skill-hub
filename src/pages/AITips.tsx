import { Header } from "@/components/Header"
import { AppSidebar } from "@/components/AppSidebar"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Brain, Lightbulb, Target, Clock, BookOpen } from "lucide-react"
import { AITipsHeader } from "@/components/ai-tips/AITipsHeader"
import { DailyInsightCard } from "@/components/ai-tips/DailyInsightCard"
import { AITipCard } from "@/components/ai-tips/AITipCard"
import { ProductivityProfileCard } from "@/components/ai-tips/ProductivityProfileCard"
import { TipApplicationDialog } from "@/components/ai-tips/TipApplicationDialog"

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
  const [currentTipIndices, setCurrentTipIndices] = useState<number[]>([])

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
    },
    {
      id: 7,
      category: "Workflow",
      title: "Single-Tasking Focus",
      content: "Multitasking reduces productivity by up to 40%. Focus on one task at a time for better results and less mental fatigue.",
      icon: Brain,
      color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400",
      instructions: "1. Choose one task to work on at a time\n2. Close all unnecessary browser tabs and applications\n3. Put your phone in airplane mode or another room\n4. Set a specific time block for the task\n5. Work only on that task during the time block\n6. Take a break before moving to the next task"
    },
    {
      id: 8,
      category: "Environment",
      title: "Workspace Optimization",
      content: "A clutter-free workspace can improve focus by 12%. Organize your physical and digital environments for maximum productivity.",
      icon: Target,
      color: "bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400",
      instructions: "1. Clear your desk of non-essential items\n2. Organize files in clearly labeled folders\n3. Use consistent naming conventions for documents\n4. Keep only current projects visible\n5. Clean your workspace at the end of each day\n6. Adjust lighting and temperature for comfort"
    }
  ])

  const [displayedTips, setDisplayedTips] = useState<AITip[]>([])

  const getRandomTips = (availableTips: AITip[], count: number, excludeIndices: number[] = []) => {
    const availableIndices = availableTips
      .map((_, index) => index)
      .filter(index => !excludeIndices.includes(index))
    
    if (availableIndices.length <= count) {
      return availableTips.filter((_, index) => availableIndices.includes(index))
    }
    
    const shuffled = [...availableIndices].sort(() => Math.random() - 0.5)
    const selectedIndices = shuffled.slice(0, count)
    return selectedIndices.map(index => availableTips[index])
  }

  useEffect(() => {
    // Load applied tips from localStorage
    const stored = localStorage.getItem('skillsync_applied_tips')
    if (stored) {
      setAppliedTips(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    // Always ensure we have 4 tips displayed
    const unappliedTips = allTips.filter(tip => !appliedTips.includes(tip.id))
    
    if (unappliedTips.length >= 4) {
      // If we have enough unapplied tips, show them
      const newTips = getRandomTips(unappliedTips, 4)
      setDisplayedTips(newTips)
      setCurrentTipIndices(newTips.map(tip => allTips.findIndex(t => t.id === tip.id)))
    } else {
      // If not enough unapplied tips, show all available tips (mix of applied and unapplied)
      const newTips = getRandomTips(allTips, 4)
      setDisplayedTips(newTips)
      setCurrentTipIndices(newTips.map(tip => allTips.findIndex(t => t.id === tip.id)))
    }
  }, [appliedTips, allTips])

  const refreshTips = async () => {
    setIsRefreshing(true)
    toast({
      title: "Refreshing AI Tips",
      description: "Generating new personalized productivity insights...",
    })
    
    setTimeout(() => {
      // Always show 4 tips, prioritizing unapplied ones but ensuring we never show empty
      const unappliedTips = allTips.filter(tip => !appliedTips.includes(tip.id))
      
      if (unappliedTips.length >= 4) {
        // Get new unapplied tips, excluding currently displayed ones if possible
        const newTips = getRandomTips(unappliedTips, 4, currentTipIndices)
        setDisplayedTips(newTips)
        setCurrentTipIndices(newTips.map(tip => allTips.findIndex(t => t.id === tip.id)))
      } else {
        // Not enough unapplied tips, so mix applied and unapplied tips
        // Exclude currently displayed tips to ensure refresh shows different content
        const newTips = getRandomTips(allTips, 4, currentTipIndices)
        setDisplayedTips(newTips)
        setCurrentTipIndices(newTips.map(tip => allTips.findIndex(t => t.id === tip.id)))
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

  const applyAllTips = () => {
    const unappliedDisplayedTips = displayedTips.filter(tip => !appliedTips.includes(tip.id))
    
    if (unappliedDisplayedTips.length === 0) {
      toast({
        title: "All Tips Already Applied",
        description: "All currently displayed tips have already been applied!",
      })
      return
    }

    const newAppliedTipIds = unappliedDisplayedTips.map(tip => tip.id)
    const newAppliedTips = [...appliedTips, ...newAppliedTipIds]
    
    setAppliedTips(newAppliedTips)
    localStorage.setItem('skillsync_applied_tips', JSON.stringify(newAppliedTips))
    
    toast({
      title: "All Tips Applied Successfully!",
      description: `Applied ${unappliedDisplayedTips.length} productivity tip${unappliedDisplayedTips.length === 1 ? '' : 's'} to your plan!`,
    })
    
    // Refresh the displayed tips to show new ones
    setTimeout(() => {
      const unappliedTips = allTips.filter(tip => !newAppliedTips.includes(tip.id))
      
      if (unappliedTips.length >= 4) {
        const newTips = getRandomTips(unappliedTips, 4)
        setDisplayedTips(newTips)
        setCurrentTipIndices(newTips.map(tip => allTips.findIndex(t => t.id === tip.id)))
      } else {
        // Mix applied and unapplied if not enough unapplied tips
        const newTips = getRandomTips(allTips, 4, currentTipIndices)
        setDisplayedTips(newTips)
        setCurrentTipIndices(newTips.map(tip => allTips.findIndex(t => t.id === tip.id)))
      }
    }, 100)
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
      
      // After applying a tip, refresh the displayed tips to show new ones
      setTimeout(() => {
        const unappliedTips = allTips.filter(tip => !newAppliedTips.includes(tip.id))
        
        if (unappliedTips.length >= 4) {
          const newTips = getRandomTips(unappliedTips, 4)
          setDisplayedTips(newTips)
          setCurrentTipIndices(newTips.map(tip => allTips.findIndex(t => t.id === tip.id)))
        } else {
          // Mix applied and unapplied if not enough unapplied tips
          const newTips = getRandomTips(allTips, 4, currentTipIndices)
          setDisplayedTips(newTips)
          setCurrentTipIndices(newTips.map(tip => allTips.findIndex(t => t.id === tip.id)))
        }
      }, 100)
    }
  }

  const hasUnappliedTips = displayedTips.some(tip => !appliedTips.includes(tip.id))

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="animate-fade-in">
            <AITipsHeader 
              isRefreshing={isRefreshing}
              onRefresh={refreshTips}
              onApplyAll={applyAllTips}
              hasUnappliedTips={hasUnappliedTips}
            />

            <DailyInsightCard />

            {/* AI Tips Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {displayedTips.map((tip, index) => (
                <AITipCard
                  key={tip.id}
                  tip={tip}
                  index={index}
                  isFavorite={favoriteTips.includes(tip.id)}
                  isApplied={appliedTips.includes(tip.id)}
                  onToggleFavorite={toggleFavorite}
                  onApplyTip={openTipDialog}
                />
              ))}
            </div>

            <ProductivityProfileCard />
          </div>
        </main>
      </div>

      <TipApplicationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        selectedTip={selectedTip}
        onConfirm={confirmApplyTip}
      />
    </div>
  )
}
