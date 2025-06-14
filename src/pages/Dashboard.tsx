
import { Header } from "@/components/Header"
import { AppSidebar } from "@/components/AppSidebar"
import { useNavigate } from "react-router-dom"
import { useUser } from "@clerk/clerk-react"
import { useLocalNotes } from "@/hooks/useLocalNotes"
import { useLocalTasks } from "@/hooks/useLocalTasks"
import { useLocalEvents } from "@/hooks/useLocalEvents"
import { AITipsWidget } from "@/components/AITipsWidget"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardStats } from "@/components/dashboard/DashboardStats"
import { RecentNotes } from "@/components/dashboard/RecentNotes"
import { RecentTasks } from "@/components/dashboard/RecentTasks"
import { ProgressOverview } from "@/components/dashboard/ProgressOverview"
import { SampleDataAlert } from "@/components/dashboard/SampleDataAlert"
import { useEffect } from "react"

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, isLoaded, isSignedIn } = useUser()
  const { notes, isLoading: notesLoading } = useLocalNotes()
  const { tasks, isLoading: tasksLoading } = useLocalTasks()
  const { events, isLoading: eventsLoading } = useLocalEvents()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/login', { replace: true })
    }
  }, [isLoaded, isSignedIn, navigate])

  // Show loading while checking auth state
  if (!isLoaded) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-muted rounded w-48 mb-4 mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if not signed in (will redirect)
  if (!isSignedIn) {
    return null
  }

  // Check if user has sample data
  const hasSampleData = notes.some(note => note.title.includes('Welcome to SkillSync')) ||
                       tasks.some(task => task.title.includes('Complete Project Setup')) ||
                       events.some(event => event.title.includes('SkillSync Orientation'))

  // Calculate progress statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.completed).length
  const totalNotes = notes.length
  const favoriteNotes = notes.filter(note => note.favorite).length
  const upcomingEvents = events.filter(event => new Date(event.event_date) >= new Date()).length
  
  // Calculate study hours (estimated based on completed tasks)
  const studyHours = Math.round(completedTasks * 1.5) // Assuming 1.5 hours per completed task

  if (notesLoading || tasksLoading || eventsLoading) {
    return (
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-48 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded"></div>
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
            <DashboardHeader 
              user={user}
              totalNotes={totalNotes}
              favoriteNotes={favoriteNotes}
              totalTasks={totalTasks}
            />

            <SampleDataAlert hasSampleData={hasSampleData} />

            <DashboardStats
              totalNotes={totalNotes}
              favoriteNotes={favoriteNotes}
              completedTasks={completedTasks}
              totalTasks={totalTasks}
              studyHours={studyHours}
              upcomingEvents={upcomingEvents}
            />

            <div className="grid lg:grid-cols-2 gap-6">
              <RecentNotes notes={notes} />
              <RecentTasks tasks={tasks} />
            </div>

            <ProgressOverview
              completedTasks={completedTasks}
              totalTasks={totalTasks}
              totalNotes={totalNotes}
              favoriteNotes={favoriteNotes}
              upcomingEvents={upcomingEvents}
            />

            <AITipsWidget className="mt-6 animate-fade-in" style={{ animationDelay: "0.7s" } as any} />
          </div>
        </main>
      </div>
    </div>
  )
}
