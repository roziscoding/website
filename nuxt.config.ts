export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        {
          rel: 'manifest',
          href: '/manifest.webmanifest',
        },
        {
          rel: 'stylesheet',
          href: 'https://unpkg.com/nes.css@2.3.0/css/nes.css',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Press+Start+2P',
        },
        {
          rel: 'icon',
          href: '/favicon.ico',
        },
        {
          rel: 'apple-touch-icon',
          href: '/apple-touch-icon.png',
          sizes: '180x180',
        },
        {
          rel: 'mask-icon',
          href: '/mask-icon.svg',
          color: '#ffffff',
        },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width,initial-scale=1' },
        { name: 'description', content: 'Rogério Munhoz' },
        { name: 'theme-color', content: '#ffffff' },
      ],
    },
  },
  runtimeConfig: {
    public: {
      pushBaseUrl: process.env.PUSH_BASE_URL,
    },
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@vite-pwa/nuxt',
    'nuxt-og-image',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
  ],
  pwa: {
    srcDir: '.',
    filename: 'service-worker.ts',
    strategies: 'injectManifest',
    injectRegister: 'auto',
    registerType: 'autoUpdate',
    injectManifest: {
      injectionPoint: undefined,
    },
    devOptions: {
      enabled: true,
      type: 'module',
    },
    manifest: {
      id: 'roz.ninja',
      launch_handler: {
        client_mode: 'auto',
      },
      orientation: 'portrait',
      screenshots: [
        {
          src: '/screenshot_desktop.png',
          sizes: '3600x2008',
          type: 'image/png',
        },
      ],
      name: 'Updates do Roz',
      short_name: 'Updates',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa-maskable-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/pwa-maskable-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
      start_url: '/updates',
      display: 'standalone',
      background_color: '#212529',
      theme_color: '#212529',
      description: 'Updates sobre o estado de saúde do Roz',
    },
  },
  devServer: {
    https: {
      cert: './localhost.crt',
      key: './localhost.key',
    },
  },
  ogImage: {
    fonts: ['Press+Start+2P'],
  },
})
