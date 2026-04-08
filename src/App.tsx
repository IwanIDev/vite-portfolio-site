import ArticlesList from '@/ArticlesList'
import ArticlePage from '@/ArticlePage'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ArticlesList />} />
      <Route path="/articles/:id" element={<ArticlePage />} />
    </Routes>
  )
}

export default App
