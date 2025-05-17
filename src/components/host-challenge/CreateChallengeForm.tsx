
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trophy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CreateChallengeForm = () => {
  const [requirements, setRequirements] = useState(["", "", ""]);
  
  const handleAddRequirement = () => {
    setRequirements([...requirements, ""]);
  };
  
  const handleRequirementChange = (index: number, value: string) => {
    const updatedRequirements = [...requirements];
    updatedRequirements[index] = value;
    setRequirements(updatedRequirements);
  };
  
  const handlePublish = () => {
    // This is just a placeholder for the actual implementation
    toast({
      title: "Challenge Published",
      description: "Your challenge has been successfully published.",
    });
  };

  return (
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
            {requirements.map((req, index) => (
              <Textarea 
                key={index}
                value={req}
                onChange={(e) => handleRequirementChange(index, e.target.value)}
                placeholder={`Requirement ${index + 1}`} 
                className="resize-none" 
              />
            ))}
            <Button variant="outline" onClick={handleAddRequirement} className="mt-2">+ Add Requirement</Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <Label>Prizes</Label>
          <div className="space-y-4">
            <PrizeInput place="1st Place" bgClass="gradient-bg" />
            <PrizeInput place="2nd Place" bgClass="bg-gray-400" />
            <PrizeInput place="3rd Place" bgClass="bg-amber-700" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Save Draft</Button>
        <Button className="gradient-bg" onClick={handlePublish}>Publish Challenge</Button>
      </CardFooter>
    </Card>
  );
};

interface PrizeInputProps {
  place: string;
  bgClass: string;
}

const PrizeInput = ({ place, bgClass }: PrizeInputProps) => (
  <div className="flex items-center gap-4">
    <div className={`h-10 w-10 rounded-full ${bgClass} flex items-center justify-center text-white`}>
      <Trophy className="h-5 w-5" />
    </div>
    <div className="flex-1 grid grid-cols-2 gap-2">
      <Input placeholder={place} defaultValue={place} />
      <Input placeholder="Prize description" />
    </div>
  </div>
);

export default CreateChallengeForm;
