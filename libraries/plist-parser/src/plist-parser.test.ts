import { describe, it, expect } from 'vitest'
import { deserialize_plist_xml_to_plist_object, serialize_xml_to_plist_object, type plist_value } from './plist-parser.js'

describe('plist_parser', () => {
  // Happy cases
  describe('happy cases', () => {
    describe('serialize', () => {
      it('serializes js object_to info plist', () => {
        expect(() => {
          const serialized = serialize_xml_to_plist_object(test_plist_as_json)
          expect(serialized).toEqual(test_info_plist_content)
        }).not.toThrow()
      })

      it('properly escapes entities in js object strings', () => {
        expect(() => {
          const serialized = serialize_xml_to_plist_object({ CFBundleName: 'hello&hello' })
          expect(serialized).toContain('<string>hello&amp;hello</string>')
        }).not.toThrow()
      })

      it('properly handles numbers', () => {
        expect(() => {
          const serialized = serialize_xml_to_plist_object({ CFBundleName: 123 })
          expect(serialized).toContain('<string>123</string>')
        })
      })

      it('properly handles dates', () => {
        expect(() => {
          const serialized = serialize_xml_to_plist_object({ CFBundleName: new Date() })
          expect(serialized).toContain('<date>')
        }).not.toThrow()
      })

      it('properly handles real numbers', () => {
        expect(() => {
          const serialized = serialize_xml_to_plist_object({ CFBundleName: 123.456 })
          expect(serialized).toContain('<real>123.456</real>')
        }).not.toThrow()
      })

      it('properly throws an error on NaN numbers', () => {
        expect(() => serialize_xml_to_plist_object({ CFBundleName: NaN })).toThrowError(/unsupported_value_type/)
      })

      it('properly throws an error on numbers that fail isNaN test', () => {
        expect(() => serialize_xml_to_plist_object({ CFBundleName: Infinity })).toThrowError(/unsupported_value_type/)
      })
    })

    describe('deserialize', () => {
      it('deserializes info plist to js object', () => {
        expect(() => {
          const parsed = deserialize_plist_xml_to_plist_object(test_info_plist_content)
          expect(parsed).toEqual(test_plist_as_json)
        }).not.toThrow()
      })

      it('deserializes info plist to js object with entities in strings properly', () => {
        const test_data = { CFBundleName: 'hello&hello' }
        const serialized = serialize_xml_to_plist_object(test_data)

        expect(serialized).toEqual(test_plist_with_escaped_entities_as_xml)
        const parsed = deserialize_plist_xml_to_plist_object(serialized)
        expect(parsed).toEqual(test_data)
      })

      it('removes comments from plist', () => {
        const parsed = deserialize_plist_xml_to_plist_object(test_plist_with_commentsonicthehedgehogs_as_xml)
        const serialized = serialize_xml_to_plist_object(parsed)
        expect(serialized).not.toContain('sonicthehedgehog')
      })

      it('properly handles dates', () => {
        const parsed = deserialize_plist_xml_to_plist_object(test_plist_with_date_as_xml)
        const serialized = serialize_xml_to_plist_object(parsed)
        expect(serialized).toEqual(test_plist_with_date_as_xml)
      })

      it('properly handles real numbers', () => {
        const parsed = deserialize_plist_xml_to_plist_object(test_plist_with_real_as_xml)
        const serialized = serialize_xml_to_plist_object(parsed)
        expect(serialized).toEqual(test_plist_with_real_as_xml)
      })
    })
  })

  // Unhappy cases
  describe('error handling', () => {
    describe('serialize', () => {
      const _bad_values = [
        { CFBundleName: function () {} },
        { CFBundleName: undefined },
        { Items: ['ok', null] },
        123,
      ].map((value, index) => it(`throws_on_unsupported_value_type_${index + 1}`, () => {
        expect(() =>
          serialize_xml_to_plist_object(value as unknown as plist_value))
          .toThrowError(/unsupported_value_type/)
      }))

      it('handles empty dict and array correctly', () => {
        expect(() => {
          const json = { empty_object: {}, empty_array: [], some_bool: false }
          const plist = serialize_xml_to_plist_object(json)
          expect(plist).toContain('<dict/>')
          expect(plist).toContain('<array/>')
          expect(plist).toContain('<false/>')
          const parsed = deserialize_plist_xml_to_plist_object(plist)
          expect(parsed).toEqual(json)
        }).not.toThrow()
      })
    })

    describe('deserialize', () => {
      const _bad_plist_tests = [`
<dict>
  <key>CFBundleName</key>
  <string>MyApp</string>
</dict>
`.trim(),
      `
<dict>
  <key>CFBundleName</key>
  <string>hello&hello</string>
</dict>

`.trim(),
      `
<dict>
  <key>CFBundleName</key>
  <string>hello<hello</string>
</dict>

`.trim(),
      ].map((bad_plist, index) => it(`throws on invalid xml no plist wrapper_${index + 1}`, () =>
        expect(() => deserialize_plist_xml_to_plist_object(bad_plist)).toThrowError(/invalid_xml/),
      ))

      const _malformed_arrays_xml = [
        `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <array>
    <foobar
  </array>
</plist>
`.trim(),
        `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <array>
    ???
  </array>
`.trim(),
        `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <array>
      <string>ok</string>
      <array/>
      <dict/>
      <dict />
      <dict></dict>
      <derp/>
      <array>
      </array>
      <dict></dict>
      <true/>
      ssss
  </array>
</plist>
`.trim(),
        `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <array>
      <></>
  </array>
</plist>
`.trim(),
      ].map((xml, index) => it(`throws on malformed array content_${index + 1}`, () =>
        expect(() => deserialize_plist_xml_to_plist_object(xml)).toThrowError(/unsupported_tag|invalid_xml/),
      ))

      const _malformed_dict_tests = [
        `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>CFBundleName</key>
    ???
  </dict>
</plist>
`.trim(),
        `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>CFBundleName</key>
      <string>ok</string>
      <array/>
      <dict/>
      <dict />
      <dict></dict>
      <derp/>
      <array>
      </array>
      <dict></dict>
      <true/>
  </dict>
</plist>
`.trim(),
        `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>
    12345
`.trim(),
      ].map((xml, index) => it(`throws on malformed dict content_${index + 1}`, () =>
        expect(() => deserialize_plist_xml_to_plist_object(xml)).toThrowError(/invalid_xml/),
      ))
    })
  })
})
/* eslint-disable @stylistic/no-tabs */
export const test_info_plist_content = `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>BGTaskSchedulerPermittedIdentifiers</key>
	<array>
		<string>com.taste.test</string>
		<string>com.test.taste</string>
	</array>
	<key>CFBundleDevelopmentRegion</key>
	<string>en</string>
	<key>CFBundleDisplayName</key>
	<string>TestAppName</string>
	<key>CFBundleExecutable</key>
	<string>$(EXECUTABLE_NAME)</string>
	<key>CFBundleIdentifier</key>
	<string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
	<key>CFBundleInfoDictionaryVersion</key>
	<string>6.0</string>
	<key>CFBundleName</key>
	<string>$(PRODUCT_NAME)</string>
	<key>CFBundlePackageType</key>
	<string>APPL</string>
	<key>CFBundleShortVersionString</key>
	<string>$(MARKETING_VERSION)</string>
	<key>CFBundleVersion</key>
	<string>$(CURRENT_PROJECT_VERSION)</string>
	<key>LSMinimumSystemVersion</key>
	<string>13.3.0</string>
	<key>LSRequiresIPhoneOS</key>
	<true/>
	<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
	<string>This app requires access to your location to function properly.</string>
	<key>NSLocationAlwaysUsageDescription</key>
	<string>This app requires access to your location to function properly.</string>
	<key>NSLocationWhenInUseUsageDescription</key>
	<string>This app requires access to your location to function properly.</string>
	<key>NSMotionUsageDescription</key>
	<string>TAllow for location tracking related to meetings and related locations.</string>
	<key>UIBackgroundModes</key>
	<array>
		<string>audio</string>
		<string>fetch</string>
		<string>location</string>
		<string>processing</string>
	</array>
	<key>UILaunchStoryboardName</key>
	<string>LaunchScreen</string>
	<key>UIMainStoryboardFile</key>
	<string>Main</string>
	<key>UIRequiredDeviceCapabilities</key>
	<array>
		<string>armv7</string>
	</array>
	<key>UIRequiresFullScreen</key>
	<true/>
	<key>UIStatusBarStyle</key>
	<string>UIStatusBarStyleDefault</string>
	<key>UISupportedInterfaceOrientations</key>
	<array>
		<string>UIInterfaceOrientationPortrait</string>
	</array>
	<key>UIViewControllerBasedStatusBarAppearance</key>
	<true/>
	<key>WKAppBoundDomains</key>
	<array>
		<string>test.test</string>
	</array>
	<key>TestNumber</key>
	<integer>123</integer>
</dict>
</plist>
`.trim()

