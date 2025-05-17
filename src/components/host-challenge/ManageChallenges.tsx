
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ManageChallenges = ({ onCreateNew }: { onCreateNew: () => void }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Challenges</CardTitle>
        <CardDescription>
          Manage all your ongoing and past challenges
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-muted-foreground">
          You haven't created any challenges yet. 
          <Button 
            variant="link" 
            onClick={onCreateNew} 
            className="font-bold"
          >
            Create your first challenge
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManageChallenges;
