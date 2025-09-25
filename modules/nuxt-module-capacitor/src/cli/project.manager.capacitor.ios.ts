import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { deserialize_plist_xml_to_plist_object, serialize_xml_to_plist_object, type plist_value } from '@cruxt/plist-parser'
import { join, resolve } from 'node:path'
import type { CapacitorModuleOptions } from '../module.js'

type module_error_types = 'info_plist_not_found'
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
  writeFileSync(output_path, serialize_xml_to_plist_object(json), 'utf8')
}

/**
 * Read Info.plist file and parse it to a JS object
 * @param info_plist_path - Path to Info.plist file
 * @returns JS object representation of Info.plist file
 *
 */
function read_info_plist_to_object(info_plist_path: string): Record<string, plist_value> {
  const file_path = resolve(join(info_plist_path))
  if (!existsSync(file_path)) throw new Error('info_plist_not_found' as module_error_types, { cause: file_path })
  return deserialize_plist_xml_to_plist_object(readFileSync(file_path, 'utf8')) as Record<string, plist_value>
}
