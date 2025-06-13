
import { ArrowDown, CheckSquare, Brain, Calendar, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react"

export default function LandingPage() {
  const { toast } = useToast()

  const features = [
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Smart Notes",
      description: "AI-powered note organization and summarization"
    },
    {
      icon: <CheckSquare className="h-8 w-8" />,
      title: "Task Management",
      description: "Intelligent task prioritization and tracking"
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Calendar Integration",
      description: "Seamless scheduling and reminder system"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI Insights",
      description: "Personalized productivity recommendations"
    }
  ]

  const exploreFeatures = () => {
    toast({
      title: "Exploring Features",
      description: "Scrolling to features section",
    })
    
    // Smooth scroll to features section
    const featuresSection = document.querySelector('[data-section="features"]')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">S</span>
          </div>
          <span className="font-semibold text-xl">SkillSync</span>
        </div>
        <div className="flex items-center gap-4">
          <SignedOut>
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/login">
              <Button>Get Started</Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link to="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="animate-fade-in">
            <h1 className="text-6xl font-bold tracking-tight mb-6">
              Boost Your Productivity with
              <span className="gradient-bg bg-clip-text text-transparent"> AI-powered SkillSync</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              The ultimate productivity hub for students and professionals. 
              Organize notes, manage tasks, track progress, and get AI-powered insights 
              to supercharge your workflow.
            </p>
            <div className="flex items-center justify-center gap-4 mb-16">
              <SignedOut>
                <Link to="/login">
                  <Button size="lg" className="h-12 px-8 text-lg">
                    Get Started
                  </Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Link to="/dashboard">
                  <Button size="lg" className="h-12 px-8 text-lg">
                    Go to Dashboard
                  </Button>
                </Link>
              </SignedIn>
              <Button variant="outline" size="lg" className="h-12 px-8 text-lg" onClick={exploreFeatures}>
                Explore Features
              </Button>
            </div>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <button 
              onClick={exploreFeatures}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Scroll to features"
            >
              <ArrowDown className="h-6 w-6 mx-auto animate-bounce" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30" data-section="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything you need to stay productive</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you organize, prioritize, and achieve your goals
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="card-hover animate-fade-in border-0 shadow-sm cursor-pointer group"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => {
                  toast({
                    title: feature.title,
                    description: feature.description,
                  })
                }}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                    <div className="text-primary">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to transform your productivity?</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Join thousands of users who have already boosted their productivity with SkillSync
          </p>
          <SignedOut>
            <Link to="/login">
              <Button size="lg" className="h-12 px-12 text-lg">
                Start Your Journey
              </Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link to="/dashboard">
              <Button size="lg" className="h-12 px-12 text-lg">
                Continue Your Journey
              </Button>
            </Link>
          </SignedIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">S</span>
            </div>
            <span className="font-semibold">SkillSync</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 SkillSync. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
