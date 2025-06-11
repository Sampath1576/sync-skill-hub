
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/contexts/UserContext"

export function SecuritySettings() {
  const { toast } = useToast()
  const { updatePassword, validatePassword } = useUser()
  
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  })

  const handlePasswordUpdate = () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      toast({
        title: "Validation Error",
        description: "Please fill in all password fields",
        variant: "destructive"
      })
      return
    }

    if (!validatePassword(passwordData.current)) {
      toast({
        title: "Incorrect Password",
        description: "Current password is incorrect",
        variant: "destructive"
      })
      return
    }

    if (passwordData.new !== passwordData.confirm) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match",
        variant: "destructive"
      })
      return
    }

    if (passwordData.new.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      })
      return
    }

    const success = updatePassword(passwordData.current, passwordData.new)
    if (success) {
      setPasswordData({ current: "", new: "", confirm: "" })
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-password">Current Password</Label>
          <Input 
            id="current-password" 
            type="password" 
            value={passwordData.current}
            onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="new-password">New Password</Label>
          <Input 
            id="new-password" 
            type="password" 
            value={passwordData.new}
            onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm New Password</Label>
          <Input 
            id="confirm-password" 
            type="password" 
            value={passwordData.confirm}
            onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
          />
        </div>
        
        <Button variant="outline" onClick={handlePasswordUpdate}>Update Password</Button>
      </CardContent>
    </Card>
  )
}
