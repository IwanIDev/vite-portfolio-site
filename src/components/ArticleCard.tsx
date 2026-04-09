import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import type { DrupalArticle } from '@/lib/drupalClient'

function ArticleCard(article: DrupalArticle) {
  // Format date to DD MMM YYYY
  const createdDate = article.attributes?.created ? new Date(article.attributes.created) : null;

  const formattedDate = createdDate?.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const { id, attributes } = article

  return (
    <div className="article-card">
        <Card key={id} size="sm">
          <CardHeader className="gap-2">
            <CardTitle>{attributes?.title ?? '(Untitled)'}</CardTitle>
            <CardDescription>{id}</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-2 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={attributes?.status ? 'default' : 'secondary'}>
                {attributes?.status ? 'Published' : 'Unpublished'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Created</span>
              <span>{formattedDate}</span>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
export default ArticleCard;
