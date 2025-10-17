// Google Analytics 4 Integration
// Enterprise-grade analytics tracking

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

// Initialize Google Analytics
export function initGA() {
  if (typeof window === 'undefined' || import.meta.env.DEV) return;

  // Load GA script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer!.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
    send_page_view: true,
  });

  console.log('[Analytics] Google Analytics initialized');
}

// Track page views
export function trackPageView(url: string) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });

  console.log(`[Analytics] Page view: ${url}`);
}

// Track events
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
}

export function trackEvent({ action, category, label, value, nonInteraction = false }: AnalyticsEvent) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    non_interaction: nonInteraction,
  });

  console.log(`[Analytics] Event: ${category} > ${action}${label ? ` > ${label}` : ''}`);
}

// Common event tracking functions
export const analytics = {
  // Article interactions
  trackArticleView: (articleId: string, articleTitle: string, category: string) => {
    trackEvent({
      action: 'view',
      category: 'article',
      label: `${category}:${articleTitle}`,
      value: 1,
    });
  },

  trackArticleShare: (articleId: string, articleTitle: string, platform: string) => {
    trackEvent({
      action: 'share',
      category: 'article',
      label: `${platform}:${articleTitle}`,
      value: 1,
    });
  },

  trackArticleRead: (articleId: string, readPercentage: number) => {
    trackEvent({
      action: 'read',
      category: 'engagement',
      label: articleId,
      value: Math.round(readPercentage),
    });
  },

  // Navigation
  trackNavigation: (from: string, to: string) => {
    trackEvent({
      action: 'navigate',
      category: 'navigation',
      label: `${from} -> ${to}`,
    });
  },

  trackCategoryView: (category: string) => {
    trackEvent({
      action: 'view_category',
      category: 'navigation',
      label: category,
    });
  },

  // Search
  trackSearch: (query: string, resultsCount: number) => {
    trackEvent({
      action: 'search',
      category: 'engagement',
      label: query,
      value: resultsCount,
    });
  },

  // User engagement
  trackNewsletterSignup: (location: string) => {
    trackEvent({
      action: 'signup',
      category: 'conversion',
      label: `newsletter:${location}`,
      value: 1,
    });
  },

  trackCommentPost: (articleId: string) => {
    trackEvent({
      action: 'comment',
      category: 'engagement',
      label: articleId,
      value: 1,
    });
  },

  trackVideoPlay: (videoId: string, videoTitle: string) => {
    trackEvent({
      action: 'play',
      category: 'video',
      label: videoTitle,
      value: 1,
    });
  },

  // PWA
  trackPWAInstall: () => {
    trackEvent({
      action: 'install',
      category: 'pwa',
      label: 'app_installed',
      value: 1,
    });
  },

  trackOfflineUsage: () => {
    trackEvent({
      action: 'offline_usage',
      category: 'pwa',
      label: window.location.pathname,
      value: 1,
    });
  },

  // Errors
  trackError: (errorType: string, errorMessage: string, fatal: boolean = false) => {
    trackEvent({
      action: 'error',
      category: 'technical',
      label: `${errorType}: ${errorMessage}`,
      value: fatal ? 1 : 0,
      nonInteraction: true,
    });
  },

  // Performance
  trackPerformance: (metricName: string, value: number, rating: string) => {
    trackEvent({
      action: 'web_vital',
      category: 'performance',
      label: `${metricName}:${rating}`,
      value: Math.round(value),
      nonInteraction: true,
    });
  },

  // Interactions
  trackButtonClick: (buttonName: string, location: string) => {
    trackEvent({
      action: 'click',
      category: 'interaction',
      label: `${location}:${buttonName}`,
      value: 1,
    });
  },

  trackFormSubmit: (formName: string, success: boolean) => {
    trackEvent({
      action: success ? 'submit_success' : 'submit_error',
      category: 'form',
      label: formName,
      value: success ? 1 : 0,
    });
  },

  // Social
  trackSocialClick: (platform: string, action: string) => {
    trackEvent({
      action: action,
      category: 'social',
      label: platform,
      value: 1,
    });
  },

  // Time on page
  trackTimeOnPage: (duration: number) => {
    trackEvent({
      action: 'time_on_page',
      category: 'engagement',
      label: window.location.pathname,
      value: Math.round(duration / 1000), // Convert to seconds
      nonInteraction: true,
    });
  },

  // Scroll depth
  trackScrollDepth: (percentage: number) => {
    trackEvent({
      action: 'scroll',
      category: 'engagement',
      label: window.location.pathname,
      value: percentage,
      nonInteraction: true,
    });
  },
};

// Automatic scroll depth tracking
let maxScrollDepth = 0;
const scrollMilestones = [25, 50, 75, 100];
const trackedMilestones = new Set<number>();

export function trackScrollDepth() {
  const scrollPercentage = Math.round(
    ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
  );

  if (scrollPercentage > maxScrollDepth) {
    maxScrollDepth = scrollPercentage;

    // Track milestones
    scrollMilestones.forEach((milestone) => {
      if (scrollPercentage >= milestone && !trackedMilestones.has(milestone)) {
        trackedMilestones.add(milestone);
        analytics.trackScrollDepth(milestone);
      }
    });
  }
}

// Automatic time on page tracking
let pageStartTime = Date.now();

export function trackTimeSpentOnPage() {
  const timeSpent = Date.now() - pageStartTime;

  if (timeSpent > 5000) {
    // Only track if spent more than 5 seconds
    analytics.trackTimeOnPage(timeSpent);
  }
}

// Setup automatic tracking
export function setupAutoTracking() {
  if (typeof window === 'undefined') return;

  // Scroll depth tracking
  let scrollTimeout: NodeJS.Timeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(trackScrollDepth, 150);
  });

  // Time on page tracking
  window.addEventListener('beforeunload', trackTimeSpentOnPage);

  // Reset on page change
  window.addEventListener('popstate', () => {
    trackTimeSpentOnPage();
    pageStartTime = Date.now();
    maxScrollDepth = 0;
    trackedMilestones.clear();
  });

  // Track offline usage
  window.addEventListener('offline', () => {
    analytics.trackOfflineUsage();
  });
}

// Initialize analytics on app load
if (import.meta.env.PROD) {
  initGA();
  setupAutoTracking();
}
