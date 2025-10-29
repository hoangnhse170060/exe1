import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('❌ Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '10px',
            maxWidth: '700px',
            boxShadow: '0 10px 50px rgba(0,0,0,0.3)'
          }}>
            <h1 style={{ color: '#f5576c', marginBottom: '20px', fontSize: '28px' }}>
              ⚠️ Application Error
            </h1>
            <p style={{ color: '#333', lineHeight: '1.6', marginBottom: '20px' }}>
              <strong>The application encountered an error and couldn't render.</strong>
            </p>
            
            <div style={{
              background: '#fff5f5',
              border: '2px solid #feb2b2',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <p style={{ color: '#c53030', fontWeight: 'bold', marginBottom: '10px' }}>
                Error Details:
              </p>
              <code style={{
                display: 'block',
                background: '#fff',
                padding: '15px',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#2d3748',
                overflowX: 'auto'
              }}>
                {this.state.error?.toString()}
              </code>
              {this.state.error?.stack && (
                <details style={{ marginTop: '15px' }}>
                  <summary style={{ cursor: 'pointer', color: '#4a5568' }}>
                    Stack Trace
                  </summary>
                  <pre style={{
                    marginTop: '10px',
                    padding: '15px',
                    background: '#f7fafc',
                    borderRadius: '4px',
                    fontSize: '12px',
                    overflow: 'auto',
                    maxHeight: '300px'
                  }}>
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>

            <div style={{
              background: '#e6fffa',
              border: '2px solid #81e6d9',
              borderRadius: '8px',
              padding: '20px'
            }}>
              <p style={{ color: '#234e52', fontWeight: 'bold', marginBottom: '10px' }}>
                💡 Common Fixes:
              </p>
              <ul style={{ color: '#234e52', lineHeight: '1.8', paddingLeft: '20px' }}>
                <li>Check browser console (F12) for more details</li>
                <li>Verify all environment variables are set (.env file)</li>
                <li>Make sure all dependencies are installed (npm install)</li>
                <li>Clear browser cache and hard reload (Ctrl+Shift+R)</li>
                <li>Check if Supabase client is properly initialized</li>
              </ul>
            </div>

            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '20px',
                padding: '12px 24px',
                background: '#f5576c',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              🔄 Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
