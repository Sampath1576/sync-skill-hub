
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Database, RefreshCw, Info } from "lucide-react"
import { useStockData } from "@/contexts/StockDataContext"
import { useUser } from "@clerk/clerk-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface StockDataWidgetProps {
  className?: string
}

export function StockDataWidget({ className }: StockDataWidgetProps) {
  const { isUsingStockData, setIsUsingStockData, resetStockData } = useStockData()
  const { user } = useUser()

  if (!user) {
    return null
  }

  const handleToggle = (checked: boolean) => {
    setIsUsingStockData(checked)
  }

  const handleReset = () => {
    resetStockData()
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Demo Data Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Personal Demo Data:</strong> This demo data is unique to your account ({user.firstName || 'User'}). 
            Changes you make here won't affect other users' data.
          </AlertDescription>
        </Alert>

        <div className="flex items-center space-x-2">
          <Switch
            id="stock-data"
            checked={isUsingStockData}
            onCheckedChange={handleToggle}
          />
          <Label htmlFor="stock-data">
            Use demo data instead of your real data
          </Label>
        </div>

        {isUsingStockData && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              You're currently viewing demo data. This includes sample notes, tasks, and events
              to help you understand how metrics are calculated.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReset}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reset Demo Data
            </Button>
          </div>
        )}

        {!isUsingStockData && (
          <p className="text-sm text-muted-foreground">
            You're viewing your actual data. Toggle on demo data to see sample content
            and understand how productivity metrics are calculated.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
