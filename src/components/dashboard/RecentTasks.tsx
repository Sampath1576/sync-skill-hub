
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckSquare, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  due_date: string
}

interface RecentTasksProps {
  tasks: Task[]
}

export function RecentTasks({ tasks }: RecentTasksProps) {
  const navigate = useNavigate()

  return (
    <Card className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5" />
          Recent Tasks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.length > 0 ? (
          <>
            {tasks.slice(0, 3).map((task) => (
              <div key={task.id} className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => navigate("/tasks")}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${task.completed ? 'bg-green-500' : task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-500'}`}></div>
                  <h4 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>{task.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                </p>
              </div>
            ))}
            {tasks.length > 3 && (
              <Button variant="outline" className="w-full" onClick={() => navigate("/tasks")}>
                View All {tasks.length} Tasks
              </Button>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
            <p className="text-muted-foreground mb-4">Add your first task to start managing your productivity.</p>
            <Button onClick={() => navigate("/tasks")} className="gap-2">
              <Plus className="h-4 w-4" />
              Create First Task
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
