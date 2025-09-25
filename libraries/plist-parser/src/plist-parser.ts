/**
 * @module plist_parser
 * @license MPL-2.0
 * @author Jonathan Basniak
 * @see {serialize_xml_to_plist_object}
 * @see {deserialize_plist_xml_to_plist_object}
 * @link https://code.google.com/archive/p/networkpx/wikis/PlistSpec.wiki
 * @description A single-file zero dependency parser for serializing and deserializing Apple Info.plist files. Supprts only XML formatted plists.
 * Only supports plists with a single root element, that contain only string, number, boolean, array(also nested), and dictionary(also nested) values.
 * Attempts to conform to Apple's formatting and specifications for plists in the parts of the spec that are supported.
 *
 * Notes for things that are not supported:
 * - Does not care about UTF-16 encoding support. Untested, but might work fine.
 * - Large files probably won't work due to the use of using regex to extract the <plist> data. Changing deserialization to use a streaming parser would address this if it is an issue.
 * - Comments are ignored and will no-op/be removed when serializing.
 * - Binary data is ignored, and is untested.
 * - Dates are ignored, and is untested. At the moment I believe it would resolve to a regular string.
 * - All unknown key dictionaries are not supported, and may be treated as a regular JSON object, which may mess up the structure of the plist.
 */

/**
 * Error types that plist_parser can throw.
 */
export type plist_parser_error_types = 'unsupported_value_type' | 'unsupported_tag' | 'invalid_xml' | 'info_plist_not_found' | 'infinite_loop'
export type plist_value = string | number | boolean | plist_value[] | { [key: string]: plist_value }

/**
 * Serialize JS object to plist XML
 * @param jason - JS object to serialize
 * @returns plist XML string
 */
export function serialize_xml_to_plist_object(jason: plist_value): string {
  if (typeof jason !== 'object' || jason === null || jason === undefined)
    throw new Error('unsupported_value_type' as plist_parser_error_types, {
      cause: { value: jason, type: typeof jason },
    })

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
    '<plist version="1.0">',
    serialize_json_to_plist_item_xml(jason, 0),
    '</plist>',
  ].join('\n')
}

const plist_parser_xml_regex = /<plist[^>]*>([\s\S]*?)<\/plist>/
const plist_comment_block_regex = /<!--[\s\S]*?-->/g
/**
 * Deserialize plist XML to JS object
 * @param xml - plist XML string
 * @returns JS object representation of plist XML
 */
export function deserialize_plist_xml_to_plist_object(xml: string): plist_value {
  const [,match] = xml.match(plist_parser_xml_regex) ?? []
  if (!match) throw new Error('invalid_xml' as plist_parser_error_types, { cause: { xml } })

  return deserialize_xml_fragment_to_plist_value_object(
    (plist_comment_block_regex.test(match)
      ? match.replaceAll(plist_comment_block_regex, '')
      : match
    ).trim(),
  ) satisfies plist_value
}

/* Serialization */
function serialize_json_to_plist_item_xml(value: plist_value, depth = 0): string {
  const indent = '\t'.repeat(depth)
  switch (typeof value) {
    case 'string': return serialize_string(value, indent)
    case 'boolean': return serialize_boolean(value, indent)
    case 'number':
      if (!Number.isSafeInteger(value)) break
      return serialize_number(value, indent)
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
  return `${indent}<integer>${value}</integer>`
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

      return serialize_json_to_plist_item_xml(plist_item_value, depth + 1)
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

        return `${indent}\t<key>${escape_xml(key)}</key>\n${serialize_json_to_plist_item_xml(plist_item_value, depth + 1)}`
      })
      .join('\n')
  }\n${indent}</dict>`
}

/* Deserialization */
const plist_parser_regex = /<(dict|array|string|integer)>([\s\S]*?)<\/\1>/
function naive_ends_with_closing_tag(xml_fragment: string, _element_name: string) {
  const open = xml_fragment.lastIndexOf('<')
  return open !== -1 && xml_fragment[open + 1] === '/' && xml_fragment[xml_fragment.length - 1] === '>'
}

function deserialize_xml_fragment_to_plist_value_object(xml_fragment: string): plist_value {
  if (xml_fragment === '<true/>' || xml_fragment === '<false/>') return xml_fragment === '<true/>'
  else if (xml_fragment === '<array/>') return []
  else if (xml_fragment === '<dict/>') return {}
  else if (!naive_ends_with_closing_tag(xml_fragment, '')) throw new Error('invalid_xml' as plist_parser_error_types, { cause: { xml: xml_fragment } })

  const match = xml_fragment.match(plist_parser_regex)
  if (!match)
    throw new Error('invalid_xml' as plist_parser_error_types, {
      cause: { xml: xml_fragment },
    })
  const [, tag, content] = match

  if (tag === 'string') return unescape_xml(content!)
  else if (tag === 'dict') return deserialize_plist_dict_to_object(content!)
  else if (tag === 'array') return deserialize_plist_array_to_object(content!)
  else if (tag === 'true' || tag === 'false') return tag === 'true'
  else if (tag === 'integer') {
    const number_value = Number(content!)
    if (Number.isSafeInteger(number_value))
      return parseInt(content!) // Reals probably could be supported if we added a check for if the value is a fixed int or not.
  }

  throw new Error('invalid_xml' as plist_parser_error_types, {
    cause: { xml: xml_fragment },
  })
}

const plist_key_element_regex = /<key>([\s\S]*?)<\/key>/
function deserialize_plist_dict_to_object(xml_fragment: string) {
  const result: Record<string, plist_value> = {}
  const parts = xml_fragment.split(plist_key_element_regex)

  // Starting the loop at 1 because we do not want to look at the first element.
  for (let index = 1; index + 1 < parts.length; index += 2) {
    const key_part = parts[index]
    if (typeof key_part !== 'string' || result[key_part] !== undefined)
      throw new Error('invalid_xml' as plist_parser_error_types, { cause: { xml: xml_fragment, key_part, value_part: parts[index + 1] } })

    const value_part = parts[index + 1]
    const value_xml = value_part?.trim()

    if (!value_xml) throw new Error('invalid_xml' as plist_parser_error_types, { cause: { xml: xml_fragment, key_part, value_part } })
    result[key_part] = deserialize_xml_fragment_to_plist_value_object(value_xml)
  }

  return result
}

function deserialize_plist_array_to_object(xml_fragment: string) {
  const result: plist_value[] = []
  let remaining = xml_fragment.trim()

  while (remaining) {
    const xml_part_length = remaining.length
    const [item] = remaining.match(plist_parser_regex) ?? []
    if (!item) throw new Error('unsupported_tag' as plist_parser_error_types, { cause: { xml: xml_fragment, remaining } })

    result.push(deserialize_xml_fragment_to_plist_value_object(item))
    remaining = remaining.substring(item.length).trim()
    // sanity check: ensure we made progress
    if (remaining.length === xml_part_length)
      throw new Error('infinite_loop' as plist_parser_error_types, { cause: { remaining_length: remaining.length, xml_length: xml_part_length, remaining, xml: xml_fragment } })
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
