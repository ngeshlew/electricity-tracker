import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        replaceAttrValues: { '#000000': 'currentColor', black: 'currentColor' },
      },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      disable: process.env.NODE_ENV === 'development',
      includeAssets: ['vite.svg'],
      manifest: {
        name: 'Electricity Tracker',
        short_name: 'ElecTracker',
        description: 'AI-powered electricity consumption tracking dashboard with real-time analytics',
        theme_color: '#8b5cf6',
        background_color: '#0a0a0a',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'vite.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        // Force immediate activation of new service worker
        skipWaiting: true,
        clientsClaim: true,
        // Use NetworkFirst with short cache for better freshness
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.electricity-tracker\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache-v2',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours instead of 365 days
              },
              networkTimeoutSeconds: 10
            }
          },
          {
            urlPattern: /^http:\/\/localhost:3001\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'dev-api-cache-v2',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5 // 5 minutes for dev
              },
              networkTimeoutSeconds: 5
            }
          }
        ],
        // Clean up old caches on update
        cleanupOutdatedCaches: true,
        // Don't cache index.html to ensure fresh content
        navigateFallback: null
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          ui: ['@heroicons/react']
        }
      }
    }
  },
  define: {
    // Define environment variables for production
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  }
})