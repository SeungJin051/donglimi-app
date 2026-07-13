import mobileAds from 'react-native-google-mobile-ads'

let initPromise: Promise<void> | null = null

/** AdMob SDK 초기화 (앱 전역 1회) */
export function initializeMobileAds(): Promise<void> {
  if (!initPromise) {
    initPromise = mobileAds()
      .initialize()
      .then(() => undefined)
      .catch((error) => {
        initPromise = null
        throw error
      })
  }
  return initPromise
}
