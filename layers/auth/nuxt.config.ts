export default defineNuxtConfig({
  extends: ['@cruxt/ui'],
  $meta: {
    name: '@cruxt/auth',
  },
  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
    ],
  },
})
