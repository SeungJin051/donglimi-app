// metro.config.js
const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config')

// 기본 Expo Metro 설정을 가져옵니다.
const config = getDefaultConfig(__dirname)

// NativeWind 설정을 적용합니다.
const configWithNativeWind = withNativeWind(config, {
  input: './global.css',
})

// NativeWind가 적용된 설정을 Reanimated 설정으로 다시 감싸서 내보냅니다.
module.exports = wrapWithReanimatedMetroConfig(configWithNativeWind)
