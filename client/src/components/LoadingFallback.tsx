import { Loader2 } from 'lucide-react';

export function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-500/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">
            Cargando POLÍTICA ARGENTINA
          </h2>
          <p className="text-slate-400">
            Preparando tu experiencia de análisis político...
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Inicializando aplicación</span>
        </div>
      </div>
    </div>
  );
}
