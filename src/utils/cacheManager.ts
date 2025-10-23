import { useQueryClient } from '@tanstack/react-query'

import { Notice } from '@/types/notice.type'

// 캐시 관리를 위한 커스텀 훅
export const useCacheManager = () => {
  const queryClient = useQueryClient()

  // 특정 쿼리 캐시 무효화
  const invalidateNotices = (category?: string) => {
    return queryClient.invalidateQueries({
      queryKey: ['notices', category],
    })
  }

  // 모든 공지사항 쿼리 무효화
  const invalidateAllNotices = () => {
    return queryClient.invalidateQueries({
      queryKey: ['notices'],
    })
  }

  // 특정 쿼리 데이터 새로고침
  const refetchNotices = (category?: string) => {
    return queryClient.refetchQueries({
      queryKey: ['notices', category],
    })
  }

  // 캐시에서 특정 데이터 제거
  const removeNoticesCache = (category?: string) => {
    return queryClient.removeQueries({
      queryKey: ['notices', category],
    })
  }

  // 캐시 데이터 가져오기 (디버깅용)
  const getNoticesCache = (category?: string) => {
    return queryClient.getQueryData(['notices', category])
  }

  // 캐시 상태 확인
  const getNoticesQueryState = (category?: string) => {
    return queryClient.getQueryState(['notices', category])
  }

  // 강제 데이터 업데이트 (백그라운드에서 최신 데이터 가져오기)
  const prefetchNotices = async (category?: string, limitCount = 20) => {
    await queryClient.prefetchQuery({
      queryKey: ['notices', category, limitCount],
      queryFn: async () => {
        // 실제 Firestore 호출 대신 기존 함수 재사용
        const { collection, getDocs, query, orderBy, limit, where } =
          await import('firebase/firestore')
        const { db } = await import('@/config/firebaseConfig')

        const noticesCollectionRef = collection(db, 'notices')
        let q

        if (category) {
          q = query(
            noticesCollectionRef,
            where('department', '==', category),
            orderBy('saved_at', 'desc'),
            limit(limitCount)
          )
        } else {
          q = query(
            noticesCollectionRef,
            orderBy('saved_at', 'desc'),
            limit(limitCount)
          )
        }

        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map((doc) => ({
          content_hash: doc.id,
          ...doc.data(),
        })) as Notice[]
      },
      staleTime: 10 * 60 * 1000,
    })
  }

  return {
    invalidateNotices,
    invalidateAllNotices,
    refetchNotices,
    removeNoticesCache,
    getNoticesCache,
    getNoticesQueryState,
    prefetchNotices,
  }
}

// 캐시 설정 상수들
export const CACHE_KEYS = {
  NOTICES: 'notices',
  CATEGORIES: 'categories',
  USER: 'user',
} as const

export const CACHE_TIMES = {
  NOTICES: 5 * 60 * 1000, // 5분
  CATEGORIES: 60 * 60 * 1000, // 1시간
  USER: 30 * 60 * 1000, // 30분
} as const
