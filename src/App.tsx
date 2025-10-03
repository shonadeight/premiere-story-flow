import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "./components/layout/Navbar";
import { BottomNav } from "./components/layout/BottomNav";

import { Onboarding } from "./pages/Onboarding";
import { Dashboard } from "./pages/Dashboard";
import { TimelineDetail } from "./pages/TimelineDetail";
import { Assistant } from "./pages/Assistant";
import { Portfolio } from "./pages/Portfolio";
import { Profile } from "./pages/Profile";
import { Notifications } from "./pages/Notifications";
import { Wallet } from "./pages/Wallet";
import { Marketplace } from "./pages/Marketplace";
import { Train } from "./pages/Train";
import { Settings } from "./pages/Settings";
import { StatsBreakdown } from "./pages/StatsBreakdown";
import { About } from "./pages/About";
import { Create } from "./pages/Create";
import Contributions from "./pages/Contributions";
import ContributionDetail from "./pages/ContributionDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check if user has completed onboarding
          setTimeout(async () => {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('onboarding_completed')
                .eq('user_id', session.user.id)
                .single();
              
              setOnboardingCompleted(profile?.onboarding_completed || false);
            } catch (error) {
              console.error('Error checking profile:', error);
              setOnboardingCompleted(false);
            } finally {
              setLoading(false);
            }
          }, 0);
        } else {
          setOnboardingCompleted(false);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(async () => {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('onboarding_completed')
              .eq('user_id', session.user.id)
              .single();
            
            setOnboardingCompleted(profile?.onboarding_completed || false);
          } catch (error) {
            console.error('Error checking profile:', error);
            setOnboardingCompleted(false);
          } finally {
            setLoading(false);
          }
        }, 0);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Handle different authentication scenarios
  if (!user || !session) {
    // Not logged in - show onboarding/login
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/about" element={<About />} />
              <Route path="/assistant-modal" element={<Assistant />} />
              <Route path="*" element={<Onboarding />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // User is logged in but hasn't completed onboarding
  if (!onboardingCompleted) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/about" element={<About />} />
              <Route path="/assistant-modal" element={<Assistant />} />
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
            <Routes>
              {/* Main app layout with header and nav */}
              <Route path="/" element={
                <div className="min-h-screen bg-background flex flex-col">
                  <Navbar />
                  <main className="flex-1 overflow-hidden relative">
                    <div className="page-transition ios-push-enter"><Portfolio /></div>
                  </main>
                  <BottomNav />
                </div>
              } />
              <Route path="/portfolio" element={
                <div className="min-h-screen bg-background flex flex-col">
                  <Navbar />
                  <main className="flex-1 overflow-hidden relative">
                    <div className="page-transition ios-push-enter"><Portfolio /></div>
                  </main>
                  <BottomNav />
                </div>
              } />
              <Route path="/assistant" element={
                <div className="min-h-screen bg-background flex flex-col">
                  <Navbar />
                  <main className="flex-1 overflow-hidden relative">
                    <div className="page-transition ios-push-enter"><Assistant /></div>
                  </main>
                  <BottomNav />
                </div>
              } />
              <Route path="/assistant-modal" element={
                <div className="min-h-screen bg-background flex flex-col">
                  <Navbar />
                  <main className="flex-1 overflow-hidden relative">
                    <div className="page-transition ios-push-enter"><Assistant /></div>
                  </main>
                  <BottomNav />
                </div>
              } />
              <Route path="/profile" element={
                <div className="min-h-screen bg-background flex flex-col">
                  <Navbar />
                  <main className="flex-1 overflow-hidden relative">
                    <div className="page-transition ios-push-enter"><Profile /></div>
                  </main>
                  <BottomNav />
                </div>
              } />
              <Route path="/notifications" element={
                <div className="min-h-screen bg-background flex flex-col">
                  <Navbar />
                  <main className="flex-1 overflow-hidden relative">
                    <div className="page-transition ios-push-enter"><Notifications /></div>
                  </main>
                  <BottomNav />
                </div>
              } />
              <Route path="/wallet" element={
                <div className="min-h-screen bg-background flex flex-col">
                  <Navbar />
                  <main className="flex-1 overflow-hidden relative">
                    <div className="page-transition ios-push-enter"><Wallet /></div>
                  </main>
                  <BottomNav />
                </div>
              } />
              <Route path="/marketplace" element={
                <div className="min-h-screen bg-background flex flex-col">
                  <Navbar />
                  <main className="flex-1 overflow-hidden relative">
                    <div className="page-transition ios-push-enter"><Marketplace /></div>
                  </main>
                  <BottomNav />
                </div>
              } />
              <Route path="/settings" element={
                <div className="min-h-screen bg-background flex flex-col">
                  <Navbar />
                  <main className="flex-1 overflow-hidden relative">
                    <div className="page-transition ios-push-enter"><Settings /></div>
                  </main>
                  <BottomNav />
                </div>
              } />
              <Route path="/train" element={
                <div className="min-h-screen bg-background flex flex-col">
                  <Navbar />
                  <main className="flex-1 overflow-hidden relative">
                    <div className="page-transition ios-push-enter"><Train /></div>
                  </main>
                  <BottomNav />
                </div>
              } />
              <Route path="/stats" element={
                <div className="min-h-screen bg-background flex flex-col">
                  <Navbar />
                  <main className="flex-1 overflow-hidden relative">
                    <div className="page-transition ios-push-enter"><StatsBreakdown /></div>
                  </main>
                  <BottomNav />
                </div>
              } />
              
              {/* Full screen pushed pages without navbar/bottomnav */}
              <Route path="/create" element={<div className="page-transition ios-push-enter ios-full-screen"><Create /></div>} />
              <Route path="/create-modal" element={<div className="page-transition ios-push-enter ios-full-screen"><Create /></div>} />
              <Route path="/timeline/:id" element={<div className="page-transition ios-push-enter ios-full-screen"><TimelineDetail /></div>} />
              <Route path="/contributions" element={<div className="page-transition ios-push-enter ios-full-screen"><Contributions /></div>} />
              <Route path="/contributions/:id" element={<div className="page-transition ios-push-enter ios-full-screen"><ContributionDetail /></div>} />
              <Route path="/about" element={<div className="page-transition ios-push-enter ios-full-screen"><About /></div>} />
              
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={
                <div className="min-h-screen bg-background flex flex-col">
                  <Navbar />
                  <main className="flex-1 overflow-hidden relative">
                    <div className="page-transition ios-push-enter"><NotFound /></div>
                  </main>
                  <BottomNav />
                </div>
              } />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
