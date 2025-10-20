import { Timestamp } from 'firebase/firestore'

// UI에 표시할 형식의 날짜 문자열을 반환합니다.
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

// 정렬/계산 다양한 형태의 날짜 값을 ms(number)로 변환합니다.
export const getTimeMs = (value: unknown): number => {
  if (!value) return 0
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const ms = new Date(value).getTime()
    return Number.isFinite(ms) ? ms : 0
  }
  // 타입 가드들로 좁히기
  type PersistedTimestamp = { seconds: number; nanoseconds?: number }
  const hasToMillis = (v: unknown): v is { toMillis: () => number } =>
    !!v && typeof (v as { toMillis?: unknown }).toMillis === 'function'
  const isPersisted = (v: unknown): v is PersistedTimestamp =>
    !!v && typeof (v as { seconds?: unknown }).seconds === 'number'

  if (value instanceof Timestamp || hasToMillis(value)) {
    return (value as Timestamp | { toMillis: () => number }).toMillis()
  }
  if (isPersisted(value)) {
    const ns = typeof value.nanoseconds === 'number' ? value.nanoseconds : 0
    return value.seconds * 1000 + Math.floor(ns / 1e6)
  }
  return 0
}
