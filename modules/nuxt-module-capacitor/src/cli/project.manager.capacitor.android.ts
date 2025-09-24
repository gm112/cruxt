import type { CapacitorModuleOptions } from '../module.js'

interface handle_android_options {
  module_options: Required<Pick<CapacitorModuleOptions, 'capacitor'>>
  package_json: Record<string, unknown>
}

export function handle_android(_working_directory: string, _options: handle_android_options) {
}
