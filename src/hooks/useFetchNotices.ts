import { useState, useEffect } from 'react'

import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore'

import { db } from '@/config/firebaseConfig'

// Notice 데이터의 타입을 정의합니다.
export interface Notice {
  id: string // Firestore 문서 ID는 string 타입입니다.
  bookmark_count: number
  category: string
  comment_count: number
  content_hash: string
  created_at: Timestamp
  department: string
  like_count: number
  link: string
  posted_at: string
  posted_at_text: string
  posted_at_ts: Timestamp
  source_host: string
  source_type: string
  tags: string[] // 문자열 배열 타입
  target_id: string
  title: string
  updated_at: Timestamp
}

/**
 * Firestore의 'notice' 컬렉션에서 공지사항 목록을 가져오는 커스텀 훅
 * @returns {{notices: Notice[], loading: boolean, error: Error|null}}
 */
export const useFetchNotices = (initialLimit = 20) => {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchNoticesData = async () => {
      try {
        const noticesCollectionRef = collection(db, 'notices')
        const q = query(
          noticesCollectionRef,
          orderBy('created_at', 'desc'),
          limit(initialLimit)
        )
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
  }, [initialLimit])

  return { notices, loading, error }
}
