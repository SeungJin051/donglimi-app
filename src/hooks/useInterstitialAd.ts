import { useEffect, useState } from 'react'

import { Platform, StatusBar } from 'react-native'
import mobileAds, { AdEventType } from 'react-native-google-mobile-ads'

import { analytics } from '@/utils/analytics'
import { getInterstitialAd, setAdMobInitialized } from '@/utils/interstitialAd'

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

    // AdMob 초기화 - 초기화 완료 후에만 광고 인스턴스 생성
    mobileAds()
      .initialize()
      .then(() => {
        // 초기화 성공 후 플래그 설정
        setAdMobInitialized(true)

        // 초기화 완료 후에 광고 인스턴스 생성 및 이벤트 리스너 설정
        const ad = getInterstitialAd()
        if (!ad) {
          console.log('광고 인스턴스 생성 실패')
          return
        }

        // 로드 완료 이벤트
        ad.addAdEventListener(AdEventType.LOADED, () => {
          globalLoaded = true
          setLoadedState(true)

          if (globalPendingShow) {
            globalPendingShow = false

            // 뷰 컨트롤러가 닫힌 후 광고 표시 (500ms 딜레이)
            setTimeout(() => {
              try {
                ad.show()
              } catch (error) {
                console.log('광고 표시 실패:', error)
              }
            }, 500)
          }
        })

        // 광고 표시 시작
        ad.addAdEventListener(AdEventType.OPENED, () => {
          if (Platform.OS === 'ios') {
            StatusBar.setHidden(true)
          }
          // Analytics: 전면 광고 노출 추적
          analytics.adInterstitialShown()
        })

        // 광고 닫힘
        ad.addAdEventListener(AdEventType.CLOSED, () => {
          if (Platform.OS === 'ios') {
            StatusBar.setHidden(false)
          }
          globalLoaded = false
          setLoadedState(false)
          try {
            ad.load()
          } catch (error) {
            console.log('광고 재로드 실패:', error)
          }
        })

        // 로드 실패
        ad.addAdEventListener(AdEventType.ERROR, (error) => {
          console.log('광고 로드 실패:', error)
          globalLoaded = false
          setLoadedState(false)
          globalPendingShow = false
        })

        // 초기 로드
        try {
          ad.load()
        } catch (error) {
          console.log('초기 광고 로드 실패:', error)
        }
      })
      .catch((error) => {
        console.log('AdMob 초기화 실패:', error)
        // 초기화 실패해도 앱 크래시 방지
        setAdMobInitialized(false)
      })
  }, [])

  const showAd = () => {
    const ad = getInterstitialAd()
    if (!ad) {
      console.log('광고 인스턴스가 없습니다')
      return
    }

    if (globalLoaded) {
      // 뷰 컨트롤러가 닫힌 후 광고 표시 (500ms 딜레이)
      setTimeout(() => {
        try {
          ad.show()
        } catch (error) {
          console.log('광고 표시 실패:', error)
        }
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
