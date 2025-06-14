
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from "@clerk/clerk-react"

interface ProfileFormProps {
  profileData: {
    firstName: string
    lastName: string
    username: string
  }
  onProfileDataChange: (data: { firstName: string; lastName: string; username: string }) => void
}

export function ProfileForm({ profileData, onProfileDataChange }: ProfileFormProps) {
  const { user } = useUser()

  const handleFieldChange = (field: keyof typeof profileData, value: string) => {
    onProfileDataChange({
      ...profileData,
      [field]: value
    })
  }

  return (
    <>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input 
            id="username" 
            value={profileData.username}
            onChange={(e) => handleFieldChange('username', e.target.value)}
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
            onChange={(e) => handleFieldChange('firstName', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input 
            id="lastName" 
            value={profileData.lastName}
            onChange={(e) => handleFieldChange('lastName', e.target.value)}
          />
        </div>
      </div>
    </>
  )
}
