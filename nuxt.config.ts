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
        {
          rel: 'icon',
          href: '/favicon.ico',
        },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width,initial-scale=1' },
        { name: 'description', content: 'Rogério Munhoz' },
        { name: 'theme-color', content: '#212529' },
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
    '@nuxtjs/device',
  ],
  ogImage: {
    fonts: ['Press+Start+2P'],
  },
  experimental: {
    emitRouteChunkError: false,
  },
})
