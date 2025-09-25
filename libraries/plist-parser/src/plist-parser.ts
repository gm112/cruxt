/**
 * plist_parser
 * A single-file zero dependency parser for serializing and deserializing Apple Info.plist files.
 * Only supports plists with a single root element, that contain
 * only string, number, boolean, array(also nested), and dictionary(also nested) values.
 * Everything else is not supported and will be ignored or throw an error.
 * @license MPL-2.0
 * @author Jonathan Basniak
 * @see {serialize_xml_to_plist_object}
 * @see {deserialize_plist_xml_to_plist_object}
 */

export type plist_parser_error_types = 'unsupported_value_type' | 'unsupported_tag' | 'invalid_xml' | 'info_plist_not_found' | 'infinite_loop'
export type plist_value = string | number | boolean | plist_value[] | { [key: string]: plist_value }

/**
 * Serialize JS object to plist XML
 * @param json - JS object to serialize
 * @returns plist XML string
 */
export function serialize_xml_to_plist_object(json: plist_value) {
  if (typeof json !== 'object' || json === null || json === undefined)
    throw new Error('unsupported_value_type' as plist_parser_error_types, {
      cause: { value: json, type: typeof json },
    })

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
    '<plist version="1.0">',
    serialize_plist_item(json, 0),
    '</plist>',
  ].join('\n')
}

const plist_parser_xml_regex = /<plist[^>]*>([\s\S]*?)<\/plist>/
/**
 * Deserialize plist XML to JS object
 * @param xml - plist XML string
 * @returns JS object representation of plist XML
 */
export function deserialize_plist_xml_to_plist_object(xml: string): plist_value {
  const [,match] = xml.match(plist_parser_xml_regex) ?? []
  if (!match) throw new Error('invalid_xml' as plist_parser_error_types, { cause: { xml } })
  return deserialize_xml_fragment_to_plist_value_object(match.trim()) satisfies plist_value
}

/* Serialization */
function serialize_plist_item(value: plist_value, depth = 0): string {
  const indent = '\t'.repeat(depth)
  switch (typeof value) {
    case 'string': return serialize_string(value, indent)
    case 'boolean': return serialize_boolean(value, indent)
    case 'number':
      if (!isNaN(value)) return serialize_number(value, indent)
      else break
    case 'object':
      if (Array.isArray(value)) return serialize_array(value, indent, depth)
      else if (value !== null && value !== undefined) return serialize_object(value as Record<string, plist_value>, indent, depth)
  }

  throw new Error('unsupported_value_type' as plist_parser_error_types, {
    cause: { value, depth, type: typeof value },
  })
}

function serialize_string(value: string, indent: string) {
  return `${indent}<string>${escape_xml(value)}</string>`
}

// Supporting real values is not supported by this parser, we only support numbers.
function serialize_number(value: number, indent: string) {
  return `${indent}<number>${value}</number>`
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

      return serialize_plist_item(plist_item_value, depth + 1)
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

        return `${indent}\t<key>${escape_xml(key)}</key>\n${serialize_plist_item(plist_item_value, depth + 1)}`
      })
      .join('\n')
  }\n${indent}</dict>`
}

/* Deserialization */
const plist_parser_regex = /<(dict|array|string|number)>([\s\S]*?)<\/\1>/
function deserialize_xml_fragment_to_plist_value_object(xml_fragment: string): plist_value {
  if (xml_fragment === '<true/>' || xml_fragment === '<false/>') return xml_fragment === '<true/>'
  else if (xml_fragment === '<array/>') return []
  else if (xml_fragment === '<dict/>') return {}

  const match = xml_fragment.match(plist_parser_regex)
  if (!match)
    throw new Error('invalid_xml' as plist_parser_error_types, {
      cause: { xml: xml_fragment },
    })

  const [, tag, content] = match
  if (!xml_fragment.endsWith(`</${tag}>`)) throw new Error('invalid_xml' as plist_parser_error_types, { cause: { xml: xml_fragment } })

  if (tag === 'string') return unescape_xml(content!)
  else if (tag === 'number') return parseFloat(content!)
  else if (tag === 'dict') return deserialize_plist_dict_to_object(content!)
  else if (tag === 'array') return deserialize_plist_array_to_object(content!)
  throw new Error('invalid_xml' as plist_parser_error_types, {
    cause: { xml: xml_fragment },
  })
}

const plist_key_element_regex = /<key>([\s\S]*?)<\/key>/
function deserialize_plist_dict_to_object(xml_fragment: string) {
  const result: Record<string, plist_value> = {}
  const parts = xml_fragment.split(plist_key_element_regex)?.slice(1)

  for (let index = 0; index + 1 < parts.length; index += 2) {
    const [key_part, value_part] = parts.slice(index, index + 2)
    const value_xml = value_part?.trim()
    if (typeof key_part !== 'string' || !value_xml) throw new Error('invalid_xml' as plist_parser_error_types, { cause: { xml: xml_fragment, key_part, value_part } })
    result[key_part] = deserialize_xml_fragment_to_plist_value_object(value_xml)
  }

  return result
}

const plist_parser_array_self_closing_tag_regex = /<(dict|array|string|true|false)\/>/
function deserialize_plist_array_to_object(xml_fragment: string) {
  const result: plist_value[] = []
  let remaining = xml_fragment.trim()

  while (remaining) {
    const xml_part_length = remaining.length
    const [content, tag] = plist_parser_array_self_closing_tag_regex.test(remaining) ? plist_parser_array_self_closing_tag_regex.exec(remaining)! : []
    if (content && tag) {
      if (tag === 'array') result.push([])
      else if (tag === 'dict') result.push({})

      remaining = remaining.slice(content.length).trim()
      continue
    }

    if (!plist_parser_regex.test(remaining))
      throw new Error('unsupported_tag' as plist_parser_error_types, { cause: { xml: xml_fragment, remaining } })

    const [item] = plist_parser_regex.exec(remaining)!// remaining.match(plist_parser_regex)! // arrays only support strings, dicts, and arrays.
    result.push(deserialize_xml_fragment_to_plist_value_object(item))
    remaining = remaining.slice(item.length).trim()
    // sanity check: ensure we made progress
    if (remaining.length === xml_part_length)
      throw new Error('infinite_loop' as plist_parser_error_types, { cause: { remaining_length: remaining.length, xml_length: xml_part_length, remaining, xml: xml_fragment } })
  }

  return result
}

/* Utilities */
const plist_parser_escape_xml_regex = /[&<>"']/
const escape_xml_lookup = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&apos;' } as Record<string, string>
function escape_xml(raw_string: string) {
  return plist_parser_escape_xml_regex.test(raw_string)
    ? raw_string.replaceAll(plist_parser_escape_xml_regex, character => (escape_xml_lookup[character]!))
    : raw_string
}

const plist_parser_unescape_xml_regex = /&(amp|lt|gt|quot|apos);/
const unescape_xml_lookup = { amp: '&', lt: '<', gt: '>', quot: '"', apos: '\'' } as Record<string, string>
function unescape_xml(xml_string: string) {
  return plist_parser_unescape_xml_regex.test(xml_string)
    ? xml_string.replaceAll(plist_parser_unescape_xml_regex, (_, entity: string) =>
        (unescape_xml_lookup[entity]!),
      )
    : xml_string
}
