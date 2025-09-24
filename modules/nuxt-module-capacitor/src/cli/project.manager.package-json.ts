import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

type error_types = 'package_json_not_found' | 'package_manager_not_found'

export function read_package_json(nuxt_project_root_dir: string) {
  const package_json_path = join(nuxt_project_root_dir, 'package.json')
  if (!existsSync(package_json_path))
    throw new Error('package_json_not_found' as error_types, { cause: package_json_path })

  return JSON.parse(readFileSync(package_json_path, 'utf8'))
}

export function try_installing_npm_package(working_directory: string, package_name: string, package_manager: string) {
  try {
    spawnSync(package_manager, ['install', package_name], {
      cwd: working_directory,
      stdio: 'inherit',
      shell: true,
    })
    return true
  }
  catch {
    return false
  }
}
