// 환경별 광고 단위 ID
import Constants from 'expo-constants'
import { Platform } from 'react-native'
import { InterstitialAd, TestIds } from 'react-native-google-mobile-ads'

const AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.OS === 'ios'
    ? Constants.expoConfig?.extra?.EXPO_PUBLIC_IOS_INTERSTITIAL_AD_UNIT
    : Constants.expoConfig?.extra?.EXPO_PUBLIC_ANDROID_INTERSTITIAL_AD_UNIT

// 싱글톤 인스턴스
let interstitialAd: InterstitialAd | null = null

/**
 * 광고 인스턴스 getter
 * 최초 한 번만 생성 후 재사용r
 */
export const getInterstitialAd = () => {
  if (!interstitialAd) {
    interstitialAd = InterstitialAd.createForAdRequest(AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: false,
    })
  }
  return interstitialAd
}
