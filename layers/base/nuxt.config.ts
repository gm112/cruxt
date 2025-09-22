import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'

const current_dir = dirname(fileURLToPath(import.meta.url))
const certs_exists = existsSync(join(current_dir, '../../shared/localhost/localhost.pem')) && existsSync(join(current_dir, '../../shared/localhost/localhost-key.pem'))
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
  ],
  $development: {
    sourcemap: true,
    devServer: {
      https: certs_exists
        ? {
            key: join(current_dir, '../../shared/localhost/localhost-key.pem'),
            cert: join(current_dir, '../../shared/localhost/localhost.pem'),
          }
        : undefined,
    },
  },
  $meta: {
    name: '@cruxt/base',
  },
  devtools: { enabled: true },
  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, viewport-fit=cover, user-scalable=no',
        },
        { name: 'color-scheme', content: 'light dark' },
        { name: 'msapplication-tap-highlight', content: 'no' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'mobile-web-app-capable', content: 'yes' },
      ],
    },
    viewTransition: true,
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    keepalive: {
      max: 4,
    },
  },
  sourcemap: false,
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
