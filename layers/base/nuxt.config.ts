export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
  ],
  $meta: {
    name: '@cruxt/base',
  },
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
    typescriptBundlerResolution: true,
  },
  compatibilityDate: '2025-09-21',
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
    },
  },
})
