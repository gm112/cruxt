// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@cruxt/auth'],

  devtools: {
    timeline: {
      enabled: true,
    },
  },

  // typescript: {
  //   typeCheck: true,
  // },
})
