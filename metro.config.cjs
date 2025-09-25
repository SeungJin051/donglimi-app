// metro.config.js

const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

const config = getDefaultConfig(__dirname)

module.exports = withNativeWind(config, {
  // 여기에 NativeWind 관련 추가 설정을 할 수 있습니다.
  input: './global.css',
  // React Native 웹을 사용한다면 아래 설정을 추가하세요.
  // projectRoot: __dirname,
})
