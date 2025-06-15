
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useUser } from "@clerk/clerk-react"
import { useToast } from "@/hooks/use-toast"

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: string
  due_date: string
  created_at: string
  updated_at: string
}

export function useSupabaseTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useUser()
  const { toast } = useToast()

  const fetchTasks = async () => {
    if (!user) {
      setIsLoading(false)
      return
    }

    try {
      console.log('Fetching tasks for user:', user.id)
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching tasks:', error)
        throw error
      }
      
      console.log('Tasks fetched:', data?.length || 0)
      setTasks(data || [])
    } catch (error: any) {
      console.error('Error fetching tasks:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to load tasks",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createTask = async (taskData: {
    title: string
    description: string
    priority: string
    due_date?: string
  }) => {
    if (!user) return

    try {
      console.log('Creating task for user:', user.id)
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          user_id: user.id,
          ...taskData
        }])
        .select()
        .single()

      if (error) {
        console.error('Error creating task:', error)
        throw error
      }
      
      setTasks(prev => [data, ...prev])
      toast({
        title: "Task created",
        description: `"${taskData.title}" has been created`,
      })
      return data
    } catch (error: any) {
      console.error('Error creating task:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to create task",
        variant: "destructive"
      })
    }
  }

  const updateTask = async (id: string, taskData: {
    title: string
    description: string
    priority: string
    due_date?: string
    completed?: boolean
  }) => {
    try {
      console.log('Updating task:', id)
      const { data, error } = await supabase
        .from('tasks')
        .update({ ...taskData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating task:', error)
        throw error
      }

      setTasks(prev => prev.map(task => task.id === id ? data : task))
      toast({
        title: "Task updated",
        description: `"${taskData.title}" has been updated`,
      })
      return data
    } catch (error: any) {
      console.error('Error updating task:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to update task",
        variant: "destructive"
      })
    }
  }

  const deleteTask = async (id: string) => {
    try {
      console.log('Deleting task:', id)
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) {
        console.error('Error deleting task:', error)
        throw error
      }

      setTasks(prev => prev.filter(task => task.id !== id))
      toast({
        title: "Task deleted",
        description: "Task has been deleted",
        variant: "destructive"
      })
    } catch (error: any) {
      console.error('Error deleting task:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete task",
        variant: "destructive"
      })
    }
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
    if (user) {
      fetchTasks()
    }
  }, [user])

  return {
    tasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    refetch: fetchTasks
  }
}
