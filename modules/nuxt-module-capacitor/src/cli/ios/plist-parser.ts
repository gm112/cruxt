/**
 * plist_parser
 * A parser for serializing and deserializing Apple Info.plist files.
 * @license MPL-2.0
 * @author Jonathan Basniak
 * @see {serialize_json_to_plist}
 * @see {deserialize_json_to_plist}
 */

export type plist_parser_error_types = 'unsupported_value_type' | 'unsupported_tag' | 'invalid_xml' | 'info_plist_not_found' | 'infinite_loop'
export type plist_value = string | boolean | plist_value[] | { [key: string]: plist_value }

/**
 * Serialize JS object to plist XML
 * @param json - JS object to serialize
 * @returns plist XML string
 */
export function serialize_json_to_plist(json: plist_value) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
    '<plist version="1.0">',
    serialize_plist(json, 0),
    '</plist>',
  ].join('\n')
}

const plist_parser_xml_regex = /<plist[^>]*>([\s\S]*?)<\/plist>/
/**
 * Deserialize plist XML to JS object
 * @param xml - plist XML string
 * @returns JS object representation of plist XML
 */
export function deserialize_json_to_plist(xml: string): plist_value {
  const [,match] = xml.match(plist_parser_xml_regex) ?? []
  if (!match) throw new Error('invalid_xml' as plist_parser_error_types, { cause: { xml } })
  return deserialize_xml_part_to_key_value(match.trim()) satisfies plist_value
}

/* Serialization */

function serialize_plist(value: plist_value, depth = 0): string {
  const indent = '\t'.repeat(depth)
  if (typeof value === 'string') return serialize_string(value, indent)
  else if (typeof value === 'boolean') return serialize_boolean(value, indent)
  else if (Array.isArray(value)) return serialize_array(value, indent, depth)
  else if (typeof value !== 'object' || value === null || value === undefined)
    throw new Error('unsupported_value_type' as plist_parser_error_types, {
      cause: { value, depth, type: typeof value },
    })

  return serialize_object(value as Record<string, plist_value>, indent, depth)
}

function serialize_string(value: string, indent: string) {
  return `${indent}<string>${escape_xml(value)}</string>`
}

function serialize_boolean(value: boolean, indent: string) {
  return `${indent}${value ? '<true/>' : '<false/>'}`
}

function serialize_array(value: plist_value[], indent: string, depth: number) {
  if (value.length === 0) return `${indent}<array/>`
  return `${indent}<array>\n${
    value.map((plist_item_value) => {
      if (plist_item_value === undefined || plist_item_value === null)
        throw new Error('unsupported_value_type' as plist_parser_error_types, {
          cause: { value: plist_item_value, reason: 'undefined or null in array' },
        })

      return serialize_plist(plist_item_value, depth + 1)
    }).join('\n')
  }\n${indent}</array>`
}

function serialize_object(value: Record<string, plist_value>, indent: string, depth: number) {
  const keys = Object.keys(value)
  if (keys.length === 0) return `${indent}<dict/>`

  return `${indent}<dict>\n${
    keys
      .map((key) => {
        const plist_item_value = (value as Record<string, plist_value>)[key]
        if (plist_item_value === undefined || plist_item_value === null)
          throw new Error('unsupported_value_type' as plist_parser_error_types, {
            cause: { key, value: plist_item_value, reason: 'undefined or null in dict' },
          })

        return `${indent}\t<key>${escape_xml(key)}</key>\n${serialize_plist(plist_item_value, depth + 1)}`
      })
      .join('\n')
  }\n${indent}</dict>`
}

/* Deserialization */

const plist_parser_regex = /<(dict|array|string)>([\s\S]*?)<\/\1>/
function deserialize_xml_part_to_key_value(xml_string: string): plist_value {
  const xml = xml_string.trim()
  if (xml === '<true/>' || xml === '<false/>') return xml === '<true/>'
  else if (xml === '<array/>') return []
  else if (xml === '<dict/>') return {}

  const match = xml.match(plist_parser_regex)
  if (!match)
    throw new Error('invalid_xml' as plist_parser_error_types, {
      cause: { xml_string },
    })

  const [, tag, content] = match
  if (!xml_string.endsWith(`</${tag}>`)) throw new Error('invalid_xml' as plist_parser_error_types, { cause: { xml_string } })
  if (tag === 'string') return unescape_xml(content!)
  else if (tag === 'dict') return parse_plist_dict(content!)
  else if (tag === 'array') return parse_plist_array(content!)
  throw new Error('invalid_xml' as plist_parser_error_types, {
    cause: { xml_string },
  })
}

const plist_parser_dict_regex = /<key>([\s\S]*?)<\/key>/
function parse_plist_dict(xml: string) {
  const result: Record<string, plist_value> = {}
  const parts = xml.split(plist_parser_dict_regex)?.slice(1)

  for (let index = 0; index + 1 < parts.length; index += 2) {
    const [key_part, value_part] = parts.slice(index, index + 2)
    const value_xml = value_part?.trim()
    if (typeof key_part !== 'string' || !value_xml) throw new Error('invalid_xml' as plist_parser_error_types, { cause: { xml, key_part, value_part } })
    result[unescape_xml(key_part)] = deserialize_xml_part_to_key_value(value_xml)
  }

  return result
}

const plist_parser_array_self_closing_tag_regex = /<(dict|array|string|true|false)\/>/
const plist_parser_array_item_regex = /^<(dict|array|string)>([\s\S]*?)<\/\1>/
function parse_plist_array(xml: string) {
  const result: plist_value[] = []
  let remaining = xml.trim()
  while (remaining) {
    const xml_part_length = remaining.length
    const self_closing_match = plist_parser_array_self_closing_tag_regex.test(remaining) ? remaining.match(plist_parser_array_self_closing_tag_regex) : undefined
    if (self_closing_match && self_closing_match.length >= 2) {
      const tag = self_closing_match[1]
      if (tag === 'array') result.push([])
      else if (tag === 'dict') result.push({})

      remaining = remaining.slice(self_closing_match[0].length).trim()
      continue
    }

    if (!plist_parser_array_item_regex.test(remaining))
      throw new Error('unsupported_tag' as plist_parser_error_types, { cause: { xml, remaining } })

    const [item] = remaining.match(plist_parser_array_item_regex)! // arrays only support strings, dicts, and arrays.
    result.push(deserialize_xml_part_to_key_value(item))
    remaining = remaining.slice(item.length).trim()
    // sanity check: ensure we made progress
    if (remaining.length === xml_part_length)
      throw new Error('infinite_loop' as plist_parser_error_types, { cause: { remaining_length: remaining.length, xml_length: xml_part_length, remaining, xml } })
  }

  return result
}

/* Utilities */

const plist_parser_escape_xml_regex = /[&<>"']/g
const escape_xml_lookup = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&apos;' } as Record<string, string>
function escape_xml(raw_string: string) {
  return plist_parser_escape_xml_regex.test(raw_string)
    ? raw_string.replaceAll(plist_parser_escape_xml_regex, character => (escape_xml_lookup[character]!))
    : raw_string
}

const plist_parser_unescape_xml_regex = /&(amp|lt|gt|quot|apos);/g
const unescape_xml_lookup = { amp: '&', lt: '<', gt: '>', quot: '"', apos: '\'' } as Record<string, string>
function unescape_xml(xml_string: string) {
  return plist_parser_unescape_xml_regex.test(xml_string)
    ? xml_string.replaceAll(plist_parser_unescape_xml_regex, (_, entity: string) =>
        (unescape_xml_lookup[entity]!),
      )
    : xml_string
}
