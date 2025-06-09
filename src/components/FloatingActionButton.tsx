
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FloatingActionButtonProps {
  onClick: () => void
  icon?: React.ReactNode
  className?: string
}

export function FloatingActionButton({ 
  onClick, 
  icon = <Plus className="h-6 w-6" />,
  className = ""
}: FloatingActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={`fab ${className}`}
      size="lg"
    >
      {icon}
    </Button>
  )
}
