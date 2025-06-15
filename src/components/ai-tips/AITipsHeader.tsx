
import { Button } from "@/components/ui/button"
import { RefreshCw, CheckCircle } from "lucide-react"

interface AITipsHeaderProps {
  isRefreshing: boolean
  onRefresh: () => void
  onApplyAll?: () => void
  hasUnappliedTips?: boolean
}

export function AITipsHeader({ isRefreshing, onRefresh, onApplyAll, hasUnappliedTips }: AITipsHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold">AI Productivity Tips</h1>
        <p className="text-muted-foreground mt-1">Personalized insights to boost your productivity</p>
      </div>
      <div className="flex gap-2">
        {hasUnappliedTips && onApplyAll && (
          <Button 
            variant="outline"
            className="gap-2" 
            onClick={onApplyAll}
          >
            <CheckCircle className="h-4 w-4" />
            Apply All Tips
          </Button>
        )}
        <Button 
          className="gap-2" 
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Generating...' : 'Refresh Tips'}
        </Button>
      </div>
    </div>
  )
}
