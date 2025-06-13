
import { useUser } from "@clerk/clerk-react"
import { supabase } from "@/integrations/supabase/client"
import { useEffect } from "react"

export function useSupabaseAuth() {
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (isLoaded && user) {
      // Create a basic session object for Supabase
      const sessionData = {
        access_token: user.id,
        refresh_token: user.id,
        expires_in: 3600,
        token_type: 'bearer' as const,
        user: {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress || '',
          user_metadata: {
            first_name: user.firstName,
            last_name: user.lastName,
            username: user.username
          }
        }
      }

      // Set auth session manually
      supabase.auth.setSession(sessionData as any)
    }
  }, [user, isLoaded])

  return { user, isLoaded }
}
