import ArticleCard from "@/components/ArticleCard"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { loadArticle, type DrupalArticle } from "@/lib/drupalClient"

function ArticlePage() {
  const { id } = useParams<{ id: string }>()
  const [article, setArticle] = useState<DrupalArticle | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return;
    
    setIsLoading(true)
    loadArticle(id)
      .then(setArticle)
      .catch(() => setError('Failed to load article. Please ensure the article exists and your Drupal site is configured correctly.'))
      .finally(() => setIsLoading(false))
  }, [id])

  if (isLoading) return <p>Loading...</p>
  if (error || !article ) return <p>{error || 'Article not found.'}</p>

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-10 md:px-6">
      <ArticleCard {...article} />
    </main>
  );
}
export default ArticlePage;
