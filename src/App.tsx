import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { BottomNav } from "./components/layout/BottomNav";
import { Auth } from "./pages/Auth";
import { Onboarding } from "./pages/Onboarding";
import { Dashboard } from "./pages/Dashboard";
import { TimelineDetail } from "./pages/TimelineDetail";
import { CreateTimeline } from "./pages/CreateTimeline";
import { Assistant } from "./pages/Assistant";
import { Portfolio } from "./pages/Portfolio";
import { Profile } from "./pages/Profile";
import { Notifications } from "./pages/Notifications";
import { Wallet } from "./pages/Wallet";
import { Marketplace } from "./pages/Marketplace";
import { Train } from "./pages/Train";
import { Settings } from "./pages/Settings";
import { StatsBreakdown } from "./pages/StatsBreakdown";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Check if user is authenticated and onboarded
const isAuthenticated = () => {
  // In a real app, check for auth tokens
  return localStorage.getItem('userEmail') !== null;
};

const isOnboarded = () => {
  return localStorage.getItem('onboardingComplete') === 'true';
};

const App = () => {
  // Mock auth check - in real app, this would be more sophisticated
  if (!isAuthenticated()) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="*" element={<Auth />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  if (!isOnboarded()) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="*" element={<Onboarding />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Portfolio />} />
                <Route path="/timeline/:id" element={<TimelineDetail />} />
                <Route path="/create" element={<CreateTimeline />} />
                <Route path="/create-modal" element={<CreateTimeline />} />
                <Route path="/assistant" element={<Assistant />} />
                <Route path="/assistant-modal" element={<Assistant />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/train" element={<Train />} />
                <Route path="/stats" element={<StatsBreakdown />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <BottomNav />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
