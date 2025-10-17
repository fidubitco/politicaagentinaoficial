import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isAppInstalled, showInstallPrompt } from '@/utils/pwa';

export function PWAInstallPrompt() {
  const [show, setShow] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const installed = isAppInstalled();
    setIsInstalled(installed);

    if (!installed) {
      // Show prompt after 30 seconds on first visit
      const hasSeenPrompt = localStorage.getItem('pwa-install-prompt-seen');

      if (!hasSeenPrompt) {
        const timer = setTimeout(() => {
          setShow(true);
          localStorage.setItem('pwa-install-prompt-seen', 'true');
        }, 30000); // 30 seconds

        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleInstall = async () => {
    const accepted = await showInstallPrompt();

    if (accepted) {
      setShow(false);
      setIsInstalled(true);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('pwa-install-prompt-dismissed', 'true');
  };

  if (!show || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-96 z-50 animate-in slide-in-from-bottom-5 fade-in">
      <div className="bg-gradient-to-br from-blue-900 to-blue-950 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-6 shadow-2xl">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <Download className="w-6 h-6 text-blue-400" />
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">
                Instalar Política Argentina
              </h3>
              <p className="text-sm text-blue-200">
                Accede más rápido y lee noticias offline
              </p>
            </div>

            <div className="space-y-2 text-xs text-blue-200/80">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>Acceso instantáneo desde tu pantalla de inicio</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>Funciona offline - lee sin conexión</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>Notificaciones de noticias importantes</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleInstall}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                Instalar App
              </Button>
              <Button
                onClick={handleDismiss}
                variant="ghost"
                className="text-white/80 hover:text-white hover:bg-white/10"
                size="sm"
              >
                Ahora no
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
