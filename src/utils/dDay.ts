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
  // '오늘' 날짜를 가져옵니다.
  const today = new Date()

  today.setHours(0, 0, 0, 0)

  // 날짜에 범위가 있는 경우 첫 날짜 사용
  const [startDate] = dateString.split('~')
  const [month, day] = startDate.trim().split('/').map(Number)

  if (isNaN(month) || isNaN(day)) {
    return {
      text: '-',
      textColor: 'text-gray-500',
      bgColor: 'bg-gray-100',
    }
  }

  // '목표' 날짜를 생성합니다. (오늘 연도 기준, 0시 0분)
  const targetDate = new Date(today.getFullYear(), month - 1, day)

  // 날짜 차이(ms)를 계산한 뒤 '일' 단위로 변환합니다.
  const diffTime = targetDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // D-Day 텍스트 생성
  const text =
    diffDays === 0
      ? 'D-Day'
      : diffDays > 0
        ? `D-${diffDays}`
        : `D+${Math.abs(diffDays)}`

  // 색상 설정을
  let textColor = 'text-gray-500'
  let bgColor = 'bg-gray-100'

  if (diffDays < 0) {
    textColor = 'text-gray-500'
    bgColor = 'bg-gray-100'
  } else if (diffDays === 0) {
    textColor = 'text-white'
    bgColor = 'bg-red-500'
  } else if (diffDays <= 7) {
    textColor = 'text-red-600'
    bgColor = 'bg-red-100'
  } else if (diffDays <= 30) {
    textColor = 'text-blue-600'
    bgColor = 'bg-blue-100'
  } else {
    textColor = 'text-green-600'
    bgColor = 'bg-green-100'
  }

  return { text, textColor, bgColor }
}
