import { useState, useEffect } from 'react'

import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
} from 'firebase/firestore'

import { db } from '@/config/firebaseConfig'
import { useCategoryFilterStore } from '@/store/categoryFilterStore'
import { Notice } from '@/types/notice.type'

/**
 * Firestore의 'notice' 컬렉션에서 공지사항 목록을 가져오는 커스텀 훅
 * @returns {{notices: Notice[], loading: boolean, error: Error|null}}
 */
export const useFetchNotices = (initialLimit = 20) => {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  // 선택된 카테고리 상태 가져오기
  const { selectedCategory } = useCategoryFilterStore()

  useEffect(() => {
    const fetchNoticesData = async () => {
      try {
        const noticesCollectionRef = collection(db, 'notices')

        // 선택된 카테고리가 있으면 필터링 조건과 함께 쿼리 구성
        let q
        if (selectedCategory) {
          q = query(
            noticesCollectionRef,
            where('department', '==', selectedCategory),
            orderBy('created_at', 'desc'),
            limit(initialLimit)
          )
        } else {
          q = query(
            noticesCollectionRef,
            orderBy('created_at', 'desc'),
            limit(initialLimit)
          )
        }
        const querySnapshot = await getDocs(q)

        // Firestore에서 가져온 데이터를 Notice[] 타입으로 변환합니다.
        const noticesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Notice[]

        setNotices(noticesData)
      } catch (err) {
        console.error('공지사항 데이터를 불러오는 중 오류 발생:', err)
        if (err instanceof Error) {
          setError(err)
        } else {
          setError(new Error('An unknown error occurred'))
        }
      } finally {
        setLoading(false)
      }
    }

    fetchNoticesData()
  }, [initialLimit, selectedCategory])

  return { notices, loading, error }
}
