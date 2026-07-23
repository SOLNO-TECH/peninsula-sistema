import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('UI crash:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: 560 }}>
          <h1 style={{ fontSize: '1.25rem' }}>Error al cargar la app</h1>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              background: '#f4f4f4',
              padding: '1rem',
              borderRadius: 8,
            }}
          >
            {this.state.error.message}
          </pre>
          <button type="button" onClick={() => window.location.reload()}>
            Recargar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
