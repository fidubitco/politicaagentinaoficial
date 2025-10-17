import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/tokens.css";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LoadingFallback } from "./components/LoadingFallback";
import { Suspense } from "react";

// Add global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

try {
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    throw new Error('Root element not found');
  }

  console.log('Initializing React app...');

  createRoot(rootElement).render(
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <App />
      </Suspense>
    </ErrorBoundary>
  );

  console.log('React app initialized successfully');
} catch (error) {
  console.error('Failed to initialize app:', error);

  // Fallback UI if React fails to mount
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="min-height: 100vh; background: linear-gradient(to bottom right, #0f172a, #1e3a8a, #0f172a); display: flex; align-items: center; justify-center; padding: 2rem;">
        <div style="max-width: 32rem; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(12px); border-radius: 1rem; border: 1px solid rgba(255, 255, 255, 0.2); padding: 2rem; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);">
          <h1 style="font-size: 1.5rem; font-weight: bold; color: white; margin-bottom: 1rem;">
            Error de Inicialización
          </h1>
          <p style="color: #cbd5e1; margin-bottom: 1.5rem;">
            La aplicación no pudo inicializarse correctamente. Por favor, recarga la página.
          </p>
          <button
            onclick="window.location.reload()"
            style="background: #3b82f6; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; border: none; cursor: pointer; font-weight: 600;"
          >
            Recargar Página
          </button>
          <p style="color: #64748b; font-size: 0.75rem; margin-top: 1rem;">
            Error: ${error instanceof Error ? error.message : String(error)}
          </p>
        </div>
      </div>
    `;
  }
}
