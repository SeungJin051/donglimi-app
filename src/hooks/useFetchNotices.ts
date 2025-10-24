import { useInfiniteQuery } from '@tanstack/react-query'
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  startAfter,
  DocumentData,
} from 'firebase/firestore'

import { db } from '@/config/firebaseConfig'
import { useCategoryFilterStore } from '@/store/categoryFilterStore'
import { Notice } from '@/types/notice.type'

// Firestore에서 공지사항 데이터를 가져오는 함수 (페이지네이션 지원)
const fetchNoticesFromFirestore = async ({
  pageParam,
  category,
  limitCount = 10,
}: {
  pageParam?: DocumentData
  category?: string
  limitCount?: number
}): Promise<{ notices: Notice[]; nextCursor?: DocumentData }> => {
  const noticesCollectionRef = collection(db, 'notices')

  // 선택된 카테고리가 있으면 필터링 조건과 함께 쿼리 구성
  let q
  if (category) {
    // 카테고리 필터링 where + orderBy 조합
    if (pageParam) {
      // 다음 페이지인 경우 startAfter 사용
      q = query(
        noticesCollectionRef,
        where('department', '==', category),
        orderBy('saved_at', 'desc'),
        startAfter(pageParam),
        limit(limitCount)
      )
    } else {
      // 첫 페이지인 경우
      q = query(
        noticesCollectionRef,
        where('department', '==', category),
        orderBy('saved_at', 'desc'),
        limit(limitCount)
      )
    }
  } else {
    if (pageParam) {
      // 다음 페이지인 경우 startAfter 사용
      q = query(
        noticesCollectionRef,
        orderBy('saved_at', 'desc'),
        startAfter(pageParam),
        limit(limitCount)
      )
    } else {
      // 첫 페이지인 경우
      q = query(
        noticesCollectionRef,
        orderBy('saved_at', 'desc'),
        limit(limitCount)
      )
    }
  }

  const querySnapshot = await getDocs(q)

  // Firestore에서 가져온 데이터를 Notice[] 타입으로 변환합니다.
  const notices = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    content_hash: doc.id, // 문서 ID를 content_hash로 사용 (고유성 보장)
  })) as Notice[]

  // 다음 페이지가 있는지 확인 (마지막 문서를 nextCursor로 반환)
  const nextCursor =
    querySnapshot.docs.length === limitCount
      ? querySnapshot.docs[querySnapshot.docs.length - 1]
      : undefined

  return { notices, nextCursor }
}

/**
 * Firestore의 'notice' 컬렉션에서 공지사항 목록을 가져오는 커스텀 훅 (무한스크롤 지원)
 * 캐싱과 자동 리프레시 기능이 포함되어 Firestore 읽기 수를 대폭 줄임
 *
 * @param limitCount - 한 번에 가져올 공지사항 수 (기본값: 10)
 * @returns React Query의 useInfiniteQuery 결과 객체
 */
export const useFetchNotices = (limitCount = 10) => {
  // 선택된 카테고리 상태 가져오기
  const { selectedCategory } = useCategoryFilterStore()

  return useInfiniteQuery({
    // 쿼리 키: 카테고리가 변경될 때마다 다른 쿼리로 인식
    queryKey: ['notices', selectedCategory || undefined],

    // 실제 데이터를 가져오는 함수
    queryFn: async ({ pageParam }) => {
      const result = await fetchNoticesFromFirestore({
        pageParam,
        category: selectedCategory || undefined,
        limitCount,
      })

      return result
    },

    // 초기 페이지 파라미터 (undefined는 첫 페이지)
    initialPageParam: undefined as DocumentData | undefined,

    // 다음 페이지 파라미터를 결정하는 함수
    getNextPageParam: (lastPage) => lastPage.nextCursor,

    // 캐시 설정
    staleTime: 10 * 60 * 1000, // 10분

    // 가비지 컬렉션 시간
    gcTime: 30 * 60 * 1000, // 30분

    // 캐시가 있으면 사용 (queryClient 설정과 통일)
    refetchOnMount: false,

    // 앱 포커스 시 리페치 방지 (배터리 절약)
    refetchOnWindowFocus: false,

    // 네트워크 재연결 시 리페치 방지
    refetchOnReconnect: false,
  })
}
