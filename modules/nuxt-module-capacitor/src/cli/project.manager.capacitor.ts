import type { CapacitorConfig } from '@capacitor/cli'
import { existsSync, rmdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { CapacitorModuleOptions } from '../module'

export function setup_capacitor_config(capacitor_config_destination_path: string, capacitor_config: CapacitorConfig) {
  try {
    const capacitor_config_raw_content = `
    import type { CapacitorConfig } from '@capacitor/cli'

    const capacitor_config: CapacitorConfig = ${JSON.stringify(capacitor_config, null, 2)}
    export default capacitor_config
  `

    writeFileSync(capacitor_config_destination_path, capacitor_config_raw_content)
  }
  catch (error) {
    throw new Error(`Error while writing capacitor.config.ts file: ${capacitor_config_destination_path}`, { cause: error })
  }
}

export function cleanup_platform_dirs(working_directory: string, removed_platforms: Required<CapacitorModuleOptions>['platforms']) {
  try {
    for (const platform of removed_platforms) {
      const platform_dir = join(working_directory, platform)
      if (!existsSync(platform_dir)) continue

      console.log(`Removing platform directory: ${platform_dir}`)
      rmdirSync(platform_dir, { recursive: true })
    }
  }
  catch (error) {
    throw new Error(`Error while removing platform directories: ${removed_platforms.join(', ')}`, { cause: error })
  }
}
