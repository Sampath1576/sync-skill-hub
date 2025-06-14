
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useUser } from '@clerk/clerk-react'

interface StockData {
  notes: Array<{
    id: string
    title: string
    content: string
    favorite: boolean
    created_at: string
    updated_at: string
  }>
  tasks: Array<{
    id: string
    title: string
    description: string
    completed: boolean
    priority: 'low' | 'medium' | 'high'
    due_date: string
    created_at: string
    updated_at: string
  }>
  events: Array<{
    id: string
    title: string
    description: string
    event_date: string
    event_time: string
    attendees: number
    created_at: string
  }>
}

interface StockDataContextType {
  isUsingStockData: boolean
  setIsUsingStockData: (use: boolean) => void
  stockData: StockData
  updateStockData: (data: Partial<StockData>) => void
  resetStockData: () => void
}

const StockDataContext = createContext<StockDataContextType | undefined>(undefined)

const getDefaultStockData = (): StockData => ({
  notes: [
    {
      id: 'stock-note-1',
      title: 'Welcome to SkillSync! 🎉',
      content: 'This is a sample note to help you get started. You can edit, delete, or create new notes to organize your thoughts and ideas.',
      favorite: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'stock-note-2',
      title: 'Study Tips for Better Learning',
      content: 'Here are some effective study techniques:\n\n1. Pomodoro Technique - 25 min study, 5 min break\n2. Active recall - Test yourself frequently\n3. Spaced repetition - Review material at increasing intervals\n4. Take handwritten notes for better retention',
      favorite: false,
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'stock-note-3',
      title: 'Project Ideas',
      content: 'Collection of project ideas for skill development:\n\n- Build a personal portfolio website\n- Create a mobile app\n- Contribute to open source projects\n- Start a blog about your learning journey',
      favorite: false,
      created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    }
  ],
  tasks: [
    {
      id: 'stock-task-1',
      title: 'Complete Project Setup',
      description: 'Set up the development environment and initialize the project repository',
      completed: true,
      priority: 'high',
      due_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'stock-task-2',
      title: 'Review Course Materials',
      description: 'Go through the latest course materials and take notes on key concepts',
      completed: false,
      priority: 'medium',
      due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'stock-task-3',
      title: 'Practice Coding Exercise',
      description: 'Complete the coding challenges from chapter 5',
      completed: false,
      priority: 'high',
      due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'stock-task-4',
      title: 'Update Resume',
      description: 'Add recent projects and skills to resume',
      completed: false,
      priority: 'low',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    }
  ],
  events: [
    {
      id: 'stock-event-1',
      title: 'SkillSync Orientation',
      description: 'Introduction session to get familiar with all features',
      event_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      event_time: '10:00',
      attendees: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 'stock-event-2',
      title: 'Weekly Progress Review',
      description: 'Review completed tasks and plan for the upcoming week',
      event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      event_time: '15:30',
      attendees: 1,
      created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'stock-event-3',
      title: 'Study Group Meeting',
      description: 'Collaborative learning session with peers',
      event_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      event_time: '18:00',
      attendees: 5,
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    }
  ]
})

// Helper function to get user-specific storage key
const getUserStorageKey = (userId: string, dataType: string) => {
  return `skillsync_${dataType}_${userId}`
}

export function StockDataProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser()
  const [isUsingStockData, setIsUsingStockData] = useState(false)
  const [stockData, setStockData] = useState<StockData>(getDefaultStockData())

  // Load user-specific stock data when user changes
  useEffect(() => {
    if (isLoaded && user) {
      console.log('Loading stock data for user:', user.id)
      
      // Load stock data preference
      const stockDataPref = localStorage.getItem(getUserStorageKey(user.id, 'stock_preference'))
      setIsUsingStockData(stockDataPref === 'true')
      
      // Load user-specific stock data
      const savedStockData = localStorage.getItem(getUserStorageKey(user.id, 'stock_data'))
      if (savedStockData) {
        try {
          const parsedData = JSON.parse(savedStockData)
          setStockData(parsedData)
          console.log('Loaded saved stock data for user:', user.id)
        } catch (error) {
          console.error('Error parsing saved stock data:', error)
          setStockData(getDefaultStockData())
        }
      } else {
        // Initialize with default stock data for new user
        setStockData(getDefaultStockData())
      }
    } else if (isLoaded && !user) {
      // Reset state when user logs out
      setIsUsingStockData(false)
      setStockData(getDefaultStockData())
    }
  }, [user, isLoaded])

  // Save stock data preference when it changes
  useEffect(() => {
    if (user && isLoaded) {
      localStorage.setItem(getUserStorageKey(user.id, 'stock_preference'), isUsingStockData.toString())
      console.log('Saved stock data preference for user:', user.id, isUsingStockData)
    }
  }, [isUsingStockData, user, isLoaded])

  const updateStockData = (newData: Partial<StockData>) => {
    if (!user) return
    
    const updatedData = { ...stockData, ...newData }
    setStockData(updatedData)
    
    // Save to user-specific localStorage
    localStorage.setItem(getUserStorageKey(user.id, 'stock_data'), JSON.stringify(updatedData))
    console.log('Updated stock data for user:', user.id)
  }

  const resetStockData = () => {
    if (!user) return
    
    const defaultData = getDefaultStockData()
    setStockData(defaultData)
    
    // Save reset data to user-specific localStorage
    localStorage.setItem(getUserStorageKey(user.id, 'stock_data'), JSON.stringify(defaultData))
    console.log('Reset stock data for user:', user.id)
  }

  const toggleStockData = (use: boolean) => {
    setIsUsingStockData(use)
    console.log('Toggled stock data for user:', user?.id, 'to:', use)
  }

  return (
    <StockDataContext.Provider value={{
      isUsingStockData,
      setIsUsingStockData: toggleStockData,
      stockData,
      updateStockData,
      resetStockData
    }}>
      {children}
    </StockDataContext.Provider>
  )
}

export function useStockData() {
  const context = useContext(StockDataContext)
  if (context === undefined) {
    throw new Error('useStockData must be used within a StockDataProvider')
  }
  return context
}
