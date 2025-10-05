import { describe, bench } from 'vitest'
import { deserialize_plist_xml_to_plist_object, serialize_plist_object_to_plist_xml } from './plist-parser.js'
import { test_info_plist_content, test_plist_as_json } from './plist-parser.test.js'

describe('serialize', () => {
  bench('serialize', () => {
    serialize_plist_object_to_plist_xml(test_plist_as_json)
  })
})

describe('deserialize', () => {
  bench('deserialize', () => {
    deserialize_plist_xml_to_plist_object(test_info_plist_content)
  })
})
