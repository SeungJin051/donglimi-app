export interface CanShowAdParams {
  viewedCount: number // 링크 열람 횟수
  todayCount: number // 오늘 광고 노출 횟수
}

/**
 * 광고를 표시할 수 있는지 판단
 * 조건:
 * - 링크 2의 배수일 때만 노출 (2, 4, 6, 8, ...)
 * - 하루 최대 5회
 * - 링크 2개 이상 열람 필요
 */
export const canShowAd = ({
  viewedCount,
  todayCount,
}: CanShowAdParams): boolean => {
  // 조건 1: 하루 최대 5
  if (todayCount >= 5) return false

  // 조건 2: 링크 2개 이상 열람 필요
  if (viewedCount < 2) return false

  // 조건 3: 2의 배수일 때만 노출 (2, 4, 6, 8, ...)
  if (viewedCount % 2 === 0) {
    return true
  }

  return false
}
