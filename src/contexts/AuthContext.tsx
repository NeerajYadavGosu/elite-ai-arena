
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
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
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
        console.log("Auth state changed:", event);
        setSession(currentSession);
        
        if (currentSession?.user) {
          console.log("User authenticated in onAuthStateChange:", currentSession.user.email);
          // Get the user profile data
          const userData: UserData = {
            id: currentSession.user.id,
            name: currentSession.user.user_metadata.full_name || currentSession.user.user_metadata.name || '',
            email: currentSession.user.email,
            avatarUrl: currentSession.user.user_metadata.avatar_url || '',
            username: currentSession.user.user_metadata.user_name || currentSession.user.user_metadata.preferred_username || '',
          };
          setUser(userData);
          console.log("User data set:", userData);
        } else {
          setUser(null);
          console.log("User set to null");
        }

        setLoading(false);
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        console.log("Checking for existing session");
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        
        if (data.session?.user) {
          console.log("Existing session found for:", data.session.user.email);
          // Get the user profile data
          const userData: UserData = {
            id: data.session.user.id,
            name: data.session.user.user_metadata.full_name || data.session.user.user_metadata.name || '',
            email: data.session.user.email,
            avatarUrl: data.session.user.user_metadata.avatar_url || '',
            username: data.session.user.user_metadata.user_name || data.session.user.user_metadata.preferred_username || '',
          };
          setUser(userData);
          console.log("User data set from existing session:", userData);
        } else {
          console.log("No existing session found");
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

  const signInWithGitHub = async (): Promise<void> => {
    try {
      console.log("Starting GitHub sign-in flow");
      const appUrl = window.location.origin;
      const redirectUrl = `${appUrl}/github-callback`;
      console.log("Redirect URL:", redirectUrl);
      
      // Save the current URL to redirect back after login
      localStorage.setItem('authRedirect', window.location.pathname);
      
      // Redirect to GitHub OAuth
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: redirectUrl
        }
      });
      
      if (error) {
        console.error("Error during GitHub sign-in:", error);
        throw error;
      }
      
      console.log("Sign-in initiated successfully:", data);
    } catch (error) {
      console.error('GitHub sign-in error:', error);
      toast({
        title: "Authentication Error",
        description: "Failed to sign in with GitHub. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      console.log("Signing out");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error during sign out:", error);
        throw error;
      }
      
      setUser(null);
      setSession(null);
      
      toast({
        title: "Signed out successfully",
      });
      
      navigate('/');
      console.log("Sign out successful");
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error signing out",
        description: "There was an problem signing you out. Please try again.",
        variant: "destructive",
      });
      throw error;
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
