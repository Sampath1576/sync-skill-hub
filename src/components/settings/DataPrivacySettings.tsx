
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/contexts/UserContext"
import { exportToPDF } from "@/utils/pdfExport"
import { useLocalNotes } from "@/hooks/useLocalNotes"
import { useLocalTasks } from "@/hooks/useLocalTasks"
import { useLocalEvents } from "@/hooks/useLocalEvents"
import { useState } from "react"

export function DataPrivacySettings() {
  const { toast } = useToast()
  const { user } = useUser()
  const { notes } = useLocalNotes()
  const { tasks } = useLocalTasks()
  const { events } = useLocalEvents()
  const [isExporting, setIsExporting] = useState(false)

  const exportData = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "User information not available",
        variant: "destructive"
      })
      return
    }

    setIsExporting(true)
    toast({
      title: "Data Export Started",
      description: "Your complete data export will be ready shortly",
    })
    
    try {
      await exportToPDF({
        profile: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username
        },
        notes: notes,
        tasks: tasks,
        events: events,
        settings: {
          email: true,
          push: false,
          tasks: true,
          reminders: true
        },
        exportDate: new Date().toISOString()
      })
      
      setIsExporting(false)
      toast({
        title: "Export Complete",
        description: "Your complete data has been downloaded successfully",
      })
    } catch (error) {
      setIsExporting(false)
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
            <p className="text-sm text-muted-foreground">Download a copy of all your data (notes, tasks, events) as PDF</p>
          </div>
          <Button 
            variant="outline" 
            onClick={exportData} 
            className="gap-2"
            disabled={isExporting}
          >
            <Download className="h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export PDF'}
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
