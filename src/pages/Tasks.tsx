
import { useState } from "react"
import { Header } from "@/components/Header"
import { AppSidebar } from "@/components/AppSidebar"
import { FloatingActionButton } from "@/components/FloatingActionButton"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar, Plus, Filter, Edit, Trash2 } from "lucide-react"
import { useLocalTasks } from "@/hooks/useLocalTasks"

export default function Tasks() {
  const [view, setView] = useState("list")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<any>(null)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState<"high" | "medium" | "low">("medium")
  const [newTaskDueDate, setNewTaskDueDate] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  
  const { tasks, isLoading, createTask, updateTask, deleteTask, toggleTaskCompletion } = useLocalTasks()

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-destructive bg-destructive/10"
      case "medium": return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20"
      case "low": return "text-muted-foreground bg-muted"
      default: return "text-muted-foreground bg-muted"
    }
  }

  // Sort tasks to put completed ones at the bottom
  const getSortedTasks = () => {
    return [...tasks].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1
      }
      return 0
    })
  }

  // Filter tasks based on status
  const getFilteredTasks = () => {
    const sortedTasks = getSortedTasks()
    if (statusFilter === "all") return sortedTasks
    return sortedTasks.filter(task => {
      if (statusFilter === "completed") return task.completed
      if (statusFilter === "pending") return !task.completed
      return true
    })
  }

  const editTask = (task: any) => {
    setEditingTask(task)
    setNewTaskTitle(task.title)
    setNewTaskDescription(task.description)
    setNewTaskPriority(task.priority)
    setNewTaskDueDate(task.due_date ? task.due_date.split('T')[0] : "")
    setIsDialogOpen(true)
  }

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId)
  }

  const saveTask = async () => {
    if (!newTaskTitle.trim()) return

    const taskData = {
      title: newTaskTitle,
      description: newTaskDescription,
      priority: newTaskPriority,
      due_date: newTaskDueDate ? new Date(newTaskDueDate).toISOString() : undefined
    }
    
    if (editingTask) {
      await updateTask(editingTask.id, taskData)
    } else {
      await createTask(taskData)
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setNewTaskTitle("")
    setNewTaskDescription("")
    setNewTaskPriority("medium")
    setNewTaskDueDate("")
    setEditingTask(null)
  }

  const openNewTaskDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const TaskCard = ({ task }: { task: any }) => (
    <Card className={`card-hover group ${task.completed ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox 
              checked={task.completed}
              onCheckedChange={() => toggleTaskCompletion(task.id)}
              className="mt-1"
            />
            <div className="flex-1">
              <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                {task.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => editTask(task)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-destructive"
              onClick={() => handleDeleteTask(task.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {task.due_date ? new Date(task.due_date).toLocaleDateString() : "No due date"}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const KanbanColumn = ({ title, status, tasks }: { title: string, status: string, tasks: any[] }) => (
    <div className="flex-1">
      <div className="bg-muted rounded-lg p-4">
        <h3 className="font-semibold mb-4 flex items-center justify-between">
          {title}
          <Badge variant="secondary">{tasks.filter(t => status === "completed" ? t.completed : !t.completed).length}</Badge>
        </h3>
        <div className="space-y-3">
          {tasks
            .filter(task => status === "completed" ? task.completed : !task.completed)
            .map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
        </div>
      </div>
    </div>
  )

  const filteredTasks = getFilteredTasks()

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-48 mb-4"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-24 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">Tasks</h1>
                <p className="text-muted-foreground mt-1">Manage your tasks and stay organized</p>
              </div>
              
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter: {statusFilter === "all" ? "All" : statusFilter === "completed" ? "Completed" : "Pending"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                      All Tasks
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
                      Completed
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Tabs value={view} onValueChange={setView} className="w-fit">
                  <TabsList>
                    <TabsTrigger value="list">List</TabsTrigger>
                    <TabsTrigger value="kanban">Kanban</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <Tabs value={view} className="w-full">
              <TabsContent value="list" className="space-y-4">
                {filteredTasks.map((task, index) => (
                  <div key={task.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <TaskCard task={task} />
                  </div>
                ))}
                {filteredTasks.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No tasks found for the selected filter.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="kanban">
                <div className="flex gap-6 h-[calc(100vh-200px)] overflow-x-auto">
                  <KanbanColumn title="Pending" status="pending" tasks={filteredTasks} />
                  <KanbanColumn title="Completed" status="completed" tasks={filteredTasks} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingTask ? "Edit Task" : "Create New Task"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input 
              placeholder="Task title..." 
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <Textarea 
              placeholder="Task description..." 
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <Select value={newTaskPriority} onValueChange={(value: "high" | "medium" | "low") => setNewTaskPriority(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Input 
                type="date" 
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveTask}>
                {editingTask ? "Update Task" : "Create Task"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <FloatingActionButton 
        onClick={openNewTaskDialog}
        icon={<Plus className="h-6 w-6" />}
        ariaLabel="Create new task"
      />
    </div>
  )
}
