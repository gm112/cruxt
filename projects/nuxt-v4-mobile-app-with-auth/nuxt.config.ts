// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@cruxt/auth'],
  modules: ['@cruxt/nuxt-module-capacitor'],

  // typescript: {
  //   typeCheck: true,
  // },
  cruxt_nuxt_module_capacitor: {},

  devtools: {
    timeline: {
      enabled: true,
    },
  },
})