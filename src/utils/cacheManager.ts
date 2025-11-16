/**
 * Cache Manager Utility
 * Handles clearing of old caches to ensure fresh content
 */

export const clearOldCaches = async (): Promise<void> => {
  if (!('caches' in window)) {
    return;
  }

  try {
    const cacheNames = await caches.keys();
    const oldCacheNames = cacheNames.filter((name) => {
      // Clear old API caches
      if (name.includes('api-cache') && !name.includes('v2')) {
        return true;
      }
      // Clear old dev API caches
      if (name.includes('dev-api-cache') && !name.includes('v2')) {
        return true;
      }
      // Clear workbox precache if it exists (will be regenerated)
      if (name.startsWith('workbox-precache') || name.startsWith('workbox-runtime')) {
        return true;
      }
      return false;
    });

    await Promise.all(
      oldCacheNames.map((cacheName) => {
        console.log('Clearing old cache:', cacheName);
        return caches.delete(cacheName);
      })
    );

    if (oldCacheNames.length > 0) {
      console.log(`Cleared ${oldCacheNames.length} old cache(s)`);
    }
  } catch (error) {
    console.error('Error clearing old caches:', error);
  }
};

export const clearAllCaches = async (): Promise<void> => {
  if (!('caches' in window)) {
    return;
  }

  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map((cacheName) => {
        console.log('Clearing cache:', cacheName);
        return caches.delete(cacheName);
      })
    );
    console.log('All caches cleared');
  } catch (error) {
    console.error('Error clearing all caches:', error);
  }
};

export const unregisterServiceWorkers = async (): Promise<void> => {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      registrations.map((registration) => {
        console.log('Unregistering service worker:', registration.scope);
        return registration.unregister();
      })
    );
    console.log('All service workers unregistered');
  } catch (error) {
    console.error('Error unregistering service workers:', error);
  }
};

