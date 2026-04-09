import { Suspense, useMemo } from "react"
import { useParams } from "react-router-dom"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { getArticleResource } from "@/lib/articleResource"
import ArticleContent from "@/ArticleContent"
import { ArticleErrorBoundary } from "@/ArticleErrorBoundary"

function ArticleLoading() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Loading article...</CardTitle>
      </CardHeader>
    </Card>
  )
}

function ArticlePage() {
  const { id } = useParams<{ id: string }>()

  const resource = useMemo(() => {
    if (!id) return null
    return getArticleResource(id)
  }, [id])

  if (!resource) return null

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-10 md:px-6">
      <ArticleErrorBoundary>
        <Suspense fallback={<ArticleLoading />}>
          <ArticleContent resource={resource} />
        </Suspense>
      </ArticleErrorBoundary>
    </main>
  )
}

export default ArticlePage
