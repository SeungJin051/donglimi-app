import { useEffect, useState } from 'react'

import { Platform, StatusBar } from 'react-native'
import mobileAds, { AdEventType } from 'react-native-google-mobile-ads'

import { getInterstitialAd } from '@/utils/interstitialAd'

// 전역 상태 관리 (모든 컴포넌트가 공유)
let isInitialized = false
let globalLoaded = false
let globalPendingShow = false

export const useInterstitialAd = () => {
  const [loadedState, setLoadedState] = useState(globalLoaded)

  useEffect(() => {
    // 최초 한 번만 초기화
    if (isInitialized) return
    isInitialized = true

    const ad = getInterstitialAd()

    // AdMob 초기화
    mobileAds()
      .initialize()
      .catch((error) => {
        console.log('AdMob 초기화 실패:', error)
      })

    // 로드 완료 이벤트
    ad.addAdEventListener(AdEventType.LOADED, () => {
      globalLoaded = true
      setLoadedState(true)

      if (globalPendingShow) {
        globalPendingShow = false

        // 뷰 컨트롤러가 닫힌 후 광고 표시 (500ms 딜레이)
        setTimeout(() => {
          ad.show()
        }, 500)
      }
    })

    // 광고 표시 시작
    ad.addAdEventListener(AdEventType.OPENED, () => {
      if (Platform.OS === 'ios') {
        StatusBar.setHidden(true)
      }
    })

    // 광고 닫힘
    ad.addAdEventListener(AdEventType.CLOSED, () => {
      if (Platform.OS === 'ios') {
        StatusBar.setHidden(false)
      }
      globalLoaded = false
      setLoadedState(false)
      ad.load()
    })

    // 로드 실패
    ad.addAdEventListener(AdEventType.ERROR, (error) => {
      console.log('❌ 광고 로드 실패:', error)
      globalLoaded = false
      setLoadedState(false)
      globalPendingShow = false
    })

    // 초기 로드
    ad.load()
  }, [])

  const showAd = () => {
    const ad = getInterstitialAd()

    if (globalLoaded) {
      // 뷰 컨트롤러가 닫힌 후 광고 표시 (500ms 딜레이)
      setTimeout(() => {
        ad.show()
      }, 500)
    } else {
      globalPendingShow = true
    }
  }

  return {
    showAd,
    loaded: loadedState,
  }
}
