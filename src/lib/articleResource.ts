import { loadArticle, loadArticleContent, type DrupalArticle } from "@/lib/drupalClient"

type ArticleData = {
  article: DrupalArticle
  body: string
  summary: string | null
}

function createArticleResource(id: string) {
  let status = "pending"
  let result: ArticleData
  let error: unknown

  const suspender = Promise.all([
    loadArticle(id), // Article metadata
    loadArticleContent(id), // Actual content of the article
  ]).then(
    ([article, content]) => {
      status = "success"
      result = {
        article,
        body: content.body,
        summary: content.summary || null,
      }
    },
    (err) => {
      status = "error"
      error = err
    }
  )

  return {
    read() {
      if (status === "pending") throw suspender
      if (status === "error") throw error
      return result
    },
  }
}

export function getArticleResource(id: string) {
  return createArticleResource(id)
}
