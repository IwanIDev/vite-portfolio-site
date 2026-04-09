import { Component, type ReactNode } from "react"
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert"

type Props = {
  children: ReactNode
}

type State = {
  error: Error | null
}

export class ArticleErrorBoundary extends Component<Props, State> {
  state: State = {
    error: null
  }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <Alert variant="destructive">
          <AlertTitle>Could not load article</AlertTitle>
          <AlertDescription>
            Couldn't load the article. Please ensure it exists and check CMS configuration.
          </AlertDescription> 
        </Alert>
      )
    }

    return this.props.children
  }
}
