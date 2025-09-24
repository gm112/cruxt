import { existsSync, writeFileSync } from 'node:fs'
import { json_to_plist, read_info_plist_to_object, type plist_value } from './ios/plist-parser.js'
import { join } from 'node:path'
import type { CapacitorModuleOptions } from '../module.js'

interface handle_ios_options {
  module_options: Required<Pick<CapacitorModuleOptions, 'capacitor'>>
  package_json: Record<string, unknown>
}

export function handle_ios(working_directory: string, options: handle_ios_options) {
  const { capacitor } = options.module_options
  const { package_json } = options
  const ios_dir = join(working_directory, 'ios')
  if (!existsSync(ios_dir)) return
  const plist_path = join(ios_dir, 'Info.plist')
  if (!existsSync(plist_path)) return

  const plist = read_info_plist_to_object(plist_path)
  if (!plist) return

  // Set the app name
  plist['CFBundleDisplayName'] = capacitor.appName!
  plist['CFBundleName'] = capacitor.appName!

  // Set the app version
  plist['CFBundleShortVersionString'] = package_json.version as string
  plist['CFBundleVersion'] = package_json.build_id as string

  console.log('Updating Info.plist...')
  write_plist_to_file(plist, plist_path)
}

/**
 * Write JS object to Info.plist file
 * @param json - JS object to write
 * @param output_path - Path to write Info.plist file
 */
function write_plist_to_file(json: plist_value, output_path: string): void {
  writeFileSync(output_path, json_to_plist(json), 'utf8')
}
