import { useEffect, useState } from 'react'
import { fetchDrupalResource } from './lib/drupalClient'
import './App.css'

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

  return (
    <main>
      <h1 className="mb-4 text-2xl font-bold">Articles</h1>
      {!isLoading && !error && resourcePath && <p>Using resource: {resourcePath}</p>}

      {isLoading && <p>Loading articles…</p>}

      {error && (
        <p role="alert" className="text-red-600">
          Could not fetch articles: {error}
        </p>
      )}

      {!isLoading && !error && articles.length === 0 && (
        <p>Connected to Drupal, but no articles were returned.</p>
      )}

      {!isLoading && !error && articles.length > 0 && (
        <ul style={{ textAlign: 'left' }}>
          {articles.map((article) => (
            <li key={article.id}>
              <strong>{article.attributes?.title ?? '(Untitled)'}</strong>
              <div>ID: {article.id}</div>
              <div>Status: {article.attributes?.status ? 'Published' : 'Unpublished'}</div>
              {article.attributes?.created && <div>Created: {new Date(article.attributes.created).toLocaleString()}</div>}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default App
