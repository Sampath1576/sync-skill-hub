
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
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast({
        title: "Error",
        description: "Failed to load tasks",
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
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          user_id: user.id,
          ...taskData
        }])
        .select()
        .single()

      if (error) throw error
      
      setTasks(prev => [data, ...prev])
      toast({
        title: "Task created",
        description: `"${taskData.title}" has been created`,
      })
      return data
    } catch (error) {
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
    priority: string
    due_date?: string
    completed?: boolean
  }) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ ...taskData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setTasks(prev => prev.map(task => task.id === id ? data : task))
      toast({
        title: "Task updated",
        description: `"${taskData.title}" has been updated`,
      })
      return data
    } catch (error) {
      console.error('Error updating task:', error)
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive"
      })
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTasks(prev => prev.filter(task => task.id !== id))
      toast({
        title: "Task deleted",
        description: "Task has been deleted",
        variant: "destructive"
      })
    } catch (error) {
      console.error('Error deleting task:', error)
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive"
      })
    }
  }

  const toggleTaskCompletion = async (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return

    const updatedTask = {
      ...task,
      completed: !task.completed
    }

    await updateTask(id, updatedTask)
  }

  useEffect(() => {
    fetchTasks()
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
