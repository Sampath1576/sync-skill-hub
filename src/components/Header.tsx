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

export function Header() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showResults, setShowResults] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()
  const { search, results, isLoading } = useGlobalSearch()
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
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
        title: "Search initiated",
        description: `Found ${results.length} results for: ${searchTerm}`,
      })
      console.log("Searching for:", searchTerm)
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

  const handleNotifications = () => {
    toast({
      title: "Notifications",
      description: "You have 3 new notifications",
    })
    console.log("Notifications clicked")
  }

  const handleProfileClick = () => {
    navigate("/settings")
    console.log("Profile clicked")
  }

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
    navigate("/")
    console.log("Logout clicked")
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
                <div className="p-4 text-center text-muted-foreground">Searching...</div>
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
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 w-9 rounded-full" 
          onClick={handleNotifications}
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </Button>
        
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback>
                  <CircleUser className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">John Doe</p>
                <p className="text-xs leading-none text-muted-foreground">
                  john@example.com
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
