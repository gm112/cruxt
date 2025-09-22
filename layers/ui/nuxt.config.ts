export default defineNuxtConfig({
  extends: ['@cruxt/base'],
  modules: [
    '@nuxt/ui',
    '@nuxtjs/i18n',
  ],
  $meta: {
    name: '@cruxt/ui',
  },
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
    ],
    experimental: {
      strictSeo: false,
      typedOptionsAndMessages: 'all',
      typedPages: true,
    },
  },
})
