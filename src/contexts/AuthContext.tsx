
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

// Define user type
type UserData = {
  id: string;
  name: string;
  email: string | null;
  avatarUrl: string;
  username: string;
};

type AuthContextType = {
  user: UserData | null;
  session: Session | null;
  loading: boolean;
  signInWithGitHub: () => void;
  signOut: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Set up auth state listener and check for existing session
  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Get the user profile data
          const userData: UserData = {
            id: currentSession.user.id,
            name: currentSession.user.user_metadata.full_name || currentSession.user.user_metadata.name || '',
            email: currentSession.user.email,
            avatarUrl: currentSession.user.user_metadata.avatar_url || '',
            username: currentSession.user.user_metadata.user_name || currentSession.user.user_metadata.preferred_username || '',
          };
          setUser(userData);
        } else {
          setUser(null);
        }

        setLoading(false);
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        
        if (data.session?.user) {
          // Get the user profile data
          const userData: UserData = {
            id: data.session.user.id,
            name: data.session.user.user_metadata.full_name || data.session.user.user_metadata.name || '',
            email: data.session.user.email,
            avatarUrl: data.session.user.user_metadata.avatar_url || '',
            username: data.session.user.user_metadata.user_name || data.session.user.user_metadata.preferred_username || '',
          };
          setUser(userData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error checking auth session:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGitHub = async () => {
    // GitHub OAuth parameters
    try {
      const redirectUrl = `${window.location.origin}/github-callback`;
      
      // Save the current URL to redirect back after login
      localStorage.setItem('authRedirect', window.location.pathname);
      
      // Redirect to GitHub OAuth
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: redirectUrl
        }
      });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('GitHub sign-in error:', error);
      toast({
        title: "Authentication Error",
        description: "Failed to sign in with GitHub. Please try again.",
        variant: "destructive",
      });
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      
      toast({
        title: "Signed out successfully",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error signing out",
        description: "There was an problem signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session,
        loading, 
        signInWithGitHub, 
        signOut, 
        isAuthenticated: !!session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Export a function to handle OAuth callback
export const handleOAuthCallback = async (code: string) => {
  try {
    // In the actual implementation, we just return the code
    // since Supabase handles the exchange internally
    return code;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};
