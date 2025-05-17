
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Medal, ChevronLeft } from "lucide-react";

// Mock data for challenge-specific leaderboards
const mockChallengeLeaderboards: Record<string, {
  challengeName: string,
  participants: Array<{
    rank: number, 
    name: string, 
    aiScore: number, 
    reviewerScore: number, 
    finalScore: number,
    isCurrentUser?: boolean
  }>
}> = {
  "1": {
    challengeName: "AI-powered code review assistant",
    participants: []
  },
  "2": {
    challengeName: "Next-gen image generation API",
    participants: []
  }
};

const Leaderboard = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("all");

  // Get challenge data based on ID, or default to first challenge if no ID
  const challengeData = id ? mockChallengeLeaderboards[id] : mockChallengeLeaderboards["1"];
  
  // If no challenge data found, show "not found" message
  if (!challengeData) {
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
                      <th className="text-center py-3 px-4 font-medium">AI Score</th>
                      <th className="text-center py-3 px-4 font-medium">Reviewer Score</th>
                      <th className="text-center py-3 px-4 font-medium">Final Score</th>
                      <th className="text-right py-3 px-4 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {challengeData.participants.map((entry) => (
                      <tr key={entry.rank} className="border-t border-border hover:bg-muted/20">
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
                        <td className="py-3 px-4 text-right">
                          {entry.isCurrentUser && (
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
      
      <Footer />
    </div>
  );
};

export default Leaderboard;
