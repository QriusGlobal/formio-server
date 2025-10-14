/**
 * Error Boundary Component
 *
 * Catches React errors in child components and displays a fallback UI
 * instead of crashing the entire application.
 *
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */

import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  /**
   * Child components to wrap with error boundary
   */
  children: ReactNode;

  /**
   * Optional fallback UI to display on error
   */
  fallback?: ReactNode;

  /**
   * Optional callback fired when error is caught
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary Component
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Update state with error information
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    // Reset error state to retry rendering
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Custom fallback UI if provided
      if (fallback) {
        return fallback;
      }

      // Default fallback UI
      return (
        <div
          style={{
            padding: '24px',
            margin: '16px 0',
            background: '#fff5f5',
            border: '2px solid #ff5252',
            borderRadius: '8px',
          }}
          role="alert"
        >
          <h2 style={{ marginTop: 0, color: '#d32f2f' }}>
            ⚠️ Something went wrong
          </h2>
          <p style={{ color: '#666' }}>
            An unexpected error occurred. Please try refreshing the page.
          </p>

          {/* Error details (only in development) */}
          {process.env.NODE_ENV === 'development' && error && (
            <details style={{ marginTop: '16px' }}>
              <summary style={{ cursor: 'pointer', color: '#1976d2' }}>
                Show error details
              </summary>
              <pre
                style={{
                  marginTop: '12px',
                  padding: '12px',
                  background: '#f5f5f5',
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '12px',
                  color: '#d32f2f',
                }}
              >
                <strong>Error:</strong> {error.message}
                {'\n\n'}
                <strong>Stack trace:</strong>
                {'\n'}
                {error.stack}
                {'\n\n'}
                {errorInfo && (
                  <>
                    <strong>Component stack:</strong>
                    {'\n'}
                    {errorInfo.componentStack}
                  </>
                )}
              </pre>
            </details>
          )}

          {/* Reset button */}
          <button
            onClick={this.handleReset}
            style={{
              marginTop: '16px',
              padding: '8px 16px',
              background: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
