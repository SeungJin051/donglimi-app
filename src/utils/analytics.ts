import * as Analytics from 'expo-firebase-analytics'

/**
 * Firebase Analytics 유틸리티
 * 핵심 이벤트만 최소한으로 추적
 */

// 화면 조회 (필요한 화면에만 수동 추가)
// logEvent로 screen_view 기록
export const logScreenView = async (screenName: string) => {
  try {
    await Analytics.logEvent('screen_view', {
      screen_name: screenName,
      screen_class: screenName,
    })
  } catch (error) {
    // 개발 환경에서는 에러 무시
    if (__DEV__) {
      console.log('Analytics logScreenView error:', error)
    }
  }
}

// 커스텀 이벤트 로깅
export const logEvent = async (
  eventName: string,
  params?: Record<string, string | number | boolean>
) => {
  try {
    await Analytics.logEvent(eventName, params)
  } catch (error) {
    // 개발 환경에서는 에러 무시
    if (__DEV__) {
      console.log('Analytics logEvent error:', error)
    }
  }
}

// 핵심 이벤트 래퍼 함수들
export const analytics = {
  // 스크랩 추가
  scrapAdded: () => logEvent('scrap_added'),

  // 스크랩 삭제
  scrapRemoved: () => logEvent('scrap_removed'),

  // 검색 실행
  searchPerformed: (searchTerm: string) =>
    logEvent('search_performed', { search_term: searchTerm }),

  // 전면 광고 노출
  adInterstitialShown: () => logEvent('ad_interstitial_shown'),

  // 온보딩 완료
  onboardingCompleted: () => logEvent('onboarding_completed'),
}
