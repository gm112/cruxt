import { describe, it, expect, bench } from 'vitest'
import { deserialize_json_to_plist, serialize_json_to_plist, type plist_value } from './plist-parser.js'

describe('plist_parser', () => {
  // Happy cases
  describe('happy_cases', () => {
    it('serializes_js_object_to_info_plist', () => {
      expect(() => {
        const serialized = serialize_json_to_plist(test_plist_as_json)
        expect(serialized).toEqual(test_info_plist_content)
      }).not.toThrow()
    })

    it('deserializes_info_plist_to_js_object', () => {
      expect(() => {
        const parsed = deserialize_json_to_plist(test_info_plist_content)
        expect(parsed).toEqual(test_plist_as_json)
      }).not.toThrow()
    })
  })

  // Unhappy cases
  describe('error_handling', () => {
    const _bad_values = [
      { CFBundleName: 123 },
      { CFBundleName: undefined },
      { Items: ['ok', null] },
      123,
    ].map((value, index) => it(`throws_on_unsupported_value_type_${index + 1}`, () => {
      expect(() => serialize_json_to_plist(value as unknown as plist_value))
        .toThrowError(/unsupported_value_type/)
    }))

    it('throws_on_invalid_xml_no_plist_wrapper', () => {
      const bad_plist = `
<dict>
  <key>CFBundleName</key>
  <string>MyApp</string>
</dict>
`
      expect(() => deserialize_json_to_plist(bad_plist)).toThrowError(/invalid_xml/)
    })

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
      <true/>
      <123></123>
      <test></test>
      <barf/>
      ssss
  </array>
</plist>
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
    ].map((xml, index) => it(`throws_on_malformed_array_content_${index + 1}`, () =>
      expect(() => deserialize_json_to_plist(xml)).toThrowError(/unsupported_tag|invalid_xml/),
    ))

    const _malformed_dict_tests = [
      `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>CFBundleName</key>
    <!-- missing value here -->
  </dict>
</plist>
`.trim(),
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
</plist>
`.trim(),
    ].map((xml, index) => it(`throws_on_malformed_dict_content_${index + 1}_2`, () =>
      expect(() => deserialize_json_to_plist(xml)).toThrowError(/invalid_xml/),
    ))

    it('handles_empty_dict_and_array_correctly', () => {
      expect(() => {
        const json = { empty_object: {}, empty_array: [], some_bool: false }
        const plist = serialize_json_to_plist(json)
        expect(plist).toContain('<dict/>')
        expect(plist).toContain('<array/>')
        expect(plist).toContain('<false/>')
        const parsed = deserialize_json_to_plist(plist)
        expect(parsed).toEqual(json)
      }).not.toThrow()
    })
  })

  describe('benchmark', () => {
    if (process.env.VITEST_MODE === 'bench') {
      bench('serialize', () => {
        serialize_json_to_plist(test_plist_as_json)
      })

      bench('deserialize', () => {
        deserialize_json_to_plist(test_info_plist_content)
      })
    }
    else {
      it.todo('not running benchmark')
    }
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
</dict>
</plist>
`.trim()
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
}
