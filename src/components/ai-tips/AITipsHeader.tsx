
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface AITipsHeaderProps {
  isRefreshing: boolean
  onRefresh: () => void
}

export function AITipsHeader({ isRefreshing, onRefresh }: AITipsHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold">AI Productivity Tips</h1>
        <p className="text-muted-foreground mt-1">Personalized insights to boost your productivity</p>
      </div>
      <Button 
        className="gap-2" 
        onClick={onRefresh}
        disabled={isRefreshing}
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        {isRefreshing ? 'Generating...' : 'Refresh Tips'}
      </Button>
    </div>
  )
}
