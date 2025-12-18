import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'My Music - Advanced Music Player',
        short_name: 'My Music',
        description: 'A modern, feature-rich music streaming website',
        theme_color: '#0ea5e9',
        background_color: '#111827',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Library',
            short_name: 'Library',
            description: 'View your music library',
            url: '/library',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }]
          },
          {
            name: 'Search',
            short_name: 'Search',
            description: 'Search for songs',
            url: '/search',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        globIgnores: ['**/Music/**'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'unsplash-images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            urlPattern: /\/Music\/.*\.(mp3|m4a|wav|flac|ogg|aac)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'music-files',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: /\/songs\.json(\?.*)?$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'songs-data',
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 0 // Always fetch fresh
              },
              networkTimeoutSeconds: 5
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  server: {
    port: 3000,
    open: true,
    fs: {
      strict: false,
    },
  },
  publicDir: 'public',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    copyPublicDir: true,
    rollupOptions: {
      // Exclude Music folder from public dir copy if it doesn't exist
      external: [],
    },
  },
})

