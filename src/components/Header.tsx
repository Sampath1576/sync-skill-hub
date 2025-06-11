
import { Search, Bell, CircleUser } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useGlobalSearch } from "@/hooks/useGlobalSearch"
import { SearchResult } from "@/contexts/SearchContext"
import { useUser } from "@/contexts/UserContext"

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'meeting' | 'task' | 'reminder';
}

export function Header() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()
  const { search, results, isLoading } = useGlobalSearch()
  const { user, logout } = useUser()
  const searchRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)

  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Team Meeting Reminder",
      message: "You have a team meeting at 2:00 PM today",
      time: "10 minutes ago",
      type: "meeting"
    },
    {
      id: 2,
      title: "Task Due Soon",
      message: "Complete React assignment is due in 2 hours",
      time: "30 minutes ago",
      type: "task"
    },
    {
      id: 3,
      title: "Study Session",
      message: "Time for your scheduled ML study session",
      time: "1 hour ago",
      type: "reminder"
    }
  ])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (searchTerm.trim()) {
      search(searchTerm)
      setShowResults(true)
    } else {
      setShowResults(false)
    }
  }, [searchTerm, search])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      search(searchTerm)
      setShowResults(true)
      toast({
        title: "Search completed",
        description: `Found ${results.length} results for: ${searchTerm}`,
      })
    }
  }

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url)
    setShowResults(false)
    setSearchTerm("")
    toast({
      title: "Opening result",
      description: `Loading "${result.title}"`,
    })
  }

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'note':
        return '📝'
      case 'task':
        return '✅'
      case 'event':
        return '📅'
      default:
        return '🔍'
    }
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'meeting':
        return '📅'
      case 'task':
        return '✅'
      case 'reminder':
        return '⏰'
      default:
        return '🔔'
    }
  }

  const handleNotifications = () => {
    setShowNotifications(!showNotifications)
  }

  const handleProfileClick = () => {
    navigate("/settings")
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
    navigate("/")
  }

  return (
    <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4 flex-1">
        <div ref={searchRef} className="relative max-w-md flex-1">
          <form onSubmit={handleSearch}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search notes, tasks, events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
              onFocus={() => searchTerm.trim() && setShowResults(true)}
            />
          </form>
          
          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    Searching...
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div className="py-2">
                  {results.map((result) => (
                    <div
                      key={result.id}
                      className="px-4 py-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-lg">{getResultIcon(result.type)}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{result.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {result.content}
                          </p>
                          <span className="text-xs text-primary mt-1 capitalize">
                            {result.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No results found for "{searchTerm}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div ref={notificationRef} className="relative">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 w-9 rounded-full relative" 
            onClick={handleNotifications}
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </Button>
          
          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-background border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Notifications</h3>
              </div>
              {notifications.length > 0 ? (
                <div className="py-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="px-4 py-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                      onClick={() => {
                        toast({
                          title: notification.title,
                          description: notification.message,
                        })
                        setShowNotifications(false)
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <span className="text-xs text-muted-foreground mt-1">
                            {notification.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No new notifications
                </div>
              )}
            </div>
          )}
        </div>
        
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt="User" />
                <AvatarFallback>
                  <CircleUser className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user ? `${user.firstName} ${user.lastName}` : 'User'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfileClick}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
