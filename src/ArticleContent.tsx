import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Separator } from "./components/ui/separator"
import type { DrupalArticle } from "./lib/drupalClient"
import ArticleCard from "@/components/ArticleCard"

type Props = {
  resource: {
    read: () => {
      article: DrupalArticle
      body: string
      summary: string | null
    }
  }
}

function ArticleContent({ resource }: Props) {
  const { article, body, summary } = resource.read()
  
  return (
    <>
      <ArticleCard {...article} />

      {summary && (
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
        <article
          dangerouslySetInnerHTML={{
            __html: body || "<p>No content available.</p>",
          }}
        />
      </section>
    </>
  )

}

export default ArticleContent
