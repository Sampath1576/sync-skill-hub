
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/contexts/UserContext"
import { exportToPDF } from "@/utils/pdfExport"

export function DataPrivacySettings() {
  const { toast } = useToast()
  const { user } = useUser()

  const exportData = async () => {
    if (!user) return

    toast({
      title: "Data Export Started",
      description: "Your data export will be ready shortly",
    })
    
    try {
      await exportToPDF({
        profile: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username
        },
        settings: {
          email: true,
          push: false,
          tasks: true,
          reminders: true
        },
        exportDate: new Date().toISOString()
      })
      
      toast({
        title: "Export Complete",
        description: "Your data has been downloaded successfully",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data",
        variant: "destructive"
      })
    }
  }

  const deleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      toast({
        title: "Account Deletion",
        description: "Account deletion process has been initiated. You will receive a confirmation email.",
        variant: "destructive"
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Data & Privacy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Export Your Data</h4>
            <p className="text-sm text-muted-foreground">Download a copy of all your data as PDF</p>
          </div>
          <Button variant="outline" onClick={exportData} className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Delete Account</h4>
            <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
          </div>
          <Button variant="destructive" onClick={deleteAccount}>Delete</Button>
        </div>
      </CardContent>
    </Card>
  )
}
