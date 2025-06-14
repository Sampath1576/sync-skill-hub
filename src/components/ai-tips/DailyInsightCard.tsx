
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function DailyInsightCard() {
  const { toast } = useToast()

  const handleClick = () => {
    toast({
      title: "Daily Insight Expanded",
      description: "Wednesday productivity patterns have been analyzed and saved to your profile.",
    })
  }

  return (
    <Card 
      className="mb-8 border-primary/20 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors" 
      onClick={handleClick}
    >
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
  )
}
