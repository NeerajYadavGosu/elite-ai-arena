
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

// Define user type
type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  username: string;
};

type AuthContextType = {
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already authenticated on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const signInWithGitHub = () => {
    // GitHub OAuth parameters
    const clientId = 'YOUR_GITHUB_CLIENT_ID'; // Replace with your GitHub client ID
    const redirectUri = `${window.location.origin}/github-callback`;
    const scope = 'read:user user:email';
    
    // Save the current URL to redirect back after login
    localStorage.setItem('authRedirect', window.location.pathname);
    
    // Redirect to GitHub OAuth
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Signed out successfully",
    });
    navigate('/');
  };

  // Function to handle successful authentication
  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Get the redirect URL and navigate back
    const redirectPath = localStorage.getItem('authRedirect') || '/';
    localStorage.removeItem('authRedirect');
    
    toast({
      title: "Signed in successfully",
      description: `Welcome back, ${userData.name || userData.username}!`,
    });
    
    navigate(redirectPath);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        signInWithGitHub, 
        signOut, 
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Export a function to handle OAuth callback
export const handleOAuthCallback = async (code: string) => {
  try {
    // In a real implementation, we would exchange the code for an access token via our backend
    // For demo purposes, we'll simulate a successful login
    const mockUser = {
      id: `gh_${Math.random().toString(36).substr(2, 9)}`,
      name: 'Demo User',
      email: 'demo@example.com',
      avatarUrl: 'https://avatars.githubusercontent.com/u/583231?v=4',
      username: 'demo-user',
    };
    
    return mockUser;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};
