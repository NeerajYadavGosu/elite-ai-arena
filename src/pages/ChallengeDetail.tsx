
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Challenge } from "@/components/ChallengeCard";
import { CalendarIcon, Trophy, Users, Clock } from "lucide-react";

// Mock data for challenge details
const mockChallenges: Record<string, Challenge & { 
  fullDescription: string; 
  requirements: string[];
  prizes: { rank: string; reward: string }[];
  participants: number;
}> = {
  "1": {
    id: "1",
    title: "Build an AI-powered code review assistant",
    description: "Create a tool that uses LLMs to provide automated code reviews with actionable suggestions for improvement.",
    fullDescription: "In this challenge, you'll create a sophisticated tool that leverages the power of large language models to provide automated code reviews. Your solution should analyze code repositories, identify potential bugs, suggest optimizations, and provide actionable feedback that helps developers improve their code quality. The tool should be able to understand multiple programming languages and frameworks, adapt to different coding styles and standards, and provide context-aware suggestions that genuinely help developers write better code.",
    requirements: [
      "Must use LLMs for code analysis",
      "Support at least 3 programming languages",
      "Include a user-friendly interface",
      "Integrate with GitHub via API",
      "Provide actionable suggestions with explanations"
    ],
    sponsor: "Meta",
    sponsorLogo: "https://skillicons.dev/icons?i=react",
    deadline: "May 30, 2025",
    prizes: [
      { rank: "1st Place", reward: "$5,000 + Meta Interview" },
      { rank: "2nd Place", reward: "$2,500 + Meta Swag" },
      { rank: "3rd Place", reward: "$1,000" }
    ],
    participants: 87
  },
  "2": {
    id: "2",
    title: "Develop a next-gen image generation API",
    description: "Design and implement an API that generates realistic images based on text descriptions with enhanced control.",
    fullDescription: "This challenge asks you to push the boundaries of image generation technology. You'll develop an API that converts text descriptions into highly realistic and customizable images. Your solution should provide fine-grained control over the generation process, allowing users to specify style, composition, lighting, and other artistic elements. The API should be highly efficient, produce consistent results, and allow for creative applications beyond simple text-to-image conversion.",
    requirements: [
      "Create a RESTful API for image generation",
      "Support detailed text prompts with style controls",
      "Generate high-quality images (min 1024x1024)",
      "Include documentation and example usage",
      "Implement rate limiting and user authentication"
    ],
    sponsor: "Google",
    sponsorLogo: "https://skillicons.dev/icons?i=gcp",
    deadline: "June 15, 2025",
    prizes: [
      { rank: "1st Place", reward: "$7,500 + Google Cloud Credits" },
      { rank: "2nd Place", reward: "$3,000 + Google Home Devices" },
      { rank: "3rd Place", reward: "$1,500" }
    ],
    participants: 125
  },
  // Add more challenge details as needed
};

const ChallengeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const challenge = id ? mockChallenges[id] : null;

  if (!challenge) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Challenge not found</h1>
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
          <Link to="/challenges" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <Button variant="ghost" size="sm" className="gap-1">
              ← Back to challenges
            </Button>
          </Link>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Sponsored by {challenge.sponsor}</span>
                </div>
                <h1 className="text-3xl font-bold">{challenge.title}</h1>
                <p className="text-lg text-muted-foreground">{challenge.description}</p>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Challenge Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{challenge.fullDescription}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    {challenge.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Prizes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {challenge.prizes.map((prize, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full gradient-bg flex items-center justify-center text-white">
                          <Trophy className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{prize.rank}</h4>
                          <p className="text-muted-foreground">{prize.reward}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Challenge Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Deadline</p>
                      <p className="text-sm text-muted-foreground">{challenge.deadline}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Participants</p>
                      <p className="text-sm text-muted-foreground">{challenge.participants} registered</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Time Remaining</p>
                      <p className="text-sm text-muted-foreground">Calculated based on deadline</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center pt-2">
                  <Button asChild className="gradient-bg w-full">
                    <Link to={`/submit/${challenge.id}`}>Submit My Solution</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Judging Criteria</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center justify-between">
                      <span>Innovation</span>
                      <span className="font-semibold">25%</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Technical Implementation</span>
                      <span className="font-semibold">30%</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>User Experience</span>
                      <span className="font-semibold">20%</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Practicality & Impact</span>
                      <span className="font-semibold">25%</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ChallengeDetail;
