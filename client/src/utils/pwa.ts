// PWA Service Worker Registration and Management

export function registerServiceWorker(): Promise<ServiceWorkerRegistration | undefined> {
  if ('serviceWorker' in navigator) {
    return navigator.serviceWorker
      .register('/service-worker.js', { scope: '/' })
      .then((registration) => {
        console.log('[PWA] Service Worker registered successfully:', registration.scope);

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); // Check every hour

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;

          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available
                console.log('[PWA] New version available!');

                // Show update notification to user
                if (window.confirm('Nueva versión disponible. ¿Actualizar ahora?')) {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              }
            });
          }
        });

        return registration;
      })
      .catch((error) => {
        console.error('[PWA] Service Worker registration failed:', error);
        return undefined;
      });
  }

  console.warn('[PWA] Service Workers not supported');
  return Promise.resolve(undefined);
}

export function unregisterServiceWorker(): Promise<boolean> {
  if ('serviceWorker' in navigator) {
    return navigator.serviceWorker.ready
      .then((registration) => {
        return registration.unregister();
      })
      .catch((error) => {
        console.error('[PWA] Service Worker unregistration failed:', error);
        return false;
      });
  }

  return Promise.resolve(false);
}

// Check if app is installed
export function isAppInstalled(): boolean {
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }

  // iOS detection
  if ((window.navigator as any).standalone === true) {
    return true;
  }

  return false;
}

// Handle beforeinstallprompt event
let deferredPrompt: any = null;

export function setupInstallPrompt(callback?: (event: any) => void) {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();

    // Stash the event so it can be triggered later
    deferredPrompt = e;

    console.log('[PWA] Install prompt available');

    if (callback) {
      callback(e);
    }
  });

  // Track installation
  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App installed successfully');
    deferredPrompt = null;

    // Track analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'pwa_install', {
        event_category: 'engagement',
        event_label: 'PWA Installation',
      });
    }
  });
}

export async function showInstallPrompt(): Promise<boolean> {
  if (!deferredPrompt) {
    console.warn('[PWA] Install prompt not available');
    return false;
  }

  // Show the install prompt
  deferredPrompt.prompt();

  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;

  console.log(`[PWA] User ${outcome === 'accepted' ? 'accepted' : 'dismissed'} the install prompt`);

  // Clear the deferred prompt
  deferredPrompt = null;

  return outcome === 'accepted';
}

// Network status detection
export function setupNetworkDetection() {
  const updateOnlineStatus = () => {
    const online = navigator.onLine;

    document.body.classList.toggle('offline', !online);

    console.log(`[PWA] Network status: ${online ? 'online' : 'offline'}`);

    // Show toast notification
    if (!online) {
      // You could show a toast here
      console.warn('[PWA] You are offline. Some features may be limited.');
    }
  };

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

  // Initial check
  updateOnlineStatus();
}

// Request persistent storage
export async function requestPersistentStorage(): Promise<boolean> {
  if (navigator.storage && navigator.storage.persist) {
    const isPersisted = await navigator.storage.persist();
    console.log(`[PWA] Persistent storage: ${isPersisted ? 'granted' : 'denied'}`);
    return isPersisted;
  }
  return false;
}

// Estimate storage usage
export async function estimateStorageUsage() {
  if (navigator.storage && navigator.storage.estimate) {
    const estimate = await navigator.storage.estimate();
    const usage = estimate.usage || 0;
    const quota = estimate.quota || 0;
    const percentUsed = (usage / quota) * 100;

    console.log(`[PWA] Storage: ${formatBytes(usage)} / ${formatBytes(quota)} (${percentUsed.toFixed(2)}%)`);

    return { usage, quota, percentUsed };
  }

  return null;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Share API support
export function canShare(): boolean {
  return navigator.share !== undefined;
}

export async function shareContent(data: { title: string; text: string; url: string }): Promise<boolean> {
  if (!canShare()) {
    console.warn('[PWA] Web Share API not supported');
    return false;
  }

  try {
    await navigator.share(data);
    console.log('[PWA] Content shared successfully');
    return true;
  } catch (error: any) {
    if (error.name !== 'AbortError') {
      console.error('[PWA] Share failed:', error);
    }
    return false;
  }
}
