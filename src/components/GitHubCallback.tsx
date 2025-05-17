
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
        // Get URL parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        
        // Check for error in URL
        const urlError = queryParams.get('error') || hashParams.get('error');
        if (urlError) {
          console.error("Error found in URL:", urlError);
          const errorDescription = queryParams.get('error_description') || hashParams.get('error_description');
          throw new Error(`${urlError}: ${errorDescription || 'Unknown error'}`);
        }

        // Supabase handles OAuth exchanging the code for a token
        // We just need to check if we have a session after we're redirected
        console.log("Getting Supabase session");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Supabase session error:", error);
          throw error;
        }
        
        console.log("Session data:", data.session ? "Session exists" : "No session found");
        if (data.session) {
          // Ensure the user profile exists in our profiles table
          const user = data.session.user;
          console.log("User authenticated:", user.email);
          
          // Check if profile exists
          console.log("Checking if profile exists for user:", user.id);
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
            
          if (profileError) {
            console.error('Error checking profile:', profileError);
          }
          
          console.log("Profile data:", profileData ? "Profile exists" : "No profile found");
          // If profile doesn't exist, create it
          if (!profileData) {
            console.log("Creating new profile for user:", user.id);
            console.log("User metadata:", user.user_metadata);
            
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
            } else {
              console.log("Profile created successfully");
            }
          }
          
          // Get redirect path and navigate back
          const redirectPath = localStorage.getItem('authRedirect') || '/';
          localStorage.removeItem('authRedirect');
          
          console.log("Redirecting to:", redirectPath);
          toast({
            title: "Signed in successfully",
            description: `Welcome${user.user_metadata.name ? ', ' + user.user_metadata.name : ''}!`,
          });
          
          // Set processing to false before navigating
          setProcessing(false);
          navigate(redirectPath);
        } else {
          console.error("No session available after authentication");
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
