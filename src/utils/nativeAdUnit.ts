import Constants from 'expo-constants'
import { Platform } from 'react-native'
import { TestIds } from 'react-native-google-mobile-ads'

const CONFIG_AD_UNIT_ID =
  Platform.OS === 'ios'
    ? Constants.expoConfig?.extra?.EXPO_PUBLIC_IOS_NATIVE_AD_UNIT
    : Constants.expoConfig?.extra?.EXPO_PUBLIC_ANDROID_NATIVE_AD_UNIT

export const NATIVE_AD_UNIT_ID =
  __DEV__ || !CONFIG_AD_UNIT_ID ? TestIds.NATIVE : CONFIG_AD_UNIT_ID
