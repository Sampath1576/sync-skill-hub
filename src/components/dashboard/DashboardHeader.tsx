
import { Button } from "@/components/ui/button"
import { Brain } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { User } from "@clerk/clerk-react"

interface DashboardHeaderProps {
  user: User | null | undefined
  totalNotes: number
  favoriteNotes: number
  totalTasks: number
}

export function DashboardHeader({ user, totalNotes, favoriteNotes, totalTasks }: DashboardHeaderProps) {
  const navigate = useNavigate()
  const { toast } = useToast()

  const getAIInsights = () => {
    toast({
      title: "Navigating to AI Insights",
      description: "Opening AI Productivity Tips page...",
    })
    navigate("/ai-tips")
  }

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome to SkillSync, {user?.firstName || 'User'}!
        </h1>
        <p className="text-muted-foreground mt-1">
          {totalNotes > 0 || totalTasks > 0 
            ? `You have ${totalNotes} notes (${favoriteNotes} favorites) and ${totalTasks} tasks. Keep up the great work!`
            : "Start your productivity journey by creating your first note or task."
          }
        </p>
      </div>
      <Button className="gap-2" onClick={getAIInsights}>
        <Brain className="h-4 w-4" />
        Get AI Insights
      </Button>
    </div>
  )
}
