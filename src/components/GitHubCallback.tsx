
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const GitHubCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Get the authorization code from the URL
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const returnedState = urlParams.get("state");
      const storedState = localStorage.getItem("oauth_state");
      
      // Remove the state from localStorage as it's no longer needed
      localStorage.removeItem("oauth_state");
      
      if (!code) {
        setError("No authorization code received from GitHub");
        return;
      }
      
      if (returnedState !== storedState) {
        setError("Invalid state parameter. Possible CSRF attack");
        return;
      }
      
      try {
        // In a real app, you would exchange the code for an access token through your backend
        // For demo purposes, we'll simulate a successful authentication
        
        // Simulated user data - in a real app this would come from GitHub's API
        const mockUser = {
          id: "12345",
          login: "github_user",
          avatar_url: "https://avatars.githubusercontent.com/u/12345",
        };
        
        // Store user data in localStorage
        localStorage.setItem("githubUser", JSON.stringify(mockUser));
        localStorage.setItem("githubToken", "mock_token");
        
        toast({
          title: "Authentication successful",
          description: "You have successfully signed in with GitHub."
        });
        
        // Redirect back to the home page or previous page
        navigate("/");
      } catch (err) {
        console.error("Authentication failed:", err);
        setError("Failed to authenticate with GitHub");
      }
    };
    
    handleOAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="max-w-md w-full p-6 bg-destructive/10 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-destructive">Authentication Error</h2>
          <p className="mb-4">{error}</p>
          <button 
            className="text-primary hover:underline"
            onClick={() => navigate("/")}
          >
            Return to home page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-lg">Authenticating with GitHub...</p>
    </div>
  );
};

export default GitHubCallback;
