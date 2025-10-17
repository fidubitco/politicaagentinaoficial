import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Activity, Globe } from "lucide-react";
import gsap from "gsap";

interface EconomicIndicator {
  id: string;
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
  trending: "up" | "down" | "neutral";
  icon: string;
}

export function EconomicTicker() {
  const tickerRef = useRef<HTMLDivElement>(null);
  const [indicators, setIndicators] = useState<EconomicIndicator[]>([
    {
      id: "dolar-blue",
      name: "Dólar Blue",
      symbol: "USD/ARS",
      value: 1050.50,
      change: +25.30,
      changePercent: 2.47,
      trending: "up",
      icon: "$"
    },
    {
      id: "dolar-oficial",
      name: "Dólar Oficial",
      symbol: "USD/ARS",
      value: 890.00,
      change: +15.20,
      changePercent: 1.74,
      trending: "up",
      icon: "$"
    },
    {
      id: "merval",
      name: "Merval",
      symbol: "MERV",
      value: 1456789.45,
      change: -2345.67,
      changePercent: -0.16,
      trending: "down",
      icon: "📊"
    },
    {
      id: "riesgo-pais",
      name: "Riesgo País",
      symbol: "EMBI+",
      value: 1580,
      change: +35,
      changePercent: 2.27,
      trending: "up",
      icon: "⚠️"
    },
    {
      id: "inflacion",
      name: "Inflación (Mensual)",
      symbol: "IPC",
      value: 12.8,
      change: -1.2,
      changePercent: -8.57,
      trending: "down",
      icon: "📈"
    },
    {
      id: "reservas",
      name: "Reservas BCRA",
      symbol: "USD",
      value: 21500,
      change: -850,
      changePercent: -3.80,
      trending: "down",
      icon: "🏦"
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIndicators(prev => prev.map(indicator => {
        const randomChange = (Math.random() - 0.5) * 2;
        const newValue = indicator.value + randomChange;
        const change = newValue - indicator.value;
        const changePercent = (change / indicator.value) * 100;

        return {
          ...indicator,
          value: newValue,
          change,
          changePercent,
          trending: change > 0 ? "up" : change < 0 ? "down" : "neutral"
        };
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // GSAP Animation
  useEffect(() => {
    if (tickerRef.current) {
      const items = tickerRef.current.querySelectorAll('.ticker-item');
      gsap.fromTo(items,
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out"
        }
      );
    }
  }, []);

  const formatValue = (indicator: EconomicIndicator) => {
    if (indicator.id === "merval") {
      return indicator.value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    if (indicator.id === "inflacion") {
      return `${indicator.value.toFixed(1)}%`;
    }
    if (indicator.id === "reservas") {
      return `$${indicator.value.toFixed(0)}M`;
    }
    return indicator.value.toFixed(2);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-y border-slate-700 overflow-hidden">
      <div
        ref={tickerRef}
        className="flex items-center gap-8 px-4 py-3 animate-scroll"
      >
        <div className="flex items-center gap-2 text-white/90 font-semibold whitespace-nowrap">
          <Activity className="h-5 w-5" />
          <span className="text-sm uppercase tracking-wide">En Vivo</span>
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </div>

        {indicators.map((indicator) => (
          <motion.div
            key={indicator.id}
            className="ticker-item flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50 backdrop-blur-sm hover:bg-slate-700/50 transition-colors cursor-pointer whitespace-nowrap"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-lg">{indicator.icon}</div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  {indicator.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">
                  {formatValue(indicator)}
                </span>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  indicator.trending === "up" ? "text-emerald-400" :
                  indicator.trending === "down" ? "text-red-400" :
                  "text-slate-400"
                }`}>
                  {indicator.trending === "up" && <TrendingUp className="h-3 w-3" />}
                  {indicator.trending === "down" && <TrendingDown className="h-3 w-3" />}
                  <span>
                    {indicator.changePercent > 0 ? "+" : ""}
                    {indicator.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Duplicate for infinite scroll effect */}
        {indicators.map((indicator) => (
          <motion.div
            key={`${indicator.id}-duplicate`}
            className="ticker-item flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50 backdrop-blur-sm hover:bg-slate-700/50 transition-colors cursor-pointer whitespace-nowrap"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-lg">{indicator.icon}</div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  {indicator.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">
                  {formatValue(indicator)}
                </span>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  indicator.trending === "up" ? "text-emerald-400" :
                  indicator.trending === "down" ? "text-red-400" :
                  "text-slate-400"
                }`}>
                  {indicator.trending === "up" && <TrendingUp className="h-3 w-3" />}
                  {indicator.trending === "down" && <TrendingDown className="h-3 w-3" />}
                  <span>
                    {indicator.changePercent > 0 ? "+" : ""}
                    {indicator.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 60s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

export function EconomicIndicatorsBanner() {
  return (
    <div className="sticky top-0 z-40 shadow-lg">
      <EconomicTicker />
    </div>
  );
}
