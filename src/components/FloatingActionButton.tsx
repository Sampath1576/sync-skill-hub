
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FloatingActionButtonProps {
  onClick: () => void
  icon?: React.ReactNode
  className?: string
  ariaLabel?: string
}

export function FloatingActionButton({ 
  onClick, 
  icon = <Plus className="h-6 w-6" />,
  className = "",
  ariaLabel = "Add new item"
}: FloatingActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={`fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow z-50 ${className}`}
      size="lg"
      aria-label={ariaLabel}
    >
      {icon}
    </Button>
  )
}
