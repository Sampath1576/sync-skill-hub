
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, User } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@clerk/clerk-react"

export function ProfileSettings() {
  const { toast } = useToast()
  const { user, isLoaded } = useUser()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    username: "",
  })

  // Automatically populate profile data when user loads
  useEffect(() => {
    if (isLoaded && user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
      })
    }
  }, [isLoaded, user])

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive"
        })
        return
      }

      try {
        // Convert file to base64 and update Clerk user profile
        const reader = new FileReader()
        reader.onload = async (e) => {
          const avatarUrl = e.target?.result as string
          try {
            await user?.setProfileImage({ file })
            toast({
              title: "Avatar Updated",
              description: "Your profile picture has been updated successfully",
            })
          } catch (error) {
            console.error('Avatar upload error:', error)
            toast({
              title: "Upload Failed",
              description: "Failed to update profile picture",
              variant: "destructive"
            })
          }
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error('Avatar upload error:', error)
        toast({
          title: "Upload Failed",
          description: "Failed to update profile picture",
          variant: "destructive"
        })
      }
    }
  }

  const saveProfile = async () => {
    if (!profileData.firstName.trim() || !profileData.lastName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    if (!user) {
      toast({
        title: "Error",
        description: "User information not available",
        variant: "destructive"
      })
      return
    }

    try {
      console.log('Updating user profile with data:', profileData)
      
      // Update user profile using Clerk's update method
      await user.update({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        username: profileData.username || undefined, // Don't send empty string
      })
      
      console.log('Profile updated successfully')
      toast({
        title: "Profile Updated",
        description: "Your profile changes have been saved successfully",
      })
    } catch (error) {
      console.error('Profile update error:', error)
      
      // More specific error handling
      let errorMessage = "Failed to update profile"
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive"
      })
    }
  }

  if (!isLoaded) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-20 w-20 bg-muted rounded-full"></div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="h-10 bg-muted rounded"></div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.imageUrl} alt="Profile" />
            <AvatarFallback className="text-lg">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Photo
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              JPG, PNG or GIF (max. 5MB)
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              value={profileData.username}
              onChange={(e) => setProfileData({...profileData, username: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={user?.primaryEmailAddress?.emailAddress || ""}
              disabled
              className="bg-muted"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input 
              id="firstName" 
              value={profileData.firstName}
              onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input 
              id="lastName" 
              value={profileData.lastName}
              onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
            />
          </div>
        </div>
        
        <Button onClick={saveProfile}>Save Changes</Button>
      </CardContent>
    </Card>
  )
}
