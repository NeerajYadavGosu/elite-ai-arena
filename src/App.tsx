
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Challenges from "./pages/Challenges";
import ChallengeDetail from "./pages/ChallengeDetail";
import SubmissionForm from "./pages/SubmissionForm";
import Leaderboard from "./pages/Leaderboard";
import HostChallenge from "./pages/HostChallenge";
import NotFound from "./pages/NotFound";
import GitHubCallback from "./components/GitHubCallback";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

// Auth guard for protected routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const user = localStorage.getItem("githubUser");
    setIsAuthenticated(!!user);
    setLoading(false);
  }, []);
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/challenges/:id" element={<ChallengeDetail />} />
          <Route 
            path="/submit/:id" 
            element={
              <ProtectedRoute>
                <SubmissionForm />
              </ProtectedRoute>
            } 
          />
          <Route path="/leaderboard/:id" element={<Leaderboard />} />
          <Route 
            path="/host-challenge" 
            element={
              <ProtectedRoute>
                <HostChallenge />
              </ProtectedRoute>
            } 
          />
          <Route path="/github-callback" element={<GitHubCallback />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
