
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

export function useAuthRedirect() {
  const { isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        // User is signed in, redirect to dashboard
        navigate('/dashboard', { replace: true });
      } else {
        // User is not signed in, redirect to login
        navigate('/login', { replace: true });
      }
    }
  }, [isLoaded, isSignedIn, navigate]);

  return { isLoaded, isSignedIn };
}
