
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SearchProvider } from "@/contexts/SearchContext";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="skillsync-ui-theme">
      <SearchProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/ai-tips" element={<AITips />} />
              <Route path="/settings" element={<Settings />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SearchProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
