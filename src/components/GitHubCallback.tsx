
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const GitHubCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      try {
        console.log("Processing GitHub callback");
        
        // Get URL parameters - check both hash and search params
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        
        // Check for error in URL
        const urlError = queryParams.get('error') || hashParams.get('error');
        if (urlError) {
          console.error("Error found in URL:", urlError);
          const errorDescription = queryParams.get('error_description') || hashParams.get('error_description');
          throw new Error(`${urlError}: ${errorDescription || 'Unknown error'}`);
        }

        // Exchange the code for a session
        console.log("Getting Supabase session");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Supabase session error:", error);
          throw error;
        }
        
        if (!data.session) {
          console.log("No session found, trying to exchange auth code...");
          
          // Get code from URL
          const code = queryParams.get('code');
          if (!code) {
            throw new Error("No authentication code found in URL");
          }
          
          // Try to exchange the code
          console.log("Exchanging auth code for session");
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            console.error("Code exchange error:", exchangeError);
            throw exchangeError;
          }
          
          // Get the session again
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError || !sessionData.session) {
            console.error("Failed to get session after code exchange:", sessionError);
            throw sessionError || new Error("No session available after code exchange");
          }
          
          console.log("Successfully authenticated after code exchange");
        }
        
        console.log("Authentication successful, redirecting...");
        const redirectPath = localStorage.getItem('authRedirect') || '/';
        localStorage.removeItem('authRedirect');
        
        toast({
          title: "Signed in successfully",
          description: "Welcome back!",
        });
        
        setProcessing(false);
        navigate(redirectPath);
      } catch (error) {
        console.error('Authentication error:', error);
        setError('Failed to authenticate with GitHub. Please try again.');
        toast({
          title: "Authentication Failed",
          description: "Could not authenticate with GitHub. Please try again.",
          variant: "destructive",
        });
        setProcessing(false);
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
            <div className="mb-4 relative flex items-center justify-center">
              <div className="h-16 w-16 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            </div>
            <h1 className="text-2xl font-bold mb-4">Authenticating...</h1>
            <p className="text-muted-foreground">Please wait while we complete the authentication process.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubCallback;
