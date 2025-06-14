
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

interface SampleDataAlertProps {
  hasSampleData: boolean
}

export function SampleDataAlert({ hasSampleData }: SampleDataAlertProps) {
  if (!hasSampleData) return null

  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <strong>Welcome!</strong> This is sample data to help you get started. You can edit or delete these items and add your own content to make SkillSync your personal productivity hub.
      </AlertDescription>
    </Alert>
  )
}
