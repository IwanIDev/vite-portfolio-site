import ArticleCard from "@/components/ArticleCard"
import type { DrupalArticle } from "@/lib/drupalClient"

function ArticlePage(article: DrupalArticle) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-10 md:px-6">
      <ArticleCard {...article} />
    </main>
  );
}
export default ArticlePage;
