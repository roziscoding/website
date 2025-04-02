export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        {
          rel: 'manifest',
          href: '/manifest.json',
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
    injectManifest: {
      injectionPoint: undefined,
    },
    registerType: 'autoUpdate',
    devOptions: {
      enabled: true,
      type: 'module',
    },
    manifest: false,
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
