import { useEffect, useState } from 'react'
import { fetchDrupalResource } from './lib/drupalClient'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

type DrupalArticle = {
  id: string
  attributes?: {
    title?: string
    status?: boolean
    created?: string
  }
}

type DrupalCollectionResponse<T> = {
  data: T[]
}

type DrupalJsonApiEntryPoint = {
  links: Record<string, { href: string }>
}

function App() {
  const [articles, setArticles] = useState<DrupalArticle[]>([])
  const [resourcePath, setResourcePath] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const entryPoint = await fetchDrupalResource<DrupalJsonApiEntryPoint>('')
        const nodeResources = Object.keys(entryPoint.links).filter((key) => key.startsWith('node--'))

        if (nodeResources.length === 0) {
          throw new Error('No node resources found in JSON:API. Create a content type (for example Article) and ensure JSON:API is enabled.')
        }

        const selectedNodeResource = nodeResources.includes('node--article') ? 'node--article' : nodeResources[0]
        const selectedPath = `/${selectedNodeResource.replace('--', '/')}`

        setResourcePath(selectedPath)

        const response = await fetchDrupalResource<DrupalCollectionResponse<DrupalArticle>>(selectedPath)
        setArticles(response.data)
      } catch (loadError) {
        const message = loadError instanceof Error ? loadError.message : 'Failed to load articles from Drupal.'
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    void loadArticles()
  }, [])

  const articleCount = articles.length

  const formatDate = (value?: string) => {
    if (!value) {
      return 'Unknown date'
    }

    return new Date(value).toLocaleString()
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-10 md:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Iwan Ingman's Portfolio</CardTitle>
          <CardDescription>This is my portfolio site built with React and Drupal CMS.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Badge variant={isLoading ? 'secondary' : error ? 'destructive' : 'default'}>
            {isLoading ? 'Loading' : error ? 'Error' : 'Connected'}
          </Badge>
          <Badge variant="outline">Articles: {articleCount}</Badge>
          {resourcePath && <Badge variant="outline">Resource: {resourcePath}</Badge>}
        </CardContent>
        <CardFooter className="justify-between gap-3">
          <span className="text-muted-foreground">Last updated: {new Date().toLocaleString()}</span>
          <Button type="button" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Could not fetch articles</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && articleCount === 0 && (
        <Alert>
          <AlertTitle>No articles found</AlertTitle>
          <AlertDescription>Connected to Drupal successfully, but this resource currently has no content.</AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && articleCount > 0 && (
        <section className="grid gap-4 md:grid-cols-2">
          {articles.map((article) => (
            <Card key={article.id} size="sm">
              <CardHeader className="gap-2">
                <CardTitle>{article.attributes?.title ?? '(Untitled)'}</CardTitle>
                <CardDescription>{article.id}</CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="space-y-2 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={article.attributes?.status ? 'default' : 'secondary'}>
                    {article.attributes?.status ? 'Published' : 'Unpublished'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{formatDate(article.attributes?.created)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </main>
  )
}

export default App
