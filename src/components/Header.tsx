
import { Search, Bell, Settings, User, LogOut, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggle } from "./ThemeToggle"
import { useGlobalSearch } from "@/hooks/useGlobalSearch"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useClerk, useUser } from "@clerk/clerk-react"

const mockNotifications = [
  {
    id: 1,
    title: "Team Meeting",
    message: "You have a meeting at 2:00 PM today",
    time: "10 minutes ago",
    type: "meeting"
  },
  {
    id: 2,
    title: "Task Due",
    message: "Complete project documentation by 5:00 PM",
    time: "1 hour ago",
    type: "task"
  },
  {
    id: 3,
    title: "New Note",
    message: "AI tip: Use the Pomodoro technique for better focus",
    time: "2 hours ago",
    type: "tip"
  }
]

export function Header() {
  const { searchQuery, setSearchQuery, searchResults, isSearching } = useGlobalSearch()
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const navigate = useNavigate()
  const { signOut } = useClerk()
  const { user } = useUser()

  const handleSignOut = () => {
    signOut(() => navigate("/"))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "meeting":
        return "📅"
      case "task":
        return "✅"
      case "tip":
        return "💡"
      default:
        return "🔔"
    }
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Search */}
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search notes, tasks, events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              </div>
            )}
            
            {/* Search Results */}
            {searchQuery && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                    onClick={() => {
                      navigate(result.path)
                      setSearchQuery("")
                    }}
                  >
                    <div className="font-medium text-sm">{result.title}</div>
                    <div className="text-xs text-muted-foreground">{result.type} • {result.path}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {/* Notifications */}
          <Popover open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="relative h-9 w-9 rounded-full">
                <Bell className="h-4 w-4" />
                {mockNotifications.length > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                    {mockNotifications.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Notifications</h3>
              </div>
              <ScrollArea className="h-80">
                {mockNotifications.length > 0 ? (
                  <div className="p-2">
                    {mockNotifications.map((notification) => (
                      <div key={notification.id} className="flex items-start gap-3 p-3 hover:bg-muted rounded-lg cursor-pointer">
                        <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No notifications
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.imageUrl || "/placeholder.svg"} alt={user?.fullName || "User"} />
                  <AvatarFallback>
                    {user?.firstName?.[0]}{user?.lastName?.[0] || user?.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.fullName || user?.username || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.primaryEmailAddress?.emailAddress || "No email"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link to="/settings">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/settings">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
