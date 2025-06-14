
import { useUser } from "@clerk/clerk-react"
import { supabase } from "@/integrations/supabase/client"
import { useEffect } from "react"

export function useSupabaseAuth() {
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (isLoaded && user) {
      console.log('Setting up Supabase session for user:', user.id)
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
      
      // Create or update user profile
      const createProfile = async () => {
        try {
          const { data: existingProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .maybeSingle()

          if (!existingProfile && !fetchError) {
            console.log('Creating new profile for user:', user.id)
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                first_name: user.firstName,
                last_name: user.lastName,
                username: user.username
              })
            
            if (insertError) {
              console.error('Error creating profile:', insertError)
            } else {
              console.log('Profile created successfully')
            }
          }
        } catch (error) {
          console.error('Error with profile management:', error)
        }
      }

      createProfile()
    }
  }, [user, isLoaded])

  return { user, isLoaded }
}
