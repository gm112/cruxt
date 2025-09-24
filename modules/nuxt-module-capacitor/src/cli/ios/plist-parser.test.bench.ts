import { describe, bench } from 'vitest'
import { deserialize_json_to_plist, serialize_json_to_plist } from './plist-parser.js'
import { test_info_plist_content, test_plist_as_json } from './plist-parser.test.js'

describe('benchmark', () => {
  bench('serialize', () => {
    serialize_json_to_plist(test_plist_as_json)
  })

  bench('deserialize', () => {
    deserialize_json_to_plist(test_info_plist_content)
  })
})
