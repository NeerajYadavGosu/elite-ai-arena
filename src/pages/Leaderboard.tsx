
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Medal } from "lucide-react";

// Mock data for leaderboard
const mockLeaderboardData = [
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
];

const challengeTabs = [
  { id: "all", name: "All Challenges" },
  { id: "ai-assistant", name: "AI Code Assistant" },
  { id: "image-gen", name: "Image Generation" },
];

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Leaderboard</h1>
          <p className="text-muted-foreground text-lg mb-8">
            See how participants rank based on AI and human reviewer scores.
          </p>
          
          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="mb-6">
              {challengeTabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {challengeTabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id}>
                <Card className="overflow-hidden">
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
                        {mockLeaderboardData.map((entry) => (
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
              </TabsContent>
            ))}
          </Tabs>
          
          <div className="max-w-2xl mx-auto bg-muted/30 rounded-lg p-6 mt-12">
            <h2 className="text-xl font-semibold mb-2">How Scoring Works</h2>
            <p className="text-muted-foreground mb-4">
              Projects are evaluated using a combination of AI-powered assessment and human expert review.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">AI Scoring (50%)</h3>
                <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                  <li>Code quality assessment</li>
                  <li>Implementation completeness</li>
                  <li>Performance benchmarking</li>
                  <li>Documentation quality</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Human Review (50%)</h3>
                <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                  <li>Innovation and creativity</li>
                  <li>User experience</li>
                  <li>Technical complexity</li>
                  <li>Business impact potential</li>
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
