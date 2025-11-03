import { useEffect, useState } from 'react'

import { doc, getDoc, Timestamp } from 'firebase/firestore'

import { requireDb } from '@/config/firebaseConfig'

export interface AcademicScheduleItem {
  id: number
  title: string
  date: string
}

export interface AcademicScheduleDoc {
  schedules: AcademicScheduleItem[]
  academic_year: string
  semester: string
  url: string
  updated_at: Timestamp
}

/**
 * Firestore에서 학사일정을 가져오는 훅
 * 에러 발생 시 빈 배열 반환 (fallback 없음)
 */
export function useAcademicSchedule() {
  const [schedules, setSchedules] = useState<AcademicScheduleItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [url, setUrl] = useState<string>(
    'https://www.deu.ac.kr/www/scheduleList.do'
  )

  useEffect(() => {
    const fetchAcademicSchedule = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const firestoreDb = requireDb()
        const docRef = doc(firestoreDb, 'academic_schedules', 'current')
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data() as AcademicScheduleDoc
          setSchedules(data.schedules || [])
          setUrl(data.url || 'https://www.deu.ac.kr/www/scheduleList.do')
        } else {
          // 문서가 없으면 빈 배열
          console.log('학사일정 문서가 없습니다.')
          setSchedules([])
        }
      } catch (err) {
        // 에러 발생 시 빈 배열
        console.error('학사일정 로드 실패:', err)
        setError('학사일정을 불러오지 못했습니다.')
        setSchedules([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAcademicSchedule()
  }, [])

  return {
    schedules,
    url,
    isLoading,
    error,
  }
}
