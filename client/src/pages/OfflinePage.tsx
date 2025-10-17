import { WifiOff, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center">
              <WifiOff className="w-12 h-12 text-blue-400" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-white">
              Sin Conexión a Internet
            </h1>
            <p className="text-lg text-slate-300">
              Parece que estás offline. No te preocupes, puedes seguir navegando el contenido almacenado en caché.
            </p>
          </div>

          {/* Features available offline */}
          <div className="bg-black/30 rounded-lg p-6 text-left">
            <h3 className="text-white font-semibold mb-3">Disponible sin conexión:</h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>Artículos recientemente visitados</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>Páginas principales del sitio</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>Contenido multimedia en caché</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleRetry}
              className="gap-2 bg-blue-600 hover:bg-blue-700 flex-1"
              size="lg"
            >
              <RefreshCw className="w-5 h-5" />
              Reintentar Conexión
            </Button>

            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 flex-1"
              size="lg"
              asChild
            >
              <Link href="/">
                <Home className="w-5 h-5 mr-2" />
                Ir al Inicio
              </Link>
            </Button>
          </div>

          {/* Tips */}
          <div className="pt-6 border-t border-white/10">
            <p className="text-sm text-slate-400">
              💡 <strong>Sugerencia:</strong> Esta aplicación funciona offline. Puedes instalarla en tu dispositivo para acceso rápido.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
