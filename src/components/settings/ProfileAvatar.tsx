
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@clerk/clerk-react"

export function ProfileAvatar() {
  const { toast } = useToast()
  const { user } = useUser()
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  return (
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
  )
}
