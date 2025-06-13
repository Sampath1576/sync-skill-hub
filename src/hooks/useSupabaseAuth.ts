
import { useUser } from "@clerk/clerk-react"
import { supabase } from "@/integrations/supabase/client"
import { useEffect } from "react"

export function useSupabaseAuth() {
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (isLoaded && user) {
      // Set the auth token for Supabase
      const token = user.id // Using Clerk user ID as the auth token
      supabase.auth.setSession({
        access_token: token,
        refresh_token: token,
        expires_in: 3600,
        token_type: 'bearer',
        user: {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress || '',
          user_metadata: {
            first_name: user.firstName,
            last_name: user.lastName,
            username: user.username
          }
        }
      } as any)
    }
  }, [user, isLoaded])

  return { user, isLoaded }
}
