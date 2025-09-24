import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'

// Module options TypeScript interface definition
export type ModuleOptions = Record<string, string>

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@cruxt/nuxt-module-template-project',
    configKey: 'cruxt_nuxt_module_template_project', // TODO: Change this to your module name
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))
  },
})
