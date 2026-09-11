'use client';

import * as React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackTitle?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    try {
      fetch('/api/debug-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'component_error',
          name: error.name,
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
        }),
      }).catch(() => {});
    } catch {}
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex size-full flex-col items-center justify-center p-6 text-center bg-rose-50/80 backdrop-blur-md border border-rose-200 rounded-3xl">
          <div className="size-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-3 text-lg font-bold">
            !
          </div>
          <h3 className="text-sm font-bold text-rose-900 mb-1">
            {this.props.fallbackTitle || 'Erreur d’affichage de la carte'}
          </h3>
          <p className="text-xs text-rose-700 max-w-md font-mono bg-white/80 p-2 rounded-lg border border-rose-200 mb-3 break-words">
            {this.state.error?.message || 'Erreur inconnue'}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-[#fc5200] text-white rounded-full text-xs font-semibold hover:brightness-110 shadow-md"
          >
            Réessayer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
