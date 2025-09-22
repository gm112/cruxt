import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const current_dir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  extends: ['@cruxt/base'],
  modules: [
    '@nuxt/ui',
    '@nuxtjs/i18n',
  ],
  $meta: {
    name: '@cruxt/ui',
  },
  css: [join(current_dir, './app/assets/css/main.css')],
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en.json', language: 'en' },
    ],
    experimental: {
      strictSeo: false,
      typedOptionsAndMessages: 'all',
      typedPages: true,
    },
  },
})
