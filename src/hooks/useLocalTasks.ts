
import { useState, useEffect } from "react"
import { useUser } from "@clerk/clerk-react"
import { useStockData } from "@/contexts/StockDataContext"
import { useToast } from "@/hooks/use-toast"

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  due_date: string
  created_at: string
  updated_at: string
}

export function useLocalTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useUser()
  const { isUsingStockData, stockData, updateStockData } = useStockData()
  const { toast } = useToast()

  const getUserStorageKey = () => {
    return user ? `skillsync_tasks_${user.id}` : 'skillsync_tasks_guest'
  }

  const loadTasks = () => {
    if (!user) {
      setIsLoading(false)
      return
    }

    if (isUsingStockData) {
      setTasks(stockData.tasks)
    } else {
      const storageKey = getUserStorageKey()
      const savedTasks = localStorage.getItem(storageKey)
      
      if (savedTasks) {
        try {
          const parsedTasks = JSON.parse(savedTasks)
          setTasks(parsedTasks)
        } catch (error) {
          console.error('Error parsing saved tasks:', error)
          setTasks([])
        }
      } else {
        // Initialize with empty array for new users
        setTasks([])
      }
    }
    setIsLoading(false)
  }

  const saveTasks = (updatedTasks: Task[]) => {
    if (!user) return

    if (isUsingStockData) {
      updateStockData({ tasks: updatedTasks })
    } else {
      const storageKey = getUserStorageKey()
      localStorage.setItem(storageKey, JSON.stringify(updatedTasks))
    }
  }

  const createTask = async (taskData: {
    title: string
    description: string
    priority: 'low' | 'medium' | 'high'
    due_date?: string
  }) => {
    if (!user) return

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: taskData.title,
      description: taskData.description,
      completed: false,
      priority: taskData.priority,
      due_date: taskData.due_date || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const updatedTasks = [newTask, ...tasks]
    setTasks(updatedTasks)
    saveTasks(updatedTasks)

    toast({
      title: "Task created",
      description: `"${taskData.title}" has been created`,
    })
    return newTask
  }

  const updateTask = async (id: string, taskData: {
    title: string
    description: string
    priority: 'low' | 'medium' | 'high'
    due_date?: string
    completed?: boolean
  }) => {
    const updatedTasks = tasks.map(task =>
      task.id === id
        ? { 
            ...task, 
            ...taskData, 
            due_date: taskData.due_date || task.due_date,
            updated_at: new Date().toISOString() 
          }
        : task
    )
    setTasks(updatedTasks)
    saveTasks(updatedTasks)

    toast({
      title: "Task updated",
      description: `"${taskData.title}" has been updated`,
    })
  }

  const deleteTask = async (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id)
    setTasks(updatedTasks)
    saveTasks(updatedTasks)

    toast({
      title: "Task deleted",
      description: "Task has been deleted",
      variant: "destructive"
    })
  }

  const toggleTaskCompletion = async (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return

    const updatedTask = {
      title: task.title,
      description: task.description,
      priority: task.priority,
      due_date: task.due_date,
      completed: !task.completed
    }

    await updateTask(id, updatedTask)
  }

  useEffect(() => {
    loadTasks()
  }, [user, isUsingStockData, stockData])

  return {
    tasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    refetch: loadTasks
  }
}
