
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Clock, Trophy, Github, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const HostChallenge = () => {
  const [activeTab, setActiveTab] = useState("create");
  const navigate = useNavigate();
  const { isAuthenticated, signInWithGitHub } = useAuth();
  
  // Mock data for submissions
  const mockSubmissions = [];

  // Check authentication status
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in with GitHub to host a challenge.",
      });
    }
  }, [isAuthenticated]);

  // If not authenticated, show sign-in prompt
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="max-w-md w-full">
            <Card>
              <CardHeader>
                <CardTitle>Sign in Required</CardTitle>
                <CardDescription>
                  You need to sign in with GitHub to host and manage challenges.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center py-8">
                <Button onClick={signInWithGitHub} className="w-full flex items-center justify-center gap-2">
                  <Github className="h-4 w-4" />
                  <span>Sign in with GitHub</span>
                </Button>
              </CardContent>
            </Card>
          </div>
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
              <Card>
                <CardHeader>
                  <CardTitle>Challenge Details</CardTitle>
                  <CardDescription>
                    Fill in the details of your AI hackathon challenge
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Challenge Title</Label>
                    <Input id="title" placeholder="Enter a catchy title for your challenge" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="short-desc">Short Description</Label>
                    <Textarea 
                      id="short-desc" 
                      placeholder="A brief description (150 chars max)" 
                      className="resize-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="full-desc">Full Description</Label>
                    <Textarea 
                      id="full-desc" 
                      placeholder="Detailed explanation of the challenge" 
                      className="min-h-[200px] resize-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="sponsor">Sponsor Name</Label>
                      <Input id="sponsor" placeholder="Your company name" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="deadline">Submission Deadline</Label>
                      <Input id="deadline" type="date" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Requirements</Label>
                    <div className="grid grid-cols-1 gap-2">
                      <Textarea placeholder="Requirement 1" className="resize-none" />
                      <Textarea placeholder="Requirement 2" className="resize-none" />
                      <Textarea placeholder="Requirement 3" className="resize-none" />
                      <Button variant="outline" className="mt-2">+ Add Requirement</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Prizes</Label>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full gradient-bg flex items-center justify-center text-white">
                          <Trophy className="h-5 w-5" />
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <Input placeholder="1st Place" defaultValue="1st Place" />
                          <Input placeholder="Prize description" />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center text-white">
                          <Trophy className="h-5 w-5" />
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <Input placeholder="2nd Place" defaultValue="2nd Place" />
                          <Input placeholder="Prize description" />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-amber-700 flex items-center justify-center text-white">
                          <Trophy className="h-5 w-5" />
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <Input placeholder="3rd Place" defaultValue="3rd Place" />
                          <Input placeholder="Prize description" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline">Save Draft</Button>
                  <Button className="gradient-bg">Publish Challenge</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="manage" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Challenges</CardTitle>
                  <CardDescription>
                    Manage all your ongoing and past challenges
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    You haven't created any challenges yet. 
                    <Button 
                      variant="link" 
                      onClick={() => setActiveTab("create")} 
                      className="font-bold"
                    >
                      Create your first challenge
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="submissions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Review Submissions</CardTitle>
                  <CardDescription>
                    Score and provide feedback on submitted projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {mockSubmissions.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Participant</TableHead>
                          <TableHead>Challenge</TableHead>
                          <TableHead>AI Score</TableHead>
                          <TableHead>GitHub</TableHead>
                          <TableHead>Demo</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* This will be populated with actual submissions */}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      No submissions to review yet.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HostChallenge;
