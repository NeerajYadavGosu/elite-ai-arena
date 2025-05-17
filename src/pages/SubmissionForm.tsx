
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Github } from "lucide-react";

// Define the form schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  githubUrl: z.string().url({
    message: "Please enter a valid GitHub repository URL.",
  }),
  loomUrl: z.string().url({
    message: "Please enter a valid Loom video URL.",
  }),
  demoUrl: z.string().url({
    message: "Please enter a valid demo URL.",
  }),
  description: z.string().optional(),
});

const SubmissionForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, signInWithGitHub } = useAuth();
  
  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      githubUrl: "",
      loomUrl: "",
      demoUrl: "",
      description: "",
    },
  });
  
  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to submit a solution.",
        variant: "destructive",
      });
    }
  }, [isAuthenticated]);
  
  // Form submission handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to submit a solution.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      setIsSubmitting(false);
      
      toast({
        title: "Submission Successful",
        description: "Your solution has been submitted successfully. Good luck!",
      });
      
      // Redirect to leaderboard
      navigate(`/leaderboard/${id}`);
    }, 1500);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <Link to={`/challenges/${id}`} className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <Button variant="ghost" size="sm" className="gap-1">
              ← Back to challenge
            </Button>
          </Link>
          
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Submit Your Solution</h1>
            
            {!isAuthenticated ? (
              <div className="bg-muted/30 p-8 rounded-lg text-center">
                <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
                <p className="mb-6 text-muted-foreground">
                  You need to sign in with GitHub to submit your solution.
                </p>
                <Button onClick={signInWithGitHub} className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  Sign in with GitHub
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your project name" {...field} />
                          </FormControl>
                          <FormDescription>
                            Give your submission a clear, descriptive name.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="githubUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GitHub Repository URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://github.com/username/repo" {...field} />
                          </FormControl>
                          <FormDescription>
                            Link to your GitHub repository containing your solution code.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="loomUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loom Video URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://www.loom.com/share/..." {...field} />
                          </FormControl>
                          <FormDescription>
                            Record a short demo of your solution explaining how it works.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="demoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Live Demo URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://your-demo-site.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            Link to a working demo of your solution.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Briefly describe your solution and highlight key features..." 
                              className="min-h-32"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Provide additional context about your submission.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end pt-4">
                      <Button type="submit" className="gradient-bg" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Solution"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SubmissionForm;
