
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Search, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { exportToPDF } from "@/utils/pdfExport"
import { useUser } from "@/contexts/UserContext"

interface NotesHeaderProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  notes: any[]
  onCreateNote: () => void
}

export function NotesHeader({ searchTerm, setSearchTerm, notes, onCreateNote }: NotesHeaderProps) {
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()
  const { user } = useUser()

  const exportNotes = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "User information not available",
        variant: "destructive"
      })
      return
    }

    if (notes.length === 0) {
      toast({
        title: "No Notes to Export",
        description: "Create some notes first before exporting",
        variant: "destructive"
      })
      return
    }

    setIsExporting(true)
    toast({
      title: "Exporting Notes",
      description: "Generating PDF with all your notes...",
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
        exportDate: new Date().toISOString()
      })
      
      setIsExporting(false)
      toast({
        title: "Export Complete",
        description: "Your notes have been downloaded as PDF",
      })
    } catch (error) {
      setIsExporting(false)
      toast({
        title: "Export Failed",
        description: "There was an error exporting your notes",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold">Notes</h1>
        <p className="text-muted-foreground mt-1">Organize and search your knowledge base</p>
      </div>
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          className="gap-2" 
          onClick={exportNotes}
          disabled={isExporting || notes.length === 0}
        >
          <Download className="h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export PDF'}
        </Button>
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
    </div>
  )
}
