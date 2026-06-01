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
const CONFIG_AD_UNIT_ID =
  Platform.OS === 'ios'
    ? Constants.expoConfig?.extra?.EXPO_PUBLIC_IOS_BANNER_AD_UNIT
    : Constants.expoConfig?.extra?.EXPO_PUBLIC_ANDROID_BANNER_AD_UNIT

const AD_UNIT_ID =
  __DEV__ || !CONFIG_AD_UNIT_ID ? TestIds.ADAPTIVE_BANNER : CONFIG_AD_UNIT_ID

export const CenterAdCard = () => {
  const bannerRef = useRef<BannerAd>(null)

  useForeground(() => {
    if (Platform.OS === 'ios') {
      bannerRef.current?.load()
    }
  })

  if (!AD_UNIT_ID) {
    console.warn(
      '배너 광고 단위 ID가 설정되지 않아 배너를 렌더링하지 않습니다.'
    )
    return null
  }

  return (
    <View className="mb-4 items-center">
      <BannerAd
        unitId={AD_UNIT_ID}
        size={BannerAdSize.ADAPTIVE_BANNER}
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
