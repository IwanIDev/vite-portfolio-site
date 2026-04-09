import ArticleCard from "@/components/ArticleCard"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { loadArticle, loadArticleContent, type DrupalArticle, type DrupalArticleContent } from "@/lib/drupalClient"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Separator } from "@base-ui/react/separator"

function ArticlePage() {
  const { id } = useParams<{ id: string }>()
  const [article, setArticle] = useState<DrupalArticle | null>(null)
  const [body, setBody] = useState<string | null>(null)
  const [summary, setSummary] = useState<string | null>(null)
  const [isContentLoading, setIsContentLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return;
    
    setIsLoading(true)
    loadArticle(id)
      .then(setArticle)
      .catch(() => setError('Failed to load article. Please ensure the article exists and your Drupal site is configured correctly.'))
      .finally(() => setIsLoading(false))
    
    // Load article content
    loadArticleContent(id)
    .then((content: DrupalArticleContent) => {
      setBody(content.body)
      setSummary(content.summary || null)
    })
    .catch(() => setError('Failed to load article content. Please ensure the article exists and your Drupal site is configured correctly.'))
    .finally(() => setIsContentLoading(false))
  }, [id])

  if (isLoading) return <p>Loading...</p>
  if (error || !article ) return <p>{error || 'Article not found.'}</p>

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-10 md:px-6">
      <ArticleCard {...article} />
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
        {summary ? (
          <p>{summary}</p>
        ) : (
          <p>No summary available.</p>
        )}
        </CardContent>
      </Card>

      <section className="prose">
        {isContentLoading ? (
          <p>Loading content...</p>
        ) : (
          <article dangerouslySetInnerHTML={{ __html: body || '<p>No content available.</p>' }} />
        )}
      </section>
    </main>
  );
}
export default ArticlePage;
