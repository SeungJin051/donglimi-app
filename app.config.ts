import type { ExpoConfig } from 'expo/config'

const config: ExpoConfig = {
  name: '동리미',
  slug: 'donglimi-app',
  version: '1.1',
  orientation: 'portrait',
  icon: './src/assets/images/icon.png',
  scheme: 'donglimiapp',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './src/assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#3182F6',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.seungjin051.donglimiapp',
    buildNumber: '1',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
    jsEngine: 'jsc',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './src/assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: 'com.seungjin051.donglimiapp',
    jsEngine: 'jsc',
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './src/assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-web-browser',
    [
      'react-native-google-mobile-ads',
      {
        iosAppId: 'ca-app-pub-6797307832453076~2539092522',
        androidAppId: 'ca-app-pub-3940256099942544~3347511713',
      },
    ],
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    EXPO_PUBLIC_IOS_BANNER_AD_UNIT: process.env.EXPO_PUBLIC_IOS_BANNER_AD_UNIT,
    EXPO_PUBLIC_IOS_INTERSTITIAL_AD_UNIT:
      process.env.EXPO_PUBLIC_IOS_INTERSTITIAL_AD_UNIT,
    EXPO_PUBLIC_ANDROID_BANNER_AD_UNIT:
      process.env.EXPO_PUBLIC_ANDROID_BANNER_AD_UNIT,
    EXPO_PUBLIC_ANDROID_INTERSTITIAL_AD_UNIT:
      process.env.EXPO_PUBLIC_ANDROID_INTERSTITIAL_AD_UNIT,
    EXPO_PUBLIC_ALGOLIA_APPLICATION_ID:
      process.env.EXPO_PUBLIC_ALGOLIA_APPLICATION_ID,
    EXPO_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY:
      process.env.EXPO_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY,
    router: {},
    eas: {
      projectId: 'e0b0a38e-f8a6-44b6-a6be-270eaaff6f7a',
    },
  },
  owner: 'seungjin051',
}

export default config
