import { Timestamp } from 'firebase/firestore'

// 파이어베이스 타임스탬프, 문자열, 숫자를 받아서 원하는 형식의 날짜 문자열을 반환합니다.
export const getFormattedDate = (
  dateValue: Timestamp | string | number
): string => {
  if (!dateValue) {
    return ''
  }
  if (dateValue instanceof Timestamp) {
    return dateValue.toDate().toLocaleDateString('ko-KR')
  }

  if (typeof dateValue === 'string' || typeof dateValue === 'number') {
    const date = new Date(dateValue)

    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('ko-KR')
    }
  }

  return ''
}
