// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@cruxt/auth'],
  i18n: {
    experimental: {
      strictSeo: true,
    },
  },
  // typescript: {
  //   typeCheck: true,
  // },
})
