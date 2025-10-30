// 세션 단위 광고 표시 플래그 (메모리 상태만 유지)
const sessionAdShown = false

export interface CanShowAdParams {
  viewedCount: number // 링크 열람 횟수
  todayCount: number // 오늘 광고 노출 횟수
}

/**
 * 광고를 표시할 수 있는지 판단
 * 조건:
 * - 링크 3의 배수일 때만 노출 (3, 6, 9, ...)
 * - 하루 최대 3회
 * - 링크 3개 이상 열람 필요
 */
export const canShowAd = ({
  viewedCount,
  todayCount,
}: CanShowAdParams): boolean => {
  // 조건 1: 하루 최대 3회
  if (todayCount >= 3) return false

  // 조건 2: 링크 3개 이상 열람 필요
  if (viewedCount < 3) return false

  // 조건 3: 3의 배수일 때만 노출 (3, 6, 9, ...)
  if (viewedCount % 3 === 0) {
    return true
  }

  return false
}

/**
 * 세션 플래그 초기화 (더 이상 사용 안 함)
 */
export const resetSessionFlag = () => {
  // 3의 배수마다 표시하므로 세션 플래그 불필요
}

/**
 * 세션 플래그 상태 조회 (더 이상 사용 안 함)
 */
export const getSessionAdShown = () => false
