
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChallengeCard, { Challenge } from "@/components/ChallengeCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for challenges
const mockChallenges: Challenge[] = [
  {
    id: "1",
    title: "Build an AI-powered code review assistant",
    description: "Create a tool that uses LLMs to provide automated code reviews with actionable suggestions for improvement.",
    sponsor: "Meta",
    sponsorLogo: "https://skillicons.dev/icons?i=react",
    deadline: "May 30, 2025"
  },
  {
    id: "2",
    title: "Develop a next-gen image generation API",
    description: "Design and implement an API that generates realistic images based on text descriptions with enhanced control.",
    sponsor: "Google",
    sponsorLogo: "https://skillicons.dev/icons?i=gcp",
    deadline: "June 15, 2025"
  },
  {
    id: "3",
    title: "Create an AI video editor with voice commands",
    description: "Build a web application that allows users to edit videos using natural language voice commands.",
    sponsor: "Adobe",
    sponsorLogo: "https://skillicons.dev/icons?i=ps",
    deadline: "June 5, 2025"
  },
  {
    id: "4",
    title: "Design a real-time language translator for AR glasses",
    description: "Create a prototype for a system that can translate multiple languages in real-time for augmented reality devices.",
    sponsor: "Apple",
    sponsorLogo: "https://skillicons.dev/icons?i=swift",
    deadline: "July 1, 2025"
  },
  {
    id: "5",
    title: "Build a machine learning model for climate prediction",
    description: "Develop an ML model that can predict climate patterns and provide actionable insights for environmental planning.",
    sponsor: "Nvidia",
    sponsorLogo: "https://skillicons.dev/icons?i=tensorflow",
    deadline: "June 20, 2025"
  },
  {
    id: "6",
    title: "Create an AI assistant for software development",
    description: "Build an AI tool that helps developers write better code faster with context-aware suggestions.",
    sponsor: "Microsoft",
    sponsorLogo: "https://skillicons.dev/icons?i=azure",
    deadline: "June 10, 2025"
  }
];

const Challenges = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterByCompany, setFilterByCompany] = useState("all");
  
  const filteredChallenges = mockChallenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCompany = filterByCompany === "all" || challenge.sponsor === filterByCompany;
    
    return matchesSearch && matchesCompany;
  });

  const companies = ["all", ...Array.from(new Set(mockChallenges.map(c => c.sponsor)))];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl md:text-4xl font-bold">Challenges</h1>
            <p className="text-muted-foreground text-lg">
              Discover exciting hackathon challenges from top tech companies.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mt-8 mb-6">
            <Input
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Select
              value={filterByCompany}
              onValueChange={setFilterByCompany}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company === "all" ? "All Companies" : company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {filteredChallenges.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredChallenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No challenges found matching your search.
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Challenges;
