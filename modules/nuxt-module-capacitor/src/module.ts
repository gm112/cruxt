import { join } from 'node:path'
import { existsSync } from 'node:fs'
import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'
import type { CapacitorConfig } from '@capacitor/cli'
import { cleanup_platform_dirs, setup_capacitor_config } from './cli/project.manager.capacitor.js'
import { read_package_json, try_installing_npm_package } from './cli/project.manager.package-json.js'

// Module options TypeScript interface definition
export type CapacitorModuleOptions = {
  capacitor?: CapacitorConfig
  platforms?: ('android' | 'ios')[]
  features?: ('geolocation' | 'push-notifications' | 'google-maps' | 'apple-pay' | 'google-pay')[]
  experimental?: {
    /*
     * If true, the plugin will automatically remove the platform directories after the build.
    */
    auto_remove_platform_dirs?: boolean
  }
}

const defaults: Required<Pick<CapacitorModuleOptions, 'platforms'>> = {
  platforms: ['android', 'ios'],
}

export default defineNuxtModule<CapacitorModuleOptions>({
  meta: {
    name: '@cruxt/nuxt-module-capacitor',
    configKey: 'cruxt_nuxt_module_capacitor',
  },
  // Default configuration options of the Nuxt module
  defaults,
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    const package_json = read_package_json(nuxt.options.rootDir)
    const resolved_package_manager = package_json.packageManager?.split('@')?.[0] ?? undefined
    if (!resolved_package_manager)
      throw new Error('packageManager not found in package.json. Please configure packageManager in package.json.')

    const required_npm_packages = [
      '@capacitor/cli',
      '@capacitor/core',
    ]

    const requested_platforms = new Set([
      ...(options.platforms?.filter(platform => platform === 'android' || platform === 'ios') ? options.platforms : defaults.platforms),
    ])

    for (const platform of requested_platforms)
      required_npm_packages.push(`@capacitor/${platform}`)

    const removed_platforms: Required<CapacitorModuleOptions>['platforms'] = []

    for (const platform of requested_platforms) {
      if (!required_npm_packages.includes(`@capacitor/${platform}`))
        removed_platforms.push(platform)
    }

    const missing_npm_packages = [
      ...(package_json.dependencies ?? []),
      ...(package_json.devDependencies ?? []),
    ].filter(package_name => !required_npm_packages.includes(package_name))

    const packages_to_install = missing_npm_packages.join(' ')
    if (missing_npm_packages.length > 0) {
      console.log(`Installing required npm packages: ${packages_to_install}`)
      try_installing_npm_package(nuxt.options.rootDir, packages_to_install, resolved_package_manager)
    }

    const capacitor_packages_to_remove = removed_platforms.map(platform => `@capacitor/${platform}`).join(' ')
    if (removed_platforms.length > 0) {
      console.log(`Removing capacitor packages: ${capacitor_packages_to_remove}`)
      try_installing_npm_package(nuxt.options.rootDir, capacitor_packages_to_remove, resolved_package_manager)
      if (options.experimental?.auto_remove_platform_dirs)
        cleanup_platform_dirs(nuxt.options.rootDir, removed_platforms)
    }

    const capacitor_config_path = join(nuxt.options.rootDir, 'capacitor.config.ts')
    if (!existsSync(capacitor_config_path)) {
      console.log('No capacitor.config.ts found. Creating one...')
      setup_capacitor_config(capacitor_config_path, nuxt.options.cruxt_nuxt_module_capacitor?.capacitor ?? {
        appId: 'com.example.app',
        appName: 'Cruxt',
        webDir: '.output/public',
      })
    }

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))
  },
})
