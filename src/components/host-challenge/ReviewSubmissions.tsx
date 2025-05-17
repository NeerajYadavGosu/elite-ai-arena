
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ReviewSubmissions = () => {
  // Mock data for submissions
  const mockSubmissions: any[] = [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Submissions</CardTitle>
        <CardDescription>
          Score and provide feedback on submitted projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mockSubmissions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participant</TableHead>
                <TableHead>Challenge</TableHead>
                <TableHead>AI Score</TableHead>
                <TableHead>GitHub</TableHead>
                <TableHead>Demo</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* This will be populated with actual submissions */}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No submissions to review yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewSubmissions;
