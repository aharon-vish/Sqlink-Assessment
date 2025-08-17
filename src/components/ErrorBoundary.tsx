import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';
import { Button } from '@/components/ui';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px;
  text-align: center;
  background: #f7fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const ErrorTitle = styled.h2`
  color: #e53e3e;
  margin-bottom: 16px;
  font-size: 24px;
`;

const ErrorMessage = styled.p`
  color: #4a5568;
  margin-bottom: 24px;
  max-width: 600px;
  line-height: 1.6;
`;

const ErrorDetails = styled.details`
  margin-top: 20px;
  text-align: left;
  max-width: 800px;
  width: 100%;
`;

const ErrorSummary = styled.summary`
  cursor: pointer;
  color: #3182ce;
  margin-bottom: 12px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorStack = styled.pre`
  background: #1a202c;
  color: #f7fafc;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.4;
`;

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer>
          <ErrorTitle>Something went wrong</ErrorTitle>
          <ErrorMessage>
            We're sorry, but something unexpected happened. You can try refreshing the page
            or contact support if the problem persists.
          </ErrorMessage>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="primary" onClick={this.handleRetry}>
              Try Again
            </Button>
            <Button variant="secondary" onClick={this.handleReload}>
              Reload Page
            </Button>
          </div>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <ErrorDetails>
              <ErrorSummary>Error Details (Development)</ErrorSummary>
              <ErrorStack>
                {this.state.error.stack}
                {this.state.errorInfo?.componentStack}
              </ErrorStack>
            </ErrorDetails>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;