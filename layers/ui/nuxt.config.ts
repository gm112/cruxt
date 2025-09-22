export default defineNuxtConfig({
  $meta: {
    name: '@cruxt/ui'
  },
  extends: ['@cruxt/base'],
  modules: [
    "@nuxt/ui",
    "@nuxtjs/i18n"
  ],
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
    ],
    experimental: {
      strictSeo: false,
      typedOptionsAndMessages: 'all',
      typedPages: true,
    }
  }
})
