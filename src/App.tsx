import { useEffect, useState } from 'react'
import { fetchDrupalResource } from './lib/drupalClient'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import ArticleCard from '@/components/ArticleCard'

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

        let entryPoint: DrupalJsonApiEntryPoint
        try {
          entryPoint = await fetchDrupalResource<DrupalJsonApiEntryPoint>('')
        } catch (error) {
          throw new Error('Failed to load JSON:API entry point. Ensure your Drupal site is configured correctly and JSON:API is enabled.')
        }
        const nodeResources = Object.keys(entryPoint.links).filter((key) => key.startsWith('node--'))

        if (nodeResources.length === 0) {
          throw new Error('No node resources found in JSON:API. Create a content type (for example Article) and ensure JSON:API is enabled.')
        }

        const selectedNodeResource = nodeResources.includes('node--article') ? 'node--article' : nodeResources[0]
        const selectedPath = `/${selectedNodeResource.replace('--', '/')}`

        setResourcePath(selectedPath)

        const response = await fetchDrupalResource<DrupalCollectionResponse<DrupalArticle>>(selectedPath)
        setArticles(response.data)
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError('An unexpected error occurred while loading articles.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    void loadArticles()
  }, [])

  const articleCount = articles.length

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-10 md:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Iwan Ingman's Portfolio</CardTitle>
          <CardDescription>This is a test page for my Portfolio site using Drupal CMS.</CardDescription>
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
            <ArticleCard 
              id={article.id}
              title={article.attributes?.title || 'Untitled'}
              dateCreated={new Date(article.attributes?.created || '')}
              status={article.attributes?.status ?? false}
            />
          ))}
        </section>
      )}
    </main>
  )
}

export default App
