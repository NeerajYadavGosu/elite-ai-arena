
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Medal, ChevronLeft, Code, UserCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Define types for challenge and submissions
type Challenge = {
  id: string;
  title: string;
  description: string;
};

type Submission = {
  id: string;
  name: string;
  participant_id: string;
  ai_score: number | null;
  reviewer_score: number | null;
  final_score: number | null;
  status: string;
  created_at: string;
};

// Define feedback type
type Feedback = {
  aiScore: {
    featureCompleteness: number;
    problemAlignment: number;
    technicalClarity: number;
    innovation: number;
    total: number;
    comments: string;
  };
  humanScore: {
    uxDesign: number;
    demoQuality: number;
    technicalSoundness: number;
    practicalValue: number;
    total: number;
    comments: string;
  };
  finalScore: number;
};

// Leaderboard entry type
type LeaderboardEntry = {
  id: string;
  rank: number;
  name: string;
  aiScore: number;
  reviewerScore: number;
  finalScore: number;
  participantId: string;
  isCurrentUser?: boolean;
  feedback?: Feedback;
};

const Leaderboard = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("all");
  const [openFeedback, setOpenFeedback] = useState<Feedback | null>(null);
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [challengeData, setChallengeData] = useState<{
    challengeName: string,
    participants: LeaderboardEntry[]
  }>({
    challengeName: "",
    participants: []
  });
  
  // Fetch challenge and submissions data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      
      try {
        // Fetch challenge details
        const { data: challengeData, error: challengeError } = await supabase
          .from("challenges")
          .select("title")
          .eq("id", id)
          .single();
          
        if (challengeError) throw challengeError;
        if (!challengeData) throw new Error("Challenge not found");
        
        // Fetch submissions with scores for this challenge
        const { data: submissionsData, error: submissionsError } = await supabase
          .from("submissions")
          .select(`
            id, 
            name, 
            ai_score, 
            reviewer_score, 
            final_score, 
            status,
            created_at,
            participant_id,
            participants(user_id)
          `)
          .eq("challenge_id", id)
          .order("final_score", { ascending: false, nullsLast: true })
          .order("created_at", { ascending: true });
          
        if (submissionsError) throw submissionsError;
        
        // Format the data for the leaderboard
        const leaderboardEntries: LeaderboardEntry[] = submissionsData
          .filter(submission => submission.status === "evaluated" || submission.status === "submitted")
          .map((submission, index) => {
            // Determine if this submission belongs to the current user
            const isCurrentUser = user && submission.participants?.user_id === user.id;
            
            return {
              id: submission.id,
              rank: index + 1,
              name: submission.name,
              aiScore: submission.ai_score || 0,
              reviewerScore: submission.reviewer_score || 0,
              finalScore: submission.final_score || 0,
              participantId: submission.participant_id,
              isCurrentUser,
              // We'll fetch feedback separately when needed
            };
          });
          
        setChallengeData({
          challengeName: challengeData.title,
          participants: leaderboardEntries
        });
        
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load leaderboard data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id, user]);
  
  // Open feedback dialog
  const handleOpenFeedback = async (submissionId: string) => {
    try {
      // Fetch feedback data from Supabase
      const { data: feedbackData, error: feedbackError } = await supabase
        .from("feedback")
        .select("*")
        .eq("submission_id", submissionId)
        .maybeSingle();
      
      if (feedbackError) throw feedbackError;
      
      if (feedbackData) {
        // Format feedback data for the dialog
        const aiScoreData = feedbackData.ai_feedback || {};
        const reviewerScoreData = feedbackData.reviewer_feedback || {};
        
        const feedback: Feedback = {
          aiScore: {
            featureCompleteness: aiScoreData.featureCompleteness || 0,
            problemAlignment: aiScoreData.problemAlignment || 0,
            technicalClarity: aiScoreData.technicalClarity || 0,
            innovation: aiScoreData.innovation || 0,
            total: aiScoreData.total || 0,
            comments: aiScoreData.comments || ""
          },
          humanScore: {
            uxDesign: reviewerScoreData.uxDesign || 0,
            demoQuality: reviewerScoreData.demoQuality || 0,
            technicalSoundness: reviewerScoreData.technicalSoundness || 0,
            practicalValue: reviewerScoreData.practicalValue || 0,
            total: reviewerScoreData.total || 0,
            comments: reviewerScoreData.comments || ""
          },
          finalScore: (aiScoreData.total || 0) + (reviewerScoreData.total || 0)
        };
        
        setOpenFeedback(feedback);
        setSelectedParticipantId(submissionId);
      } else {
        // If no feedback found, show a message
        toast({
          title: "No feedback available",
          description: "This submission has not been evaluated yet.",
        });
        setOpenFeedback(null);
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
      toast({
        title: "Error",
        description: "Failed to load feedback data.",
        variant: "destructive",
      });
    }
  };
  
  // Check if user can download certificate
  const canDownloadCertificate = (participantId: string) => {
    if (!user) return false;
    
    // In a real app, this would check if the participant is the current user
    const submission = challengeData.participants.find(p => p.participantId === participantId);
    return submission?.isCurrentUser === true && submission.finalScore >= 70; // Example threshold
  };
  
  // If no challenge data found or still loading, show appropriate message
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Loading leaderboard...</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // If challenge not found
  if (!challengeData.challengeName) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Challenge leaderboard not found</h1>
            <Link to="/challenges" className="text-primary underline">Back to challenges</Link>
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
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              {id && (
                <Link to={`/challenges/${id}`} className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <ChevronLeft className="h-4 w-4" />
                    Back to challenge
                  </Button>
                </Link>
              )}
              <h1 className="text-3xl md:text-4xl font-bold">Leaderboard</h1>
              <p className="text-muted-foreground text-lg">
                {challengeData.challengeName}
              </p>
            </div>
          </div>
          
          <Card className="overflow-hidden mb-8">
            <div className="overflow-x-auto">
              {challengeData.participants.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Rank</th>
                      <th className="text-left py-3 px-4 font-medium">Participant</th>
                      <th className="text-center py-3 px-4 font-medium">
                        <div className="flex items-center justify-center gap-1">
                          <Code className="h-4 w-4" />
                          <span>AI Score</span>
                        </div>
                      </th>
                      <th className="text-center py-3 px-4 font-medium">
                        <div className="flex items-center justify-center gap-1">
                          <UserCheck className="h-4 w-4" />
                          <span>Reviewer Score</span>
                        </div>
                      </th>
                      <th className="text-center py-3 px-4 font-medium">Final Score</th>
                      <th className="text-right py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {challengeData.participants.map((entry) => (
                      <tr key={entry.rank} className={`border-t border-border hover:bg-muted/20 ${entry.isCurrentUser ? "bg-primary/5" : ""}`}>
                        <td className="py-3 px-4">
                          {entry.rank <= 3 ? (
                            <div className="flex items-center">
                              <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-2 ${
                                entry.rank === 1 ? "bg-yellow-500" : 
                                entry.rank === 2 ? "bg-gray-400" : "bg-amber-700"
                              } text-white`}>
                                <Medal className="h-3 w-3" />
                              </div>
                              {entry.rank}
                            </div>
                          ) : (
                            entry.rank
                          )}
                        </td>
                        <td className="py-3 px-4 font-medium">{entry.name}</td>
                        <td className="py-3 px-4 text-center">{entry.aiScore}/100</td>
                        <td className="py-3 px-4 text-center">{entry.reviewerScore}/100</td>
                        <td className="py-3 px-4 text-center font-semibold">{entry.finalScore}/100</td>
                        <td className="py-3 px-4 text-right flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="gap-1"
                            onClick={() => handleOpenFeedback(entry.id)}
                          >
                            View Report
                          </Button>
                          
                          {canDownloadCertificate(entry.participantId) && (
                            <Button size="sm" variant="ghost" className="gap-1">
                              <Download className="h-4 w-4" />
                              <span className="hidden sm:inline">Certificate</span>
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No submissions yet for this challenge.
                </div>
              )}
            </div>
          </Card>
          
          <div className="max-w-2xl mx-auto bg-muted/30 rounded-lg p-6 mt-12">
            <h2 className="text-xl font-semibold mb-2">How Scoring Works</h2>
            <p className="text-muted-foreground mb-4">
              Projects are evaluated using a combination of AI-powered assessment and human expert review.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">AI Scoring (50%)</h3>
                <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                  <li>Feature Completeness</li>
                  <li>Problem Alignment</li>
                  <li>Technical Clarity</li>
                  <li>Innovation</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Human Review (50%)</h3>
                <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                  <li>UX/UI Design</li>
                  <li>Demo Quality</li>
                  <li>Technical Soundness</li>
                  <li>Practical Value</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Dialog open={!!openFeedback} onOpenChange={() => setOpenFeedback(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detailed Score Report</DialogTitle>
            <DialogDescription>
              Review of your submission for {challengeData.challengeName}
            </DialogDescription>
          </DialogHeader>
          
          {openFeedback && (
            <div className="space-y-6 py-4">
              <Tabs defaultValue="ai" className="w-full">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="ai" className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    AI Review ({openFeedback.aiScore.total}/100)
                  </TabsTrigger>
                  <TabsTrigger value="human" className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    Human Review ({openFeedback.humanScore.total}/100)
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="ai" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/30 p-3 rounded-md">
                        <div className="text-sm font-medium">Feature Completeness</div>
                        <div className="flex items-center justify-between">
                          <div className="text-xl font-bold">{openFeedback.aiScore.featureCompleteness}/25</div>
                        </div>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-md">
                        <div className="text-sm font-medium">Problem Alignment</div>
                        <div className="flex items-center justify-between">
                          <div className="text-xl font-bold">{openFeedback.aiScore.problemAlignment}/25</div>
                        </div>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-md">
                        <div className="text-sm font-medium">Technical Clarity</div>
                        <div className="flex items-center justify-between">
                          <div className="text-xl font-bold">{openFeedback.aiScore.technicalClarity}/25</div>
                        </div>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-md">
                        <div className="text-sm font-medium">Innovation</div>
                        <div className="flex items-center justify-between">
                          <div className="text-xl font-bold">{openFeedback.aiScore.innovation}/25</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/20 p-4 rounded-md">
                      <h3 className="font-medium mb-2">AI Comments</h3>
                      <p className="text-sm whitespace-pre-line">{openFeedback.aiScore.comments || "No comments provided."}</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="human" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/30 p-3 rounded-md">
                        <div className="text-sm font-medium">UX/UI Design</div>
                        <div className="flex items-center justify-between">
                          <div className="text-xl font-bold">{openFeedback.humanScore.uxDesign}/25</div>
                        </div>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-md">
                        <div className="text-sm font-medium">Demo Quality</div>
                        <div className="flex items-center justify-between">
                          <div className="text-xl font-bold">{openFeedback.humanScore.demoQuality}/25</div>
                        </div>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-md">
                        <div className="text-sm font-medium">Technical Soundness</div>
                        <div className="flex items-center justify-between">
                          <div className="text-xl font-bold">{openFeedback.humanScore.technicalSoundness}/25</div>
                        </div>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-md">
                        <div className="text-sm font-medium">Practical Value</div>
                        <div className="flex items-center justify-between">
                          <div className="text-xl font-bold">{openFeedback.humanScore.practicalValue}/25</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/20 p-4 rounded-md">
                      <h3 className="font-medium mb-2">Reviewer Comments</h3>
                      <p className="text-sm whitespace-pre-line">{openFeedback.humanScore.comments || "No comments provided."}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Final Score</h3>
                <div className="bg-muted/30 p-4 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="text-lg">Overall Score</div>
                    <div className="text-2xl font-bold">{openFeedback.finalScore}/100</div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Combined score from AI evaluation (50%) and human review (50%)
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Leaderboard;
