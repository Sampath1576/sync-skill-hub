
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

interface AITip {
  id: number
  category: string
  title: string
  content: string
  icon: any
  color: string
  instructions: string
}

interface AITipCardProps {
  tip: AITip
  index: number
  isFavorite: boolean
  isApplied: boolean
  onToggleFavorite: (tipId: number) => void
  onApplyTip: (tip: AITip) => void
}

export function AITipCard({ 
  tip, 
  index, 
  isFavorite, 
  isApplied, 
  onToggleFavorite, 
  onApplyTip 
}: AITipCardProps) {
  return (
    <Card className="card-hover animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tip.color}`}>
              <tip.icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                {tip.title}
                {isApplied && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Applied
                  </span>
                )}
              </h3>
              <span className="text-sm text-muted-foreground">{tip.category}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleFavorite(tip.id)}
            className="h-8 w-8 p-0"
          >
            <Star 
              className={`h-4 w-4 ${
                isFavorite
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
          onClick={() => onApplyTip(tip)}
          disabled={isApplied}
        >
          {isApplied ? 'Tip Applied ✓' : 'Apply This Tip'}
        </Button>
      </CardContent>
    </Card>
  )
}
