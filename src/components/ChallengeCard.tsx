
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type Challenge = {
  id: string;
  title: string;
  description: string;
  sponsor: string;
  sponsorLogo: string;
  deadline: string;
};

interface ChallengeCardProps {
  challenge: Challenge;
}

const ChallengeCard = ({ challenge }: ChallengeCardProps) => {
  return (
    <Card className="flex flex-col h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Sponsored by {challenge.sponsor}</span>
          </div>
        </div>
        <CardTitle className="text-xl mt-2">{challenge.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="line-clamp-3">
          {challenge.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4 pb-2">
        <div className="text-sm text-muted-foreground">
          Deadline: {challenge.deadline}
        </div>
        <Button asChild size="sm" variant="outline">
          <Link to={`/challenges/${challenge.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChallengeCard;
