import { describe, it, expect } from 'vitest'
import { deserialize_json_to_plist, serialize_json_to_plist, type plist_value } from './plist-parser.js'
/* eslint-disable @stylistic/no-tabs */
const test_info_plist_content = `
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

const test_plist_as_json = {
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
  UIRequiredDeviceCapabilities: [
    'armv7',
  ],
  UIRequiresFullScreen: true,
  UIStatusBarStyle: 'UIStatusBarStyleDefault',
  UISupportedInterfaceOrientations: [
    'UIInterfaceOrientationPortrait',
  ],
  UIViewControllerBasedStatusBarAppearance: true,
  WKAppBoundDomains: [
    'test.test',
  ],
}

describe('plist-parser', () => {
  it('parses Info.plist to JS object', () => {
    const parsed = deserialize_json_to_plist(test_info_plist_content)
    expect(parsed).toEqual(test_plist_as_json)
  })

  it('serializes JS object to Info.plist', () => {
    const serialized = serialize_json_to_plist(test_plist_as_json)
    expect(serialized).toEqual(test_info_plist_content)
  })

  it('throws on invalid XML (no <plist> wrapper)', () => {
    const badPlist = `
  <dict>
    <key>CFBundleName</key>
    <string>MyApp</string>
  </dict>
  `
    expect(() => deserialize_json_to_plist(badPlist)).toThrowError(/invalid_xml/)
  })

  it('throws on unsupported value type (number)', () => {
    const bad_jason = { CFBundleName: 123 } as unknown as plist_value // Doing type hackery to make TS happy.
    expect(() => serialize_json_to_plist(bad_jason)).toThrowError(/unsupported_value_type/)
  })

  it('skips keys without values gracefully', () => {
    const bad_plist_bad_bad = `
  <?xml version="1.0" encoding="UTF-8"?>
  <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
  <plist version="1.0">
  <dict>
    <key>CFBundleName</key>
    <!-- missing value -->
  </dict>
  </plist>
  `
    expect(() => deserialize_json_to_plist(bad_plist_bad_bad)).toThrowError(/invalid_xml/)
  })

  it('throws on undefined value in dict', () => {
    const bad_jason = { CFBundleName: undefined } as unknown as plist_value // Doing type hackery to make TS happy.
    expect(() => serialize_json_to_plist(bad_jason)).toThrowError(/unsupported_value_type/)
  })

  it('throws on null value in array', () => {
    const bad_jason = { Items: ['ok', null] } as unknown as plist_value // Doing type hackery to make TS happy.
    expect(() => serialize_json_to_plist(bad_jason)).toThrowError(/unsupported_value_type/)
  })
})
