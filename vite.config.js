import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        sourcemap: true,
        clientsClaim: true,
        skipWaiting: true
      },
      manifest: {
        "name": "Gboard",
        "categories": [
          "utilities",
          "education",
          "write",
          "notes",
          "board"
        ],
        "short_name": "Gboard",
        "description": "Fast, functional and simple plain text editor",
        "theme_color": "#111418",
        "background_color": "#400b2c",
        "display_override": [
          "standalone",
          "fullscreen"
        ],
        "display": "standalone",
        "orientation": "any",
        "scope": "/",
        "start_url": "/",
        "icons": [
          {
            "src": "android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
          },
          {
            "src": "favicon-16x16.png",
            "sizes": "16x16",
            "type": "image/png"
          },
          {
            "src": "favicon-32x32.png",
            "sizes": "32x32",
            "type": "image/png"
          },
          {
            "src": "mstile-70x70.png",
            "sizes": "70x70",
            "type": "image/png"
          },
          {
            "src": "mstile-144x144.png",
            "sizes": "144x144",
            "type": "image/png"
          },
          {
            "src": "mstile-150x150.png",
            "sizes": "150x150",
            "type": "image/png"
          },
          {
            "src": "mstile-310x150.png",
            "sizes": "310x150",
            "type": "image/png"
          },
          {
            "src": "mstile-310x310.png",
            "sizes": "310x310",
            "type": "image/png"
          },
          {
            "src": "android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any maskable"
          }
        ],
        "lang": "en-US",
        "prefer_related_application": false
      },
      devOptions: {
        enabled: true
      }
    })],
})
