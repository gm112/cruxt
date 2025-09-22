// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@cruxt/auth'],
  modules: ['@cruxt/nuxt-module-capacitor'],
  cruxt_nuxt_module_capacitor: {},
  i18n: {
    experimental: {
      strictSeo: true,
    },
  },
  // typescript: {
  //   typeCheck: true,
  // },
})
