import React, { useRef } from 'react'

import Constants from 'expo-constants'
import { Platform, View } from 'react-native'
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from 'react-native-google-mobile-ads'

// 환경별 광고 단위 ID
const AD_UNIT_ID = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : Platform.OS === 'ios'
    ? Constants.expoConfig?.extra?.EXPO_PUBLIC_IOS_BANNER_AD_UNIT
    : Constants.expoConfig?.extra?.EXPO_PUBLIC_ANDROID_BANNER_AD_UNIT

export const CenterAdCard = () => {
  const bannerRef = useRef<BannerAd>(null)

  useForeground(() => {
    if (Platform.OS === 'ios') {
      bannerRef.current?.load()
    }
  })

  return (
    <View className="mb-4 items-center">
      <BannerAd
        unitId={AD_UNIT_ID}
        size={BannerAdSize.LARGE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdFailedToLoad={(error) => {
          console.log('배너 광고 로드 실패:', error.message)
        }}
      />
    </View>
  )
}
