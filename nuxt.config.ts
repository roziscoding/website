export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://unpkg.com/nes.css@2.3.0/css/nes.css',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Press+Start+2P',
        },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, user-scalable=no' },
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
    injectRegister: false,
    manifest: false,
    registerType: 'autoUpdate',
    injectManifest: {
      injectionPoint: undefined,
    },
    devOptions: {
      enabled: true,
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
