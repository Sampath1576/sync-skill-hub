
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, RefreshCw, Lightbulb } from "lucide-react"
import { useLocalNotes } from "@/hooks/useLocalNotes"
import { useLocalTasks } from "@/hooks/useLocalTasks"
import { useLocalEvents } from "@/hooks/useLocalEvents"

interface AITipsWidgetProps {
  className?: string
  style?: React.CSSProperties
}

export function AITipsWidget({ className, style }: AITipsWidgetProps) {
  const [currentTip, setCurrentTip] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { notes } = useLocalNotes()
  const { tasks } = useLocalTasks()
  const { events } = useLocalEvents()

  const generateAITip = () => {
    setIsGenerating(true)
    
    const completedTasks = tasks.filter(t => t.completed).length
    const totalTasks = tasks.length
    const upcomingEvents = events.filter(e => new Date(e.event_date) >= new Date()).length
    const favoriteNotes = notes.filter(n => n.favorite).length
    const highPriorityTasks = tasks.filter(t => !t.completed && t.priority === 'high').length
    
    const tips = [
      // Productivity tips based on task completion
      totalTasks > 0 && completedTasks / totalTasks > 0.8 
        ? "🎉 Excellent progress! You've completed over 80% of your tasks. Consider setting more challenging goals to maintain momentum."
        : "💪 Try breaking down large tasks into smaller, manageable chunks. This makes them less overwhelming and easier to complete.",
      
      // Notes organization tips
      notes.length > 5 && favoriteNotes === 0
        ? "⭐ Consider marking your most important notes as favorites for quick access. This helps you find key information faster."
        : "📝 Great note-taking! Try using headers and bullet points to make your notes more scannable and organized.",
      
      // Event management tips
      upcomingEvents > 3
        ? "📅 You have several upcoming events. Consider time-blocking your calendar to ensure you have adequate preparation time."
        : upcomingEvents === 0
        ? "🗓️ No upcoming events scheduled. Consider planning some learning sessions or review meetings to stay on track."
        : "⏰ Perfect event balance! Keep scheduling regular check-ins and planning sessions.",
      
      // Task priority tips
      highPriorityTasks > 2
        ? "🔥 You have multiple high-priority tasks. Focus on completing one before starting another to avoid context switching."
        : "✅ Good task prioritization! Remember to review and adjust priorities weekly based on changing circumstances.",
      
      // General productivity tips
      "🎯 The 2-minute rule: If a task takes less than 2 minutes, do it immediately instead of adding it to your task list.",
      "🧠 Use the Pomodoro Technique: Work for 25 minutes, then take a 5-minute break. This helps maintain focus and prevents burnout.",
      "📊 Review your progress weekly. What worked well? What could be improved? Continuous reflection leads to better productivity.",
      "🌅 Start each day by identifying your top 3 priorities. This helps you focus on what matters most.",
      "🔄 Regular breaks improve creativity and problem-solving. Step away from your work periodically to recharge.",
    ]
    
    // Filter tips based on current data and select randomly
    const relevantTips = tips.filter(tip => typeof tip === 'string')
    const randomTip = relevantTips[Math.floor(Math.random() * relevantTips.length)]
    
    setTimeout(() => {
      setCurrentTip(randomTip)
      setIsGenerating(false)
    }, 1500)
  }

  useEffect(() => {
    generateAITip()
  }, [notes.length, tasks.length, events.length])

  return (
    <Card className={className} style={style}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Productivity Tip
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={generateAITip}
            disabled={isGenerating}
          >
            <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              {isGenerating ? "Analyzing your productivity patterns..." : currentTip}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
