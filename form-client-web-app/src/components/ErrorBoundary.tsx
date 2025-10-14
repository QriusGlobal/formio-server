import { Component, type ReactNode, type ErrorInfo } from 'react';

import { logger } from '../utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Upload component error', { 
      error: error.message, 
      componentStack: errorInfo.componentStack 
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div 
          className="p-6 bg-red-900 rounded-lg text-white"
          role="alert"
          aria-live="assertive"
        >
          <h3 className="font-bold text-lg mb-2">Upload Error</h3>
          <p className="mb-4">Something went wrong with the file upload.</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
