export interface CanShowAdParams {
  viewedCount: number // 링크 열람 횟수
  todayCount: number // 오늘 광고 노출 횟수
}

export interface CanShowAppLaunchAdParams {
  appLaunchCount: number // 앱 실행 횟수
  todayCount: number // 오늘 광고 노출 횟수
}

export interface CanShowTabSwitchAdParams {
  tabSwitchCount: number // 탭 전환 횟수
  todayCount: number // 오늘 광고 노출 횟수
}

export interface CanShowScrapAdParams {
  scrapActionCount: number // 스크랩 액션 횟수
  todayCount: number // 오늘 광고 노출 횟수
}

/**
 * 광고를 표시할 수 있는지 판단 (공지사항 상세보기 후)
 * 조건:
 * - 링크 3의 배수일 때만 노출 (3, 6, 9, ...)
 * - 하루 최대 10회
 * - 링크 3개 이상 열람 필요
 */
export const canShowAd = ({
  viewedCount,
  todayCount,
}: CanShowAdParams): boolean => {
  // 조건 1: 하루 최대 10회
  if (todayCount >= 10) return false

  // 조건 2: 링크 3개 이상 열람 필요
  if (viewedCount < 3) return false

  // 조건 3: 3의 배수일 때만 노출 (3, 6, 9, 12, ...)
  if (viewedCount % 3 === 0) {
    return true
  }

  return false
}

/**
 * 앱 실행 시 광고 표시 판단
 * 조건:
 * - 2회 실행마다 1번 (2, 4, 6, ...)
 * - 하루 최대 10회
 */
export const canShowAppLaunchAd = ({
  appLaunchCount,
  todayCount,
}: CanShowAppLaunchAdParams): boolean => {
  if (todayCount >= 10) return false
  if (appLaunchCount < 2) return false
  if (appLaunchCount % 2 === 0) return true
  return false
}

/**
 * 탭 전환 시 광고 표시 판단
 * 조건:
 * - 10회 전환마다 1번 (10, 20, 30, ...)
 * - 하루 최대 10회
 */
export const canShowTabSwitchAd = ({
  tabSwitchCount,
  todayCount,
}: CanShowTabSwitchAdParams): boolean => {
  if (todayCount >= 10) return false
  if (tabSwitchCount < 10) return false
  if (tabSwitchCount % 10 === 0) return true
  return false
}

/**
 * 스크랩 액션 후 광고 표시 판단
 * 조건:
 * - 4회 액션마다 1번 (4, 8, 12, ...)
 * - 하루 최대 10회
 */
export const canShowScrapAd = ({
  scrapActionCount,
  todayCount,
}: CanShowScrapAdParams): boolean => {
  if (todayCount >= 10) return false
  if (scrapActionCount < 4) return false
  if (scrapActionCount % 4 === 0) return true
  return false
}
