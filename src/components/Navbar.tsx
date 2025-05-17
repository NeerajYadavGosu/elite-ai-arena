
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Github } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AuthUser {
  id: string;
  login: string;
  avatar_url: string;
}

const Navbar = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user is already authenticated on component mount
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("githubUser");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          localStorage.removeItem("githubUser");
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const handleGitHubLogin = async () => {
    // This is a simplified OAuth flow for demo purposes
    // In a real app, you would use a proper OAuth server
    
    // Generate a random state for CSRF protection
    const state = Math.random().toString(36).substring(2);
    localStorage.setItem("oauth_state", state);
    
    const clientId = "YOUR_GITHUB_CLIENT_ID"; // Replace with your GitHub OAuth App client ID
    const redirectUri = encodeURIComponent(window.location.origin + "/github-callback");
    const scope = "read:user";
    
    // Redirect to GitHub for authorization
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
  };
  
  const handleLogout = () => {
    localStorage.removeItem("githubUser");
    localStorage.removeItem("githubToken");
    setUser(null);
    toast({
      title: "Logged out successfully",
      description: "You have been logged out from your GitHub account."
    });
  };

  return (
    <header className="w-full border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold gradient-text">Elite Builder AI</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {loading ? (
            <Button variant="outline" disabled>
              Loading...
            </Button>
          ) : user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img 
                  src={user.avatar_url} 
                  alt={user.login} 
                  className="h-8 w-8 rounded-full" 
                />
                <span className="hidden md:inline">{user.login}</span>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Sign out
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={handleGitHubLogin}>
              <Github className="mr-2 h-4 w-4" />
              Sign in with GitHub
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
