
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
        // Supabase handles OAuth exchanging the code for a token
        // We just need to check if we have a session after we're redirected
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data.session) {
          // Ensure the user profile exists in our profiles table
          const user = data.session.user;
          
          // Check if profile exists
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
            
          if (profileError) {
            console.error('Error checking profile:', profileError);
          }
          
          // If profile doesn't exist, create it
          if (!profileData) {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                username: user.user_metadata.user_name || user.user_metadata.preferred_username || null,
                avatar_url: user.user_metadata.avatar_url,
                email: user.email
              });
              
            if (insertError) {
              console.error('Error creating profile:', insertError);
            }
          }
          
          // Get redirect path and navigate back
          const redirectPath = localStorage.getItem('authRedirect') || '/';
          localStorage.removeItem('authRedirect');
          
          toast({
            title: "Signed in successfully",
            description: `Welcome${user.user_metadata.name ? ', ' + user.user_metadata.name : ''}!`,
          });
          
          // Set processing to false before navigating
          setProcessing(false);
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
