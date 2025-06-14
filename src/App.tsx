
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SearchProvider } from "@/contexts/SearchContext";
import { UserProvider } from "@/contexts/UserContext";
import { StockDataProvider } from "@/contexts/StockDataContext";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="skillsync-ui-theme">
      <UserProvider>
        <StockDataProvider>
          <SearchProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={
                    <>
                      <SignedOut>
                        <Login />
                      </SignedOut>
                      <SignedIn>
                        <Dashboard />
                      </SignedIn>
                    </>
                  } />
                  <Route path="/dashboard" element={
                    <SignedIn>
                      <Dashboard />
                    </SignedIn>
                  } />
                  <Route path="/notes" element={
                    <SignedIn>
                      <Notes />
                    </SignedIn>
                  } />
                  <Route path="/tasks" element={
                    <SignedIn>
                      <Tasks />
                    </SignedIn>
                  } />
                  <Route path="/calendar" element={
                    <SignedIn>
                      <Calendar />
                    </SignedIn>
                  } />
                  <Route path="/progress" element={
                    <SignedIn>
                      <Progress />
                    </SignedIn>
                  } />
                  <Route path="/ai-tips" element={
                    <SignedIn>
                      <AITips />
                    </SignedIn>
                  } />
                  <Route path="/settings" element={
                    <SignedIn>
                      <Settings />
                    </SignedIn>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </SearchProvider>
        </StockDataProvider>
      </UserProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
