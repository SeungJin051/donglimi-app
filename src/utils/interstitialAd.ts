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
let isAdMobInitialized = false

/**
 * AdMob 초기화 완료 플래그 설정
 */
export const setAdMobInitialized = (initialized: boolean) => {
  isAdMobInitialized = initialized
}

/**
 * 광고 인스턴스 getter
 * AdMob 초기화 완료 후에만 생성
 */
export const getInterstitialAd = () => {
  // AdMob이 초기화되지 않았으면 null 반환
  if (!isAdMobInitialized) {
    return null
  }

  if (!interstitialAd) {
    try {
      interstitialAd = InterstitialAd.createForAdRequest(AD_UNIT_ID, {
        requestNonPersonalizedAdsOnly: false,
      })
    } catch (error) {
      console.error('InterstitialAd 생성 실패:', error)
      return null
    }
  }
  return interstitialAd
}
