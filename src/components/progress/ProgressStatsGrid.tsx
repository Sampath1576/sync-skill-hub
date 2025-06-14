
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface ProgressStat {
  title: string;
  value: string;
  total: string;
  percentage: number;
  icon: React.ComponentType<{ className?: string }>;
}

interface ProgressStatsGridProps {
  stats: ProgressStat[];
}

export function ProgressStatsGrid({ stats }: ProgressStatsGridProps) {
  const { toast } = useToast()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={stat.title} className="card-hover cursor-pointer" onClick={() => {
          toast({
            title: stat.title,
            description: `Current progress: ${stat.value}/${stat.total} (${stat.percentage}%)`,
          })
        }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <span className="text-2xl font-bold">{stat.percentage}%</span>
            </div>
            <h3 className="font-medium mb-2">{stat.title}</h3>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{stat.value}/{stat.total}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mt-3">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${stat.percentage}%` }}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
