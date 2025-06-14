
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SearchProvider } from "@/contexts/SearchContext";
import { UserProvider } from "@/contexts/UserContext";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import Tasks from "./pages/Tasks";
import Calendar from "./pages/Calendar";
import Progress from "./pages/Progress";
import AITips from "./pages/AITips";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Create QueryClient instance outside component to prevent recreation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <SignedIn>
      {children}
    </SignedIn>
  );
};

// Public Route component (redirects to dashboard if signed in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SignedOut>
        {children}
      </SignedOut>
      <SignedIn>
        <Navigate to="/dashboard" replace />
      </SignedIn>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="skillsync-ui-theme">
      <UserProvider>
        <SearchProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/notes" element={
                  <ProtectedRoute>
                    <Notes />
                  </ProtectedRoute>
                } />
                <Route path="/tasks" element={
                  <ProtectedRoute>
                    <Tasks />
                  </ProtectedRoute>
                } />
                <Route path="/calendar" element={
                  <ProtectedRoute>
                    <Calendar />
                  </ProtectedRoute>
                } />
                <Route path="/progress" element={
                  <ProtectedRoute>
                    <Progress />
                  </ProtectedRoute>
                } />
                <Route path="/ai-tips" element={
                  <ProtectedRoute>
                    <AITips />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SearchProvider>
      </UserProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
