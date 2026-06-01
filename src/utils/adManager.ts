export interface CanShowAdParams {
  viewedCount: number // 링크 열람 횟수
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

export interface CanShowHomeFeedLoadMoreAdParams {
  loadMoreCount: number // fetchNextPage 성공 누적 횟수
  todayCount: number
}

/**
 * 광고를 표시할 수 있는지 판단 (공지/알림 등 링크 열람 후)
 * 조건:
 * - 링크 2의 배수일 때만 노출 (2, 4, 6, ...)
 * - 하루 최대 10회
 * - 링크 2개 이상 열람 필요
 */
export const canShowAd = ({
  viewedCount,
  todayCount,
}: CanShowAdParams): boolean => {
  if (todayCount >= 10) return false
  if (viewedCount < 2) return false
  if (viewedCount % 2 === 0) return true
  return false
}

/**
 * 탭 전환 시 광고 표시 판단
 * 조건:
 * - 4회 전환마다 1번 (4, 8, 12, ...)
 * - 하루 최대 10회
 */
export const canShowTabSwitchAd = ({
  tabSwitchCount,
  todayCount,
}: CanShowTabSwitchAdParams): boolean => {
  if (todayCount >= 10) return false
  if (tabSwitchCount < 4) return false
  if (tabSwitchCount % 4 === 0) return true
  return false
}

/**
 * 홈 무한스크롤(다음 페이지 로드 성공) 시 전면 광고
 * 조건: 3, 6, 9…번째 추가 로드마다
 */
export const canShowHomeFeedLoadMoreAd = ({
  loadMoreCount,
  todayCount,
}: CanShowHomeFeedLoadMoreAdParams): boolean => {
  if (todayCount >= 10) return false
  if (loadMoreCount < 3) return false
  return loadMoreCount % 3 === 0
}

/**
 * 스크랩 액션 후 광고 표시 판단
 * 조건:
 * - 2회 액션마다 1번 (2, 4, 6, ...)
 * - 하루 최대 10회
 */
export const canShowScrapAd = ({
  scrapActionCount,
  todayCount,
}: CanShowScrapAdParams): boolean => {
  if (todayCount >= 10) return false
  if (scrapActionCount < 2) return false
  if (scrapActionCount % 2 === 0) return true
  return false
}
