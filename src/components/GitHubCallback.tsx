
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const GitHubCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Supabase handles OAuth exchanging the code for a token
        // We just need to check if we have a session after we're redirected
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data.session) {
          // Get redirect path and navigate back
          const redirectPath = localStorage.getItem('authRedirect') || '/';
          localStorage.removeItem('authRedirect');
          
          toast({
            title: "Signed in successfully",
            description: `Welcome${data.session.user.user_metadata.name ? ', ' + data.session.user.user_metadata.name : ''}!`,
          });
          
          navigate(redirectPath);
        } else {
          throw new Error("No session available after authentication");
        }
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
