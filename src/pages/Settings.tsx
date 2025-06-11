
import { Header } from "@/components/Header"
import { AppSidebar } from "@/components/AppSidebar"
import { ProfileSettings } from "@/components/settings/ProfileSettings"
import { NotificationSettings } from "@/components/settings/NotificationSettings"
import { SecuritySettings } from "@/components/settings/SecuritySettings"
import { DataPrivacySettings } from "@/components/settings/DataPrivacySettings"

export default function Settings() {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="animate-fade-in max-w-4xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground mt-1">Manage your account and application preferences</p>
            </div>

            <div className="grid gap-6">
              <ProfileSettings />
              <NotificationSettings />
              <SecuritySettings />
              <DataPrivacySettings />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
