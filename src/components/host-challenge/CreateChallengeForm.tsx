
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trophy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const CreateChallengeForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requirements, setRequirements] = useState(["", "", ""]);
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    fullDescription: "",
    sponsor: "",
    deadline: "",
  });
  const [prizes, setPrizes] = useState([
    { place: "1st Place", description: "" },
    { place: "2nd Place", description: "" },
    { place: "3rd Place", description: "" },
  ]);
  
  const handleAddRequirement = () => {
    setRequirements([...requirements, ""]);
  };
  
  const handleRequirementChange = (index: number, value: string) => {
    const updatedRequirements = [...requirements];
    updatedRequirements[index] = value;
    setRequirements(updatedRequirements);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };
  
  const handlePrizeChange = (index: number, field: 'place' | 'description', value: string) => {
    const updatedPrizes = [...prizes];
    updatedPrizes[index][field] = value;
    setPrizes(updatedPrizes);
  };
  
  const handlePublish = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to publish a challenge.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate required fields
    if (!formData.title || !formData.fullDescription || !formData.deadline) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // First, ensure the user is a host
      const { data: hostData, error: hostError } = await supabase
        .from('hosts')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      let hostId;
      
      if (hostError || !hostData) {
        // If not a host, insert into hosts table
        const { data: newHostData, error: newHostError } = await supabase
          .from('hosts')
          .insert({ user_id: user.id })
          .select('id')
          .single();
          
        if (newHostError) throw newHostError;
        hostId = newHostData.id;
      } else {
        hostId = hostData.id;
      }
      
      // Format deadline as ISO string
      const deadlineDate = new Date(formData.deadline);
      
      // Insert the challenge
      const { data, error } = await supabase
        .from('challenges')
        .insert({
          host_id: hostId,
          title: formData.title,
          description: formData.fullDescription,
          requirements: requirements.filter(req => req.trim() !== '').join('\n'),
          start_date: new Date().toISOString(),
          end_date: deadlineDate.toISOString(),
          prize_pool: JSON.stringify(prizes),
          status: 'published',
        })
        .select('id')
        .single();
        
      if (error) throw error;
      
      toast({
        title: "Challenge Published",
        description: "Your challenge has been successfully published.",
      });
      
      // Navigate to the challenge detail page
      navigate(`/challenges/${data.id}`);
      
    } catch (error) {
      console.error("Error publishing challenge:", error);
      toast({
        title: "Error",
        description: "Failed to publish challenge. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSaveDraft = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to save a draft.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // First, ensure the user is a host
      const { data: hostData, error: hostError } = await supabase
        .from('hosts')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      let hostId;
      
      if (hostError || !hostData) {
        // If not a host, insert into hosts table
        const { data: newHostData, error: newHostError } = await supabase
          .from('hosts')
          .insert({ user_id: user.id })
          .select('id')
          .single();
          
        if (newHostError) throw newHostError;
        hostId = newHostData.id;
      } else {
        hostId = hostData.id;
      }
      
      // Format deadline as ISO string if available
      const deadlineDate = formData.deadline ? new Date(formData.deadline) : new Date();
      
      // Insert the challenge as draft
      const { error } = await supabase
        .from('challenges')
        .insert({
          host_id: hostId,
          title: formData.title || "Draft Challenge",
          description: formData.fullDescription || "Draft description",
          requirements: requirements.filter(req => req.trim() !== '').join('\n'),
          start_date: new Date().toISOString(),
          end_date: deadlineDate.toISOString(),
          prize_pool: JSON.stringify(prizes),
          status: 'draft',
        });
        
      if (error) throw error;
      
      toast({
        title: "Draft Saved",
        description: "Your challenge draft has been saved.",
      });
      
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
          <Input 
            id="title" 
            placeholder="Enter a catchy title for your challenge" 
            value={formData.title}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="shortDescription">Short Description</Label>
          <Textarea 
            id="shortDescription" 
            placeholder="A brief description (150 chars max)" 
            className="resize-none"
            maxLength={150}
            value={formData.shortDescription}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fullDescription">Full Description</Label>
          <Textarea 
            id="fullDescription" 
            placeholder="Detailed explanation of the challenge" 
            className="min-h-[200px] resize-none"
            value={formData.fullDescription}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="sponsor">Sponsor Name</Label>
            <Input 
              id="sponsor" 
              placeholder="Your company name" 
              value={formData.sponsor}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deadline">Submission Deadline</Label>
            <Input 
              id="deadline" 
              type="date" 
              value={formData.deadline}
              onChange={handleInputChange}
            />
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
            {prizes.map((prize, index) => (
              <PrizeInput 
                key={index}
                place={prize.place} 
                description={prize.description}
                onPlaceChange={(value) => handlePrizeChange(index, 'place', value)}
                onDescriptionChange={(value) => handlePrizeChange(index, 'description', value)}
                bgClass={index === 0 ? "gradient-bg" : index === 1 ? "bg-gray-400" : "bg-amber-700"} 
              />
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          onClick={handleSaveDraft}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Draft"}
        </Button>
        <Button 
          className="gradient-bg" 
          onClick={handlePublish}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Publishing..." : "Publish Challenge"}
        </Button>
      </CardFooter>
    </Card>
  );
};

interface PrizeInputProps {
  place: string;
  description: string;
  bgClass: string;
  onPlaceChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

const PrizeInput = ({ place, description, bgClass, onPlaceChange, onDescriptionChange }: PrizeInputProps) => (
  <div className="flex items-center gap-4">
    <div className={`h-10 w-10 rounded-full ${bgClass} flex items-center justify-center text-white`}>
      <Trophy className="h-5 w-5" />
    </div>
    <div className="flex-1 grid grid-cols-2 gap-2">
      <Input 
        placeholder="Place" 
        value={place}
        onChange={(e) => onPlaceChange(e.target.value)} 
      />
      <Input 
        placeholder="Prize description" 
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)} 
      />
    </div>
  </div>
);

export default CreateChallengeForm;
