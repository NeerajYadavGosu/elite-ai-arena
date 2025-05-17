
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleOAuthCallback } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const GitHubCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      // Get the auth code from URL
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (!code) {
        setError('No authorization code provided');
        toast({
          title: "Authentication Error",
          description: "No authorization code provided",
          variant: "destructive",
        });
        return;
      }

      try {
        // Exchange the code for user data
        const userData = await handleOAuthCallback(code);
        
        // Store the user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Get redirect path and navigate back
        const redirectPath = localStorage.getItem('authRedirect') || '/';
        localStorage.removeItem('authRedirect');
        
        toast({
          title: "Signed in successfully",
          description: `Welcome, ${userData.name || userData.username}!`,
        });
        
        navigate(redirectPath);
      } catch (error) {
        console.error('Authentication error:', error);
        setError('Failed to authenticate with GitHub');
        toast({
          title: "Authentication Failed",
          description: "Could not authenticate with GitHub. Please try again.",
          variant: "destructive",
        });
      }
    };

    processCallback();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        {error ? (
          <div>
            <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
            <p className="text-muted-foreground">{error}</p>
            <button 
              onClick={() => navigate('/')} 
              className="mt-4 underline text-primary"
            >
              Return to home
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-4">Authenticating...</h1>
            <p className="text-muted-foreground">Please wait while we complete the authentication process.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubCallback;
