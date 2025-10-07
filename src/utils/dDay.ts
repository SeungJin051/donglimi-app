/**
 * 주어진 날짜 문자열로부터 D-Day를 계산하는 유틸리티 함수
 * @param dateString - "MM/DD" 또는 "MM/DD~MM/DD" 형식의 날짜 문자열
 * @returns D-Day 문자열과 스타일 정보를 포함한 객체
 */
export function calculateDDay(dateString: string): {
  text: string
  textColor: string
  bgColor: string
} {
  const today = new Date()
  const kstDate = new Date(today.setHours(today.getHours() + 9))

  // 날짜에 범위가 있는 경우 첫 날짜 사용
  const [startDate] = dateString.split('~')
  const [month, day] = startDate.trim().split('/').map(Number)

  if (isNaN(month) || isNaN(day))
    return {
      text: '-',
      textColor: 'text-gray-500',
      bgColor: 'bg-gray-100',
    }

  const targetDate = new Date(kstDate.getFullYear(), month - 1, day)
  const diffDays = Math.ceil(
    (targetDate.getTime() - kstDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  const text =
    diffDays === 0
      ? 'D-Day'
      : diffDays > 0
        ? `D-${diffDays}`
        : `D+${Math.abs(diffDays)}`

  // 7일 이하는 빨간색, 7일 이상은 파란색
  const textColor = diffDays <= 7 ? 'text-red-500' : 'text-blue-500'
  const bgColor = diffDays <= 7 ? 'bg-red-100' : 'bg-blue-100'

  return { text, textColor, bgColor }
}
