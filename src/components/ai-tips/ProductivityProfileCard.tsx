
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ProductivityProfileCard() {
  const { toast } = useToast()

  const handleProfileClick = (profileType: string, description: string) => {
    toast({
      title: `${profileType} Profile`,
      description: description,
    })
  }

  return (
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
            onClick={() => handleProfileClick(
              "Morning Person", 
              "Your peak productivity hours and tips for maximizing morning performance."
            )}
          >
            <div className="text-3xl font-bold text-primary mb-2">Morning Person</div>
            <p className="text-sm text-muted-foreground">You're 45% more productive in the morning</p>
          </div>
          <div 
            className="text-center cursor-pointer hover:bg-muted/50 p-4 rounded-lg transition-colors"
            onClick={() => handleProfileClick(
              "High Focus", 
              "Your focus patterns and strategies for maintaining concentration."
            )}
          >
            <div className="text-3xl font-bold text-green-600 mb-2">High Focus</div>
            <p className="text-sm text-muted-foreground">Average focus session: 32 minutes</p>
          </div>
          <div 
            className="text-center cursor-pointer hover:bg-muted/50 p-4 rounded-lg transition-colors"
            onClick={() => handleProfileClick(
              "Task Switcher", 
              "Your multitasking patterns and optimization recommendations."
            )}
          >
            <div className="text-3xl font-bold text-blue-600 mb-2">Task Switcher</div>
            <p className="text-sm text-muted-foreground">You handle 8.5 different tasks per day</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
