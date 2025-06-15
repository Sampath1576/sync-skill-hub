
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
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
  user_id: string
}

export function useSupabaseTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load tasks from Supabase
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setIsLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error loading tasks:', error)
          toast({
            title: "Error",
            description: "Failed to load tasks",
            variant: "destructive"
          })
        } else {
          setTasks(data || [])
        }
      } catch (error) {
        console.error('Error loading tasks:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [toast])

  const createTask = async (taskData: {
    title: string
    description: string
    priority: "high" | "medium" | "low"
    due_date?: string
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create tasks",
          variant: "destructive"
        })
        return
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            ...taskData,
            user_id: user.id,
            completed: false,
            due_date: taskData.due_date ? new Date(taskData.due_date).toISOString() : null
          }
        ])
        .select()
        .single()

      if (error) {
        console.error('Error creating task:', error)
        toast({
          title: "Error",
          description: "Failed to create task",
          variant: "destructive"
        })
        return
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
      const { data, error } = await supabase
        .from('tasks')
        .update({
          ...taskData,
          due_date: taskData.due_date ? new Date(taskData.due_date).toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating task:', error)
        toast({
          title: "Error",
          description: "Failed to update task",
          variant: "destructive"
        })
        return
      }

      setTasks(prev => prev.map(task => 
        task.id === id ? data : task
      ))
      
      toast({
        title: "Task updated",
        description: "Task has been successfully updated",
      })
      return data
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
      const task = tasks.find(t => t.id === id)
      if (!task) return

      const { data, error } = await supabase
        .from('tasks')
        .update({ 
          completed: !task.completed, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error toggling task:', error)
        toast({
          title: "Error",
          description: "Failed to update task",
          variant: "destructive"
        })
        return
      }

      setTasks(prev => prev.map(t => 
        t.id === id ? data : t
      ))
      
      toast({
        title: data.completed ? "Task completed" : "Task reopened",
        description: data.completed ? "Great job!" : "Task marked as pending",
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
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting task:', error)
        toast({
          title: "Error",
          description: "Failed to delete task",
          variant: "destructive"
        })
        return
      }

      setTasks(prev => prev.filter(task => task.id !== id))
      
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
