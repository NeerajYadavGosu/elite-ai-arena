
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

const Navbar = () => {
  const { user, signInWithGitHub, signOut, isAuthenticated } = useAuth();
  
  const handleGitHubSignIn = async () => {
    try {
      console.log("Initiating GitHub sign-in from navbar");
      // Save current URL to redirect back after login
      localStorage.setItem('authRedirect', window.location.pathname);
      await signInWithGitHub();
    } catch (error) {
      console.error("GitHub sign-in error:", error);
      toast({
        title: "Authentication Error",
        description: "Failed to sign in with GitHub. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <header className="w-full border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold gradient-text">Elite Builder AI</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.avatarUrl} alt={user?.name || ""} />
                    <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/challenges" className="cursor-pointer">My Challenges</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/host-challenge" className="cursor-pointer">Host Challenge</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" onClick={handleGitHubSignIn} className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              <span>Sign in with GitHub</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
