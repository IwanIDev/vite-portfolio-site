import ArticleCard from "@/components/ArticleCard"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { loadArticle, loadArticleContent, type DrupalArticle } from "@/lib/drupalClient"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Separator } from "@base-ui/react/separator"
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert"

function ArticlePage() {
  const { id } = useParams<{ id: string }>()
  const [article, setArticle] = useState<DrupalArticle | null>(null)
  const [body, setBody] = useState<string | null>(null)
  const [summary, setSummary] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return;
  
    const fetchArticle = async () => {
      setIsLoading(false);
      setError(null);

      try {
        const [metadata, content] = await Promise.all([
          loadArticle(id),
          loadArticleContent(id)
        ])
        
        setArticle(metadata);
        setBody(content.body);
        setSummary(content.summary || null);
      } catch (err) {
        setError('Failed to load article. Please ensure the article exists and your Drupal site is configured correctly.');
      } finally {
        setIsLoading(false);
      }
    } 

    fetchArticle();
  }, [id])

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-10 md:px-6">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Could not fetch article {id}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Loading article...</CardTitle>
          </CardHeader>
        </Card>
      )} 

      {!isLoading && article && <ArticleCard {...article} />}
    
      {!isLoading && !error && summary && (
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent>
            <p>{summary}</p>
          </CardContent>
        </Card>
      )}

      <section className="prose">
        {isLoading && (
          <p>Loading content...</p>
        )}

        {!isLoading && !error && body && (
          <article dangerouslySetInnerHTML={{ __html: body || '<p>No content available.</p>' }} />
        )}
      </section>
    </main>
  );
}
export default ArticlePage;
