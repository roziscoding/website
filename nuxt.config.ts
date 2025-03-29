export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://unpkg.com/nes.css/css/nes.css',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Press+Start+2P',
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      pushBaseUrl: process.env.PUSH_BASE_URL,
    },
  },
  modules: ['@nuxtjs/tailwindcss', '@vite-pwa/nuxt'],
  pwa: {
    srcDir: 'public',
    filename: 'sw.ts',
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
})
