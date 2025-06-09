
import { useState } from "react"
import { Header } from "@/components/Header"
import { AppSidebar } from "@/components/AppSidebar"
import { FloatingActionButton } from "@/components/FloatingActionButton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Plus, Filter, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Task {
  id: number
  title: string
  description: string
  status: "todo" | "in-progress" | "done"
  priority: "high" | "medium" | "low"
  dueDate: string
  tags: string[]
  completed: boolean
}

export default function Tasks() {
  const [view, setView] = useState("list")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState<"high" | "medium" | "low">("medium")
  const [newTaskDueDate, setNewTaskDueDate] = useState("")
  const [newTaskTags, setNewTaskTags] = useState("")
  const { toast } = useToast()
  
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Complete React assignment",
      description: "Build a todo app with React hooks and context",
      status: "todo",
      priority: "high",
      dueDate: "Today",
      tags: ["coding", "react"],
      completed: false
    },
    {
      id: 2,
      title: "Review meeting notes",
      description: "Go through the weekly team meeting notes and extract action items",
      status: "in-progress",
      priority: "medium",
      dueDate: "Tomorrow",
      tags: ["meeting", "review"],
      completed: false
    },
    {
      id: 3,
      title: "Update portfolio website",
      description: "Add recent projects and update the design",
      status: "todo",
      priority: "low",
      dueDate: "This week",
      tags: ["portfolio", "design"],
      completed: false
    },
    {
      id: 4,
      title: "Study machine learning",
      description: "Complete chapter 3 of the ML course",
      status: "in-progress",
      priority: "high",
      dueDate: "Friday",
      tags: ["study", "ml"],
      completed: false
    },
    {
      id: 5,
      title: "Write blog post",
      description: "Article about React best practices",
      status: "done",
      priority: "medium",
      dueDate: "Last week",
      tags: ["writing", "react"],
      completed: true
    }
  ])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-destructive bg-destructive/10"
      case "medium": return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20"
      case "low": return "text-muted-foreground bg-muted"
      default: return "text-muted-foreground bg-muted"
    }
  }

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newStatus = task.completed ? "todo" : "done"
        const updatedTask = { 
          ...task, 
          completed: !task.completed,
          status: newStatus as "todo" | "in-progress" | "done"
        }
        toast({
          title: updatedTask.completed ? "Task completed!" : "Task reopened",
          description: `"${task.title}" marked as ${updatedTask.completed ? "complete" : "incomplete"}`,
        })
        return updatedTask
      }
      return task
    }))
  }

  const editTask = (task: Task) => {
    setEditingTask(task)
    setNewTaskTitle(task.title)
    setNewTaskDescription(task.description)
    setNewTaskPriority(task.priority)
    setNewTaskDueDate(task.dueDate)
    setNewTaskTags(task.tags.join(", "))
    setIsDialogOpen(true)
  }

  const deleteTask = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId)
    setTasks(prev => prev.filter(task => task.id !== taskId))
    toast({
      title: "Task deleted",
      description: `"${task?.title}" has been deleted`,
      variant: "destructive"
    })
  }

  const saveTask = () => {
    if (!newTaskTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task title",
        variant: "destructive"
      })
      return
    }

    const tags = newTaskTags.split(",").map(tag => tag.trim()).filter(tag => tag)
    
    if (editingTask) {
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id 
          ? { 
              ...task, 
              title: newTaskTitle, 
              description: newTaskDescription, 
              priority: newTaskPriority,
              dueDate: newTaskDueDate,
              tags 
            }
          : task
      ))
      toast({
        title: "Task updated",
        description: `"${newTaskTitle}" has been updated`,
      })
    } else {
      const newTask: Task = {
        id: Math.max(...tasks.map(t => t.id)) + 1,
        title: newTaskTitle,
        description: newTaskDescription,
        status: "todo",
        priority: newTaskPriority,
        dueDate: newTaskDueDate,
        tags,
        completed: false
      }
      setTasks(prev => [newTask, ...prev])
      toast({
        title: "Task created",
        description: `"${newTaskTitle}" has been created`,
      })
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setNewTaskTitle("")
    setNewTaskDescription("")
    setNewTaskPriority("medium")
    setNewTaskDueDate("")
    setNewTaskTags("")
    setEditingTask(null)
  }

  const openNewTaskDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const TaskCard = ({ task }: { task: Task }) => (
    <Card className="card-hover group">
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
              onClick={() => deleteTask(task.id)}
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
            {task.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {task.dueDate}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const KanbanColumn = ({ title, status, tasks }: { title: string, status: string, tasks: Task[] }) => (
    <div className="flex-1">
      <div className="bg-muted rounded-lg p-4">
        <h3 className="font-semibold mb-4 flex items-center justify-between">
          {title}
          <Badge variant="secondary">{tasks.filter(t => t.status === status).length}</Badge>
        </h3>
        <div className="space-y-3">
          {tasks
            .filter(task => task.status === status)
            .map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
        </div>
      </div>
    </div>
  )

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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setShowFilters(!showFilters)
                    toast({
                      title: "Filters",
                      description: showFilters ? "Filters hidden" : "Filters shown",
                    })
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                
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
                {tasks.map((task, index) => (
                  <div key={task.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <TaskCard task={task} />
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="kanban">
                <div className="flex gap-6 h-[calc(100vh-200px)] overflow-x-auto">
                  <KanbanColumn title="To Do" status="todo" tasks={tasks} />
                  <KanbanColumn title="In Progress" status="in-progress" tasks={tasks} />
                  <KanbanColumn title="Done" status="done" tasks={tasks} />
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
            <Input 
              placeholder="Add tags (comma separated)..." 
              value={newTaskTags}
              onChange={(e) => setNewTaskTags(e.target.value)}
            />
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
