
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AchievementOverviewCardProps {
  productivityScore: number;
  taskCompletionRate: number;
  goalAchievementRate: number;
}

export function AchievementOverviewCard({ 
  productivityScore, 
  taskCompletionRate, 
  goalAchievementRate 
}: AchievementOverviewCardProps) {
  const { toast } = useToast()

  return (
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
                  description: `Current productivity score: ${productivityScore}%`,
                })
              }}
            >
              <div className="text-3xl font-bold text-primary">{productivityScore}%</div>
            </div>
            <p className="text-sm text-muted-foreground">Overall Productivity Score</p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div 
              className="text-center cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors"
              onClick={() => {
                toast({
                  title: "Task Completion",
                  description: `${taskCompletionRate}% of tasks completed`,
                })
              }}
            >
              <div className="text-2xl font-bold text-green-600">{taskCompletionRate}%</div>
              <p className="text-xs text-muted-foreground">Task Completion</p>
            </div>
            <div 
              className="text-center cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors"
              onClick={() => {
                toast({
                  title: "Goal Achievement",
                  description: `${goalAchievementRate}% goal achievement rate`,
                })
              }}
            >
              <div className="text-2xl font-bold text-blue-600">{goalAchievementRate}%</div>
              <p className="text-xs text-muted-foreground">Goal Achievement</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
