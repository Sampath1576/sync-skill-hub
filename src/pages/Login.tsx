
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Link } from "react-router-dom"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { SignIn, SignUp } from "@clerk/clerk-react"

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false)
  const { toast } = useToast()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <span className="font-semibold text-xl">SkillSync</span>
          </div>
          
          <h1 className="text-2xl font-bold">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-muted-foreground">
            {isSignUp 
              ? "Sign up to start boosting your productivity" 
              : "Sign in to your account to continue"
            }
          </p>
        </div>

        {/* Clerk Auth Components */}
        <Card>
          <CardContent className="p-6">
            {isSignUp ? (
              <SignUp 
                fallbackRedirectUrl="/dashboard"
                appearance={{
                  elements: {
                    rootBox: "mx-auto",
                    card: "shadow-none border-0 bg-transparent",
                  }
                }}
              />
            ) : (
              <SignIn 
                fallbackRedirectUrl="src/pages/dashboard"
                appearance={{
                  elements: {
                    rootBox: "mx-auto",
                    card: "shadow-none border-0 bg-transparent",
                  }
                }}
              />
            )}
          </CardContent>
        </Card>

        {/* Toggle between Sign In and Sign Up */}
        <div className="text-center">
          <Button 
            variant="link" 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-muted-foreground"
          >
            {isSignUp 
              ? "Already have an account? Sign in" 
              : "Don't have an account? Sign up"
            }
          </Button>
        </div>
      </div>
    </div>
  )
}
