export type plist_parser_error_types = 'unsupported_value_type' | 'unsupported_tag' | 'invalid_xml' | 'info_plist_not_found'
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

/**
 * Deserialize plist XML to JS object
 * @param xml - plist XML string
 * @returns JS object representation of plist XML
 */
export function deserialize_json_to_plist(xml: string): plist_value {
  const [_, match] = xml.match(/<plist[^>]*>([\s\S]*?)<\/plist>/) ?? []
  if (!match) throw new Error('invalid_xml' as plist_parser_error_types, { cause: { xml, match } })
  return parse_xml_part(match.trim()) satisfies plist_value
}

function serialize_plist(value: plist_value, depth = 0): string {
  const indent = '\t'.repeat(depth)
  if (typeof value === 'string')
    return `${indent}<string>${escape_xml(value)}</string>`
  else if (typeof value === 'boolean')
    return `${indent}${value ? '<true/>' : '<false/>'}`

  if (Array.isArray(value)) {
    if (value.length === 0) return `${indent}<array/>`
    const items = value.map((plist_item_value) => {
      if (plist_item_value === undefined || plist_item_value === null)
        throw new Error('unsupported_value_type' as plist_parser_error_types, {
          cause: { value: plist_item_value, reason: 'undefined or null in array' },
        })

      return serialize_plist(plist_item_value, depth + 1)
    }).join('\n')
    return `${indent}<array>\n${items}\n${indent}</array>`
  }

  if (typeof value !== 'object' || value === null || value === undefined)
    throw new Error('unsupported_value_type' as plist_parser_error_types, {
      cause: { value, depth, type: typeof value },
    })

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

function parse_xml_part(xml_string: string): plist_value {
  const xml = xml_string.trim()

  if (xml === '<true/>' || xml === '<false/>') return xml === '<true/>'
  if (xml === '<array/>') return []
  if (xml === '<dict/>') return {}

  const match = xml.match(/^<(dict|array|string)>([\s\S]*?)<\/\1>$/)
  if (!match)
    throw new Error('invalid_xml' as plist_parser_error_types, {
      cause: { xml_string },
    })

  const [, tag, value_content] = match
  const content = value_content ?? ''
  if (tag === 'string') return unescape_xml(content)
  if (tag === 'dict') return parse_plist_dict(content)
  return parse_plist_array(content)
}

function parse_plist_dict(xml: string) {
  const result: Record<string, plist_value> = {}
  const parts: string[] = xml.split(/<key>([\s\S]*?)<\/key>/)?.slice(1) ?? []

  for (let index = 0; index + 1 < parts.length; index += 2) {
    const [key_part, value_part] = parts.slice(index, index + 2)
    const value_xml = value_part?.trim()
    if (typeof key_part !== 'string' || !value_xml) continue
    result[unescape_xml(key_part)] = parse_xml_part(value_xml)
  }

  return result
}

function parse_plist_array(xml: string) {
  const result: plist_value[] = []
  let remaining = xml.trim()
  while (remaining) {
    const xml_part_length = remaining.length
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
    if (!element_match) throw new Error('unsupported_tag' as plist_parser_error_types, { cause: { xml, remaining } })

    result.push(parse_xml_part(element_match[0]))
    remaining = remaining.slice(element_match[0].length).trim()
    // sanity check: ensure we made progress
    if (remaining.length === xml_part_length)
      throw new Error('parse_plist_array: infinite loop detected', { cause: { remaining } })
  }

  return result
}

function escape_xml(raw_string: string) {
  return raw_string.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&apos;' }[character]!))
}

function unescape_xml(xml_string: string) {
  return xml_string.replace(/&(amp|lt|gt|quot|apos);/g, (_, entity: string) =>
    ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: '\'' }[entity]!),
  )
}
