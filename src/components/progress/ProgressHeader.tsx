
import { Button } from "@/components/ui/button"
import { RefreshCw, Download, BarChart3 } from "lucide-react"

interface ProgressHeaderProps {
  onRefresh: () => void;
  onExport: () => void;
  onGenerateReport: () => void;
  isRefreshing: boolean;
  isExporting: boolean;
  isGeneratingReport: boolean;
}

export function ProgressHeader({
  onRefresh,
  onExport,
  onGenerateReport,
  isRefreshing,
  isExporting,
  isGeneratingReport
}: ProgressHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold">Progress Tracker</h1>
        <p className="text-muted-foreground mt-1">Monitor your productivity and achievements</p>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="gap-2" 
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
        <Button 
          variant="outline" 
          className="gap-2" 
          onClick={onExport}
          disabled={isExporting}
        >
          <Download className="h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export PDF'}
        </Button>
        <Button 
          className="gap-2" 
          onClick={onGenerateReport}
          disabled={isGeneratingReport}
        >
          <BarChart3 className="h-4 w-4" />
          {isGeneratingReport ? 'Generating...' : 'Generate Report'}
        </Button>
      </div>
    </div>
  )
}
