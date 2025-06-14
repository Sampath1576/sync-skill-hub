
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@clerk/clerk-react"

export function useProfileManager() {
  const { toast } = useToast()
  const { user, isLoaded } = useUser()
  
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    username: "",
  })
  const [isUpdating, setIsUpdating] = useState(false)

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
      setIsUpdating(true)
      console.log('Updating user profile with data:', profileData)
      
      // Update user details with Clerk's correct parameter format
      await user.update({
        // Use the correct parameter names expected by Clerk API
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        username: profileData.username || undefined,
      })
      
      console.log('Profile updated successfully')
      
      // Update local state to reflect changes
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
      })
      
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
    } finally {
      setIsUpdating(false)
    }
  }

  return {
    profileData,
    setProfileData,
    isUpdating,
    saveProfile,
    isLoaded,
    user
  }
}
