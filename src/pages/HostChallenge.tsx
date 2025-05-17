
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

// Import our new components
import AuthRequired from "@/components/host-challenge/AuthRequired";
import CreateChallengeForm from "@/components/host-challenge/CreateChallengeForm";
import ManageChallenges from "@/components/host-challenge/ManageChallenges";
import ReviewSubmissions from "@/components/host-challenge/ReviewSubmissions";

const HostChallenge = () => {
  const [activeTab, setActiveTab] = useState("create");
  const { isAuthenticated } = useAuth();
  
  // Check authentication status
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in with GitHub to host a challenge.",
      });
    }
  }, [isAuthenticated]);

  const handleCreateNewClick = () => {
    setActiveTab("create");
  };

  // If not authenticated, show sign-in prompt
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
          <AuthRequired />
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Host Challenge</h1>
              <p className="text-muted-foreground text-lg">
                Create and manage your AI hackathon challenges
              </p>
            </div>
          </div>
          
          <Tabs defaultValue="create" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="create">Create Challenge</TabsTrigger>
              <TabsTrigger value="manage">Manage Challenges</TabsTrigger>
              <TabsTrigger value="submissions">Review Submissions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create" className="space-y-6">
              <CreateChallengeForm />
            </TabsContent>
            
            <TabsContent value="manage" className="space-y-6">
              <ManageChallenges onCreateNew={handleCreateNewClick} />
            </TabsContent>
            
            <TabsContent value="submissions" className="space-y-6">
              <ReviewSubmissions />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HostChallenge;
