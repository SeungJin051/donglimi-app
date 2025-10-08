import { useQuery } from '@tanstack/react-query'
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

// Firestore에서 공지사항 데이터를 가져오는 함수
const fetchNoticesFromFirestore = async (
  category?: string,
  limitCount = 20
): Promise<Notice[]> => {
  const noticesCollectionRef = collection(db, 'notices')

  // 선택된 카테고리가 있으면 필터링 조건과 함께 쿼리 구성
  let q
  if (category) {
    // 카테고리 필터 사용 시 orderBy 제거 (복합 인덱스 필요 문제 해결)
    q = query(
      noticesCollectionRef,
      where('department', '==', category),
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

  // Firestore에서 가져온 데이터를 Notice[] 타입으로 변환합니다.
  const notices = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    content_hash: doc.id, // 문서 ID를 content_hash로 사용 (고유성 보장)
  })) as Notice[]

  // 카테고리 필터 사용 시 클라이언트 사이드에서 정렬
  if (category && notices.length > 0) {
    return notices.sort((a, b) => {
      const aTime = a.saved_at?.seconds || 0
      const bTime = b.saved_at?.seconds || 0
      return bTime - aTime // 내림차순 (최신순)
    })
  }

  return notices
}

/**
 * Firestore의 'notice' 컬렉션에서 공지사항 목록을 가져오는 커스텀 훅 (React Query 버전)
 * 캐싱과 자동 리프레시 기능이 포함되어 Firestore 읽기 수를 대폭 줄임
 *
 * @param limitCount - 가져올 공지사항 수 (기본값: 20)
 * @returns React Query의 useQuery 결과 객체
 */
export const useFetchNotices = (limitCount = 20) => {
  // 선택된 카테고리 상태 가져오기
  const { selectedCategory } = useCategoryFilterStore()

  return useQuery({
    // 쿼리 키: 카테고리가 변경될 때마다 다른 쿼리로 인식
    queryKey: ['notices', selectedCategory || undefined, limitCount],

    // 실제 데이터를 가져오는 함수
    queryFn: async () => {
      const result = await fetchNoticesFromFirestore(
        selectedCategory || undefined,
        limitCount
      )

      return result
    },

    // 캐시 설정: 5분간 fresh 상태 유지 (이 시간 동안은 Firestore 호출 안 함)
    staleTime: 5 * 60 * 1000, // 5분

    // 가비지 컬렉션 시간: 10분간 메모리에 캐시 유지
    gcTime: 10 * 60 * 1000, // 10분

    // 선택된 카테고리가 변경될 때만 리페치
    refetchOnMount: false,

    // 앱 포커스 시 리페치 방지 (배터리 절약)
    refetchOnWindowFocus: false,

    // 네트워크 재연결 시 리페치 방지
    refetchOnReconnect: false,
  })
}
