
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <header className="w-full border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold gradient-text">Elite Builder AI</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/challenges" className="text-foreground/70 hover:text-foreground transition-colors">
            Challenges
          </Link>
          <Link to="/leaderboard" className="text-foreground/70 hover:text-foreground transition-colors">
            Leaderboard
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            Sign in with GitHub
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
