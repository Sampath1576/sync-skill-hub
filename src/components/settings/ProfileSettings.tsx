
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import { ProfileAvatar } from "./ProfileAvatar"
import { ProfileForm } from "./ProfileForm"
import { useProfileManager } from "@/hooks/useProfileManager"

export function ProfileSettings() {
  const {
    profileData,
    setProfileData,
    isUpdating,
    saveProfile,
    isLoaded
  } = useProfileManager()

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
        <ProfileAvatar />
        
        <ProfileForm 
          profileData={profileData}
          onProfileDataChange={setProfileData}
        />
        
        <Button 
          onClick={saveProfile} 
          disabled={isUpdating}
        >
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  )
}
