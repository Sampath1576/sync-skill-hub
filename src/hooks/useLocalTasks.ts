
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: "high" | "medium" | "low"
  due_date?: string
  created_at: string
  updated_at: string
}

export function useLocalTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load tasks from localStorage on mount
  useEffect(() => {
    const loadTasks = () => {
      try {
        const storedTasks = localStorage.getItem('skillsync_tasks')
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks))
        } else {
          // Initialize with sample tasks for first-time users
          const sampleTasks: Task[] = [
            {
              id: '1',
              title: 'Complete Project Setup',
              description: 'Set up your workspace and familiarize yourself with SkillSync features',
              priority: 'high',
              due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
              completed: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: '2',
              title: 'Review Sample Notes',
              description: 'Go through the sample notes and customize them to your needs',
              priority: 'medium',
              due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
              completed: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: '3',
              title: 'Schedule First Event',
              description: 'Try creating your first event in the Calendar section',
              priority: 'medium',
              due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
              completed: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: '4',
              title: 'Welcome Task - Getting Started',
              description: 'This is a sample completed task to show how progress tracking works',
              priority: 'low',
              due_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              completed: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]
          setTasks(sampleTasks)
          localStorage.setItem('skillsync_tasks', JSON.stringify(sampleTasks))
        }
      } catch (error) {
        console.error('Error loading tasks:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [])

  const saveTasksToStorage = (updatedTasks: Task[]) => {
    localStorage.setItem('skillsync_tasks', JSON.stringify(updatedTasks))
    setTasks(updatedTasks)
  }

  const createTask = async (taskData: {
    title: string
    description: string
    priority: "high" | "medium" | "low"
    due_date?: string
  }) => {
    try {
      const newTask: Task = {
        id: Date.now().toString(),
        ...taskData,
        completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const updatedTasks = [newTask, ...tasks]
      saveTasksToStorage(updatedTasks)
      
      toast({
        title: "Task created",
        description: `"${taskData.title}" has been created`,
      })
      return newTask
    } catch (error: any) {
      console.error('Error creating task:', error)
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive"
      })
    }
  }

  const updateTask = async (id: string, taskData: {
    title: string
    description: string
    priority: "high" | "medium" | "low"
    due_date?: string
  }) => {
    try {
      const updatedTasks = tasks.map(task => 
        task.id === id 
          ? { ...task, ...taskData, updated_at: new Date().toISOString() }
          : task
      )
      saveTasksToStorage(updatedTasks)
      
      toast({
        title: "Task updated",
        description: "Task has been successfully updated",
      })
      return updatedTasks.find(task => task.id === id)
    } catch (error: any) {
      console.error('Error updating task:', error)
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive"
      })
    }
  }

  const toggleTaskCompletion = async (id: string) => {
    try {
      const updatedTasks = tasks.map(task => 
        task.id === id 
          ? { ...task, completed: !task.completed, updated_at: new Date().toISOString() }
          : task
      )
      saveTasksToStorage(updatedTasks)
      
      const task = updatedTasks.find(t => t.id === id)
      toast({
        title: task?.completed ? "Task completed" : "Task reopened",
        description: task?.completed ? "Great job!" : "Task marked as pending",
      })
    } catch (error: any) {
      console.error('Error toggling task:', error)
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive"
      })
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const updatedTasks = tasks.filter(task => task.id !== id)
      saveTasksToStorage(updatedTasks)
      
      toast({
        title: "Task deleted",
        description: "Task has been removed",
        variant: "destructive"
      })
    } catch (error: any) {
      console.error('Error deleting task:', error)
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive"
      })
    }
  }

  return {
    tasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    refetch: () => {}
  }
}
