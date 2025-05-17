
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AuthRequired = () => {
  const { signInWithGitHub } = useAuth();
  
  return (
    <div className="max-w-md w-full">
      <Card>
        <CardHeader>
          <CardTitle>Sign in Required</CardTitle>
          <CardDescription>
            You need to sign in with GitHub to host and manage challenges.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-8">
          <Button onClick={signInWithGitHub} className="w-full flex items-center justify-center gap-2">
            <Github className="h-4 w-4" />
            <span>Sign in with GitHub</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthRequired;
