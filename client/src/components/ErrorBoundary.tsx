import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">
                    Algo salió mal
                  </h1>
                  <p className="text-slate-300">
                    La aplicación encontró un error inesperado. No te preocupes, tus datos están seguros.
                  </p>
                </div>

                {this.state.error && (
                  <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
                    <p className="text-red-300 font-semibold mb-2">Error:</p>
                    <p className="text-slate-300">{this.state.error.message}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={this.handleReset}
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Volver al Inicio
                  </Button>

                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Recargar Página
                  </Button>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-slate-400">
                    Si el problema persiste, por favor contacta al soporte técnico.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
