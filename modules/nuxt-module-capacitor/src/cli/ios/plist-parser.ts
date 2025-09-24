import { readFileSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'

export type error_types = 'unsupported_value_type' | 'unsupported_tag' | 'invalid_xml' | 'info_plist_not_found'
export type plist_value = string | boolean | plist_value[] | { [key: string]: plist_value }
/**
 *  Read Info.plist file and parse it to a JS object
 *
 * @param info_plist_path - Path to Info.plist file
 * @returns JS object representation of Info.plist file
 *
 */
export function read_info_plist_to_object(info_plist_path: string): Record<string, plist_value> {
  const file_path = resolve(join(info_plist_path))
  if (!existsSync(file_path)) throw new Error('info_plist_not_found' as error_types, { cause: file_path })
  return parse_plist(readFileSync(file_path, 'utf8')) as Record<string, plist_value>
}

/**
 * Serialize JS object to plist XML
 * @param json - JS object to serialize
 * @returns plist XML string
 */
export function json_to_plist(json: plist_value) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
    '<plist version="1.0">',
    serialize(json, 0),
    '</plist>',
  ].join('\n')
}

function serialize(value: plist_value, depth = 0): string {
  const indent = '\t'.repeat(depth)
  if (typeof value === 'string') return `${indent}<string>${escape_xml(value)}</string>`
  if (typeof value === 'boolean') return `${indent}${value ? '<true/>' : '<false/>'}`
  if (Array.isArray(value))
    return !value.length
      ? `${indent}<array/>`
      : `${indent}<array>\n${value.map(v => serialize(v, depth + 1)).join('\n')}\n${indent}</array>`
  if (typeof value !== 'object' || value === undefined || value === null)
    throw new Error('unsupported_value_type' as error_types, { cause: { value, depth, type: typeof value } })

  const keys = Object.keys(value)
  return (!keys.length)
    ? `${indent}<dict/>`
    : `${indent}<dict>\n${keys
      .map(key => `${indent}\t<key>${escape_xml(key)}</key>\n${serialize((value as Record<string, plist_value>)[key]!, depth + 1)}`)
      .join('\n')}\n${indent}</dict>`
}

function escape_xml(raw_string: string) {
  return raw_string.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&apos;' }[character]!))
}

function unescape_xml(xml_string: string) {
  return xml_string.replace(/&(amp|lt|gt|quot|apos);/g, (_, entity: string) =>
    ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: '\'' }[entity]!),
  )
}

function parse_plist(xml: string): plist_value {
  const [_, match] = xml.match(/<plist[^>]*>([\s\S]*?)<\/plist>/) ?? []
  if (!match) throw new Error('Invalid plist XML', { cause: { xml, match } })
  return parse_value(match.trim())
}

function parse_value(xml_string: string): plist_value {
  const xml = xml_string.trim()
  if (xml === '<true/>' || xml === '<false/>') return xml === '<true/>'
  else if (xml === '<array/>') return []
  else if (xml === '<dict/>') return {}

  const [_, tag, value_content] = xml.match(/^<(dict|array|string)>([\s\S]*?)<\/\1>$/) ?? []
  const content: 'dict' | 'array' | 'string' | undefined = value_content as 'dict' | 'array' | 'string'
  if (tag === 'string') return unescape_xml(content)
  return tag === 'dict' ? parse_dict(content) : parse_array(content)
}

function parse_dict(xml: string): { [key: string]: plist_value } {
  const result: { [key: string]: plist_value } = {}
  const parts: string[] = xml.split(/<key>([\s\S]*?)<\/key>/)?.slice(1) ?? []

  for (let index = 0; index + 1 < parts.length; index += 2) {
    const [key_part, value_part] = parts.slice(index, index + 2)
    if (typeof key_part !== 'string' || typeof value_part !== 'string') continue

    const key = unescape_xml(key_part)
    const value_xml = value_part.trim()
    if (value_xml) result[key] = parse_value(value_xml)
  }

  return result
}

function parse_array(xml: string): plist_value[] {
  const result: plist_value[] = []
  let remaining = xml.trim()
  while (remaining) {
    const self_closing_match = remaining.match(/^<(true|false|array|dict)\/>/)
    if (self_closing_match) {
      const tag = self_closing_match[1]
      if (tag === 'true' || tag === 'false') result.push(tag === 'true')
      else if (tag === 'array') result.push([])
      else if (tag === 'dict') result.push({})
      else throw new Error('unsupported_tag', { cause: { tag, xml, self_closing_match } })

      remaining = remaining.slice(self_closing_match[0].length).trim()
      continue
    }

    const element_match = remaining.match(/^<(dict|array|string)>([\s\S]*?)<\/\1>/)
    if (!element_match) break

    result.push(parse_value(element_match[0]))
    remaining = remaining.slice(element_match[0].length).trim()
  }
  return result
}
