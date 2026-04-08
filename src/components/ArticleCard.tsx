import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Link } from 'react-router-dom';

function ArticleCard({ id, title, status, dateCreated }: { id: string; title: string; status: boolean; dateCreated: Date; }) {
  // Format date to DD MMM YYYY
  const formattedDate = dateCreated.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="article-card">
    // Link to article page at /articles/{id}
      <Link to={`/articles/${id}`}>
        <Card key={id} size="sm">
          <CardHeader className="gap-2">
            <CardTitle>{title ?? '(Untitled)'}</CardTitle>
            <CardDescription>{id}</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-2 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={status ? 'default' : 'secondary'}>
                {status ? 'Published' : 'Unpublished'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Created</span>
              <span>{formattedDate}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
export default ArticleCard;
