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
          <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-1 overflow-hidden relative">
              <Routes>
                <Route path="/" element={<div className="page-transition ios-push-enter"><Portfolio /></div>} />
                <Route path="/timeline/:id" element={<div className="page-transition ios-push-enter"><TimelineDetail /></div>} />
                <Route path="/create" element={<div className="page-transition ios-push-enter"><CreateTimeline /></div>} />
                <Route path="/create-modal" element={<div className="page-transition ios-push-enter"><CreateTimeline /></div>} />
                <Route path="/assistant" element={<div className="page-transition ios-push-enter"><Assistant /></div>} />
                <Route path="/assistant-modal" element={<div className="page-transition ios-push-enter"><Assistant /></div>} />
                <Route path="/portfolio" element={<div className="page-transition ios-push-enter"><Portfolio /></div>} />
                <Route path="/profile" element={<div className="page-transition ios-push-enter"><Profile /></div>} />
                <Route path="/notifications" element={<div className="page-transition ios-push-enter"><Notifications /></div>} />
                <Route path="/wallet" element={<div className="page-transition ios-push-enter"><Wallet /></div>} />
                <Route path="/marketplace" element={<div className="page-transition ios-push-enter"><Marketplace /></div>} />
                <Route path="/settings" element={<div className="page-transition ios-push-enter"><Settings /></div>} />
                <Route path="/train" element={<div className="page-transition ios-push-enter"><Train /></div>} />
                <Route path="/stats" element={<div className="page-transition ios-push-enter"><StatsBreakdown /></div>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<div className="page-transition ios-push-enter"><NotFound /></div>} />
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
