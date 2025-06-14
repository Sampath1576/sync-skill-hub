
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
    
    // Show tips that haven't been applied yet
    const unappliedTips = allTips.filter(tip => !appliedTips.includes(tip.id))
    setDisplayedTips(unappliedTips.slice(0, 4))
  }, [appliedTips, allTips])

  const refreshTips = async () => {
    setIsRefreshing(true)
    toast({
      title: "Refreshing AI Tips",
      description: "Generating new personalized productivity insights...",
    })
    
    setTimeout(() => {
      // Get tips that haven't been applied yet
      const unappliedTips = allTips.filter(tip => !appliedTips.includes(tip.id))
      
      if (unappliedTips.length >= 4) {
        // Show different set of unapplied tips
        const shuffled = [...unappliedTips].sort(() => Math.random() - 0.5)
        setDisplayedTips(shuffled.slice(0, 4))
      } else {
        // If less than 4 unapplied tips, show what's available
        setDisplayedTips(unappliedTips)
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
      
      // Remove the applied tip from displayed tips
      setDisplayedTips(prev => prev.filter(tip => tip.id !== selectedTip.id))
      
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
            <AITipsHeader 
              isRefreshing={isRefreshing}
              onRefresh={refreshTips}
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
