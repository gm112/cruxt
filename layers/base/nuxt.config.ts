export default defineNuxtConfig({
  $meta: {
    name: '@cruxt/base'
  },
  modules: [
    "@nuxt/eslint",
  ],
  devtools: { enabled: true },
  compatibilityDate: '2025-09-21',
  future: {
    compatibilityVersion: 4,
    typescriptBundlerResolution: true,
  },
  nitro: {
    experimental: {
      wasm: true,
      tasks: true,
      asyncContext: true,
      database: true,
    },
  },
  typescript: {
    includeWorkspace: true,
    // typeCheck: true,
    strict: true,
    tsConfig: {
      compilerOptions: {
        noUncheckedIndexedAccess: true,
        composite: true,
        incremental: true,
      },
      exclude: ['**/ios/**', '**/android/**', '**/windows/**', '**/dist/**'],
    },
  },
  eslint: {
    config: {
      stylistic: true,
    }
  }
})
