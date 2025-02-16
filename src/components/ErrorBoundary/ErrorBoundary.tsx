import { Component } from 'react';

import type { ErrorInfo, ReactNode } from 'react';

export type ErrorBoundaryProps = {
  children?: ReactNode;
};

class ErrorBoundary extends Component {
  props: ErrorBoundaryProps = {};
  state: { hasError: boolean } = { hasError: false };

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // error
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
    console.error(error, errorInfo);
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;
    if (hasError) {
      // You can render any custom fallback UI
      return <div>Something broke! Please refresh and try again.</div>;
    }

    return children;
  }
}

export default ErrorBoundary;