const test_plist_with_escaped_entities_as_xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleName</key>
	<string>hello&amp;hello</string>
</dict>
</plist>`

const test_plist_with_commentsonicthehedgehogs_as_xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleName</key>
    <!-- sonicthehedgehog -->
	<string>hello&amp;hello</string>
</dict>
</plist>`

const test_plist_with_date_as_xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleName</key>
	<date>2023-01-01T00:00:00.000Z</date>
</dict>
</plist>`

const test_plist_with_real_as_xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleName</key>
	<real>123.456</real>
</dict>
</plist>`
/* eslint-enable @stylistic/no-tabs */

export const test_plist_as_json = {
  BGTaskSchedulerPermittedIdentifiers: ['com.taste.test', 'com.test.taste'],
  CFBundleDevelopmentRegion: 'en',
  CFBundleDisplayName: 'TestAppName',
  CFBundleExecutable: '$(EXECUTABLE_NAME)',
  CFBundleIdentifier: '$(PRODUCT_BUNDLE_IDENTIFIER)',
  CFBundleInfoDictionaryVersion: '6.0',
  CFBundleName: '$(PRODUCT_NAME)',
  CFBundlePackageType: 'APPL',
  CFBundleShortVersionString: '$(MARKETING_VERSION)',
  CFBundleVersion: '$(CURRENT_PROJECT_VERSION)',
  LSMinimumSystemVersion: '13.3.0',
  LSRequiresIPhoneOS: true,
  NSLocationAlwaysAndWhenInUseUsageDescription: 'This app requires access to your location to function properly.',
  NSLocationAlwaysUsageDescription: 'This app requires access to your location to function properly.',
  NSLocationWhenInUseUsageDescription: 'This app requires access to your location to function properly.',
  NSMotionUsageDescription: 'TAllow for location tracking related to meetings and related locations.',
  UIBackgroundModes: ['audio', 'fetch', 'location', 'processing'],
  UILaunchStoryboardName: 'LaunchScreen',
  UIMainStoryboardFile: 'Main',
  UIRequiredDeviceCapabilities: ['armv7'],
  UIRequiresFullScreen: true,
  UIStatusBarStyle: 'UIStatusBarStyleDefault',
  UISupportedInterfaceOrientations: ['UIInterfaceOrientationPortrait'],
  UIViewControllerBasedStatusBarAppearance: true,
  WKAppBoundDomains: ['test.test'],
  TestNumber: 123,
}
