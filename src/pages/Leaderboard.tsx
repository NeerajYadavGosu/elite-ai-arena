
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
    finalScore: number
  }>
}> = {
  "1": {
    challengeName: "AI-powered code review assistant",
    participants: [
      { rank: 1, name: "Arjun", aiScore: 96, reviewerScore: 92, finalScore: 94 },
      { rank: 2, name: "Maria", aiScore: 92, reviewerScore: 89, finalScore: 90.5 },
      { rank: 3, name: "Tanya", aiScore: 88, reviewerScore: 92, finalScore: 90 },
      { rank: 4, name: "Ahmed", aiScore: 90, reviewerScore: 86, finalScore: 88 },
      { rank: 5, name: "Sofia", aiScore: 86, reviewerScore: 89, finalScore: 87.5 },
      { rank: 6, name: "Chen", aiScore: 84, reviewerScore: 85, finalScore: 84.5 },
      { rank: 7, name: "Diego", aiScore: 82, reviewerScore: 86, finalScore: 84 },
      { rank: 8, name: "Priya", aiScore: 80, reviewerScore: 87, finalScore: 83.5 },
      { rank: 9, name: "Mikhail", aiScore: 78, reviewerScore: 84, finalScore: 81 },
      { rank: 10, name: "Aisha", aiScore: 75, reviewerScore: 82, finalScore: 78.5 },
    ]
  },
  "2": {
    challengeName: "Next-gen image generation API",
    participants: [
      { rank: 1, name: "Sarah", aiScore: 98, reviewerScore: 94, finalScore: 96 },
      { rank: 2, name: "Jamal", aiScore: 94, reviewerScore: 92, finalScore: 93 },
      { rank: 3, name: "Akira", aiScore: 92, reviewerScore: 90, finalScore: 91 },
      { rank: 4, name: "Elena", aiScore: 88, reviewerScore: 92, finalScore: 90 },
      { rank: 5, name: "Marcus", aiScore: 86, reviewerScore: 88, finalScore: 87 },
      { rank: 6, name: "Leila", aiScore: 84, reviewerScore: 87, finalScore: 85.5 },
      { rank: 7, name: "Noah", aiScore: 82, reviewerScore: 84, finalScore: 83 },
      { rank: 8, name: "Fatima", aiScore: 80, reviewerScore: 84, finalScore: 82 },
      { rank: 9, name: "Carlos", aiScore: 78, reviewerScore: 82, finalScore: 80 },
      { rank: 10, name: "Min", aiScore: 76, reviewerScore: 80, finalScore: 78 },
    ]
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
                        <Button size="sm" variant="ghost" className="gap-1">
                          <Download className="h-4 w-4" />
                          <span className="hidden sm:inline">Certificate</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
