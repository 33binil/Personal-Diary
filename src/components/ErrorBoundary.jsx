import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, info: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // You could log to an external service here
    this.setState({ error, info })
    // eslint-disable-next-line no-console
    console.error('Uncaught error in component tree:', error, info)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, info: null })
  }

  render() {
    if (!this.state.hasError) return this.props.children || null

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 text-white p-6">
        <div className="max-w-2xl w-full bg-[#0b1924] border border-white/10 rounded-xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
              <div className="text-sm opacity-80 mb-3">An unexpected error occurred. You can reload the page or try to continue.</div>
              <div className="font-mono text-xs bg-black/20 p-3 rounded text-ellipsis overflow-hidden max-h-40 overflow-auto">
                <div className="font-semibold">Error:</div>
                <pre className="whitespace-pre-wrap text-[12px]">{String(this.state.error && this.state.error.toString())}</pre>
                {this.state.info && (
                  <>
                    <div className="font-semibold mt-2">Component stack:</div>
                    <pre className="whitespace-pre-wrap text-[12px]">{this.state.info.componentStack}</pre>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <button onClick={this.handleReload} className="px-4 py-2 bg-green-500 rounded font-semibold">Reload</button>
              <button onClick={this.handleReset} className="px-4 py-2 bg-white/10 rounded">Continue</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ErrorBoundary
