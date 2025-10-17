// Web Vitals Monitoring System
// Measures and reports Core Web Vitals metrics

interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

type MetricCallback = (metric: WebVitalsMetric) => void;

// Thresholds based on Google's recommendations
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
  FCP: { good: 1800, poor: 3000 },
};

function getRating(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[metricName as keyof typeof THRESHOLDS];

  if (!threshold) return 'good';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

// Fallback implementation if web-vitals library is not available
function measureWebVitals(callback: MetricCallback) {
  // Measure Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;

        const metric: WebVitalsMetric = {
          name: 'LCP',
          value: lastEntry.renderTime || lastEntry.loadTime,
          rating: getRating('LCP', lastEntry.renderTime || lastEntry.loadTime),
          delta: lastEntry.renderTime || lastEntry.loadTime,
          id: `v3-${Date.now()}-${Math.random()}`,
          navigationType: (performance.getEntriesByType('navigation')[0] as any)?.type || 'navigate',
        };

        callback(metric);
      });

      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      console.warn('[Web Vitals] LCP measurement failed:', e);
    }

    // Measure First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as any[];

        entries.forEach((entry) => {
          const metric: WebVitalsMetric = {
            name: 'FID',
            value: entry.processingStart - entry.startTime,
            rating: getRating('FID', entry.processingStart - entry.startTime),
            delta: entry.processingStart - entry.startTime,
            id: `v3-${Date.now()}-${Math.random()}`,
            navigationType: (performance.getEntriesByType('navigation')[0] as any)?.type || 'navigate',
          };

          callback(metric);
        });
      });

      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      console.warn('[Web Vitals] FID measurement failed:', e);
    }

    // Measure Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as any[];

        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });

        const metric: WebVitalsMetric = {
          name: 'CLS',
          value: clsValue,
          rating: getRating('CLS', clsValue),
          delta: clsValue,
          id: `v3-${Date.now()}-${Math.random()}`,
          navigationType: (performance.getEntriesByType('navigation')[0] as any)?.type || 'navigate',
        };

        callback(metric);
      });

      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.warn('[Web Vitals] CLS measurement failed:', e);
    }

    // Measure Time to First Byte (TTFB)
    try {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      if (navigationEntry) {
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;

        const metric: WebVitalsMetric = {
          name: 'TTFB',
          value: ttfb,
          rating: getRating('TTFB', ttfb),
          delta: ttfb,
          id: `v3-${Date.now()}-${Math.random()}`,
          navigationType: navigationEntry.type || 'navigate',
        };

        callback(metric);
      }
    } catch (e) {
      console.warn('[Web Vitals] TTFB measurement failed:', e);
    }

    // Measure First Contentful Paint (FCP)
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries[0] as any;

        const metric: WebVitalsMetric = {
          name: 'FCP',
          value: fcpEntry.startTime,
          rating: getRating('FCP', fcpEntry.startTime),
          delta: fcpEntry.startTime,
          id: `v3-${Date.now()}-${Math.random()}`,
          navigationType: (performance.getEntriesByType('navigation')[0] as any)?.type || 'navigate',
        };

        callback(metric);
      });

      fcpObserver.observe({ type: 'paint', buffered: true });
    } catch (e) {
      console.warn('[Web Vitals] FCP measurement failed:', e);
    }
  }
}

// Analytics reporting
function sendToAnalytics(metric: WebVitalsMetric) {
  // Send to Google Analytics 4 if available
  if (typeof gtag !== 'undefined') {
    gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
      metric_rating: metric.rating,
    });
  }

  // Send to custom analytics endpoint
  if (import.meta.env.PROD) {
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
        page: window.location.pathname,
        timestamp: Date.now(),
      }),
      keepalive: true,
    }).catch((error) => {
      console.warn('[Web Vitals] Analytics reporting failed:', error);
    });
  }
}

// Console reporting for development
function logMetric(metric: WebVitalsMetric) {
  const emoji = {
    good: '✅',
    'needs-improvement': '⚠️',
    poor: '❌',
  }[metric.rating];

  const color = {
    good: 'color: #10b981',
    'needs-improvement': 'color: #f59e0b',
    poor: 'color: #ef4444',
  }[metric.rating];

  console.log(
    `%c${emoji} ${metric.name}: ${Math.round(metric.value)}ms (${metric.rating})`,
    `${color}; font-weight: bold; font-size: 12px;`
  );

  // Detailed breakdown
  console.groupCollapsed(`${metric.name} Details`);
  console.table({
    Value: `${Math.round(metric.value)}ms`,
    Rating: metric.rating,
    Delta: `${Math.round(metric.delta)}ms`,
    'Navigation Type': metric.navigationType,
    ID: metric.id,
  });
  console.groupEnd();
}

// Main export - initialize Web Vitals monitoring
export function initWebVitals() {
  if (typeof window === 'undefined') return;

  const handleMetric = (metric: WebVitalsMetric) => {
    // Log in development
    if (import.meta.env.DEV) {
      logMetric(metric);
    }

    // Send to analytics in production
    if (import.meta.env.PROD) {
      sendToAnalytics(metric);
    }
  };

  // Try to use web-vitals library if available
  try {
    // Dynamic import to avoid bundling if not used
    measureWebVitals(handleMetric);
  } catch (error) {
    console.warn('[Web Vitals] Fallback measurement:', error);
    measureWebVitals(handleMetric);
  }
}

// Performance marks for custom measurements
export function markPerformance(name: string) {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(name);
  }
}

export function measurePerformance(name: string, startMark: string, endMark?: string) {
  if (typeof performance !== 'undefined' && performance.measure) {
    try {
      const measure = performance.measure(name, startMark, endMark);
      console.log(`⏱️ ${name}: ${Math.round(measure.duration)}ms`);
      return measure.duration;
    } catch (e) {
      console.warn(`[Performance] Measure failed for ${name}:`, e);
    }
  }
  return 0;
}

// Resource timing analysis
export function analyzeResourceTiming() {
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

  const analysis = {
    total: resources.length,
    byType: {} as Record<string, number>,
    slow: [] as Array<{ name: string; duration: number }>,
    totalDuration: 0,
  };

  resources.forEach((resource) => {
    // Count by type
    const type = resource.initiatorType || 'other';
    analysis.byType[type] = (analysis.byType[type] || 0) + 1;

    // Find slow resources (>1s)
    if (resource.duration > 1000) {
      analysis.slow.push({
        name: resource.name,
        duration: Math.round(resource.duration),
      });
    }

    analysis.totalDuration += resource.duration;
  });

  console.group('📊 Resource Timing Analysis');
  console.table(analysis.byType);
  if (analysis.slow.length > 0) {
    console.warn('⚠️ Slow resources (>1s):', analysis.slow);
  }
  console.log(`Total resources: ${analysis.total}`);
  console.log(`Total load time: ${Math.round(analysis.totalDuration)}ms`);
  console.groupEnd();

  return analysis;
}
