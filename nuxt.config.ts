// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    '@formkit/auto-animate/nuxt',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui-pro',
    'nuxt-og-image',
    'nuxt-security',
    'nuxt-site-config',
  ],

  devtools: { enabled: true },

  app: {
    head: {
      htmlAttrs: {
        lang: 'ja',
        prefix: 'og: https://ogp.me/ns#',
        class: 'min-h-screen',
      },
      bodyAttrs: {
        class: 'min-h-screen',
      },
      title: '工作オンエア ジェネレータ',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
    },
    rootAttrs: {
      class: 'min-h-full',
    },
  },

  css: ['~/assets/css/main.css'],

  ui: {
    colorMode: false,
  },

  compatibilityDate: '2025-03-21',

  eslint: {
    config: {
      stylistic: {
        semi: true,
        quotes: 'single',
        commaDangle: 'always-multiline',
      },
    },
  },

  ogImage: {
    fonts: ['BIZ UDPGothic:400'],
  },

  security: {
    headers: {
      contentSecurityPolicy: {
        'img-src': ['\'self\'', 'data:', 'blob:'],
      },
    },
  },
});
