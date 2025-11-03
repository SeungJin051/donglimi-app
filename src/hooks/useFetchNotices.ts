import { useInfiniteQuery } from '@tanstack/react-query'
import { Timestamp } from 'firebase/firestore'

import {
  NOTICES_INDEX,
  searchClient,
  searchConfig,
} from '@/config/algoliaConfig'
import { useCategoryFilterStore } from '@/store/categoryFilterStore'
import { Notice } from '@/types/notice.type'

// Algolia 히트 타입 정의
type Hit = {
  saved_at_ms?: number
  saved_at?: string | number
  published_at_ms?: number
  published_at?: string | number
  category?: string
  content_hash?: string
  target_id?: string // Firestore 문서 ID
  objectID: string
  department?: string // 필터링에 사용되는 필드
  link?: string
  scrap_count?: number
  tags?: string[]
  title?: string
}

// Algolia에서 공지사항 데이터를 가져오는 함수 (페이지네이션: page 기반)
const fetchNoticesFromAlgolia = async ({
  page = 0,
  category,
  hitsPerPage = 10,
}: {
  page?: number
  category?: string
  hitsPerPage?: number
}): Promise<{ notices: Notice[]; nextPage?: number; nbPages: number }> => {
  let facetFilters: string[][] | undefined = undefined

  // 서버 측 필터링(`facetFilters`) 사용으로 로직 간소화
  if (category) {
    // Algolia는 필터링을 위해 배열의 배열 형태를 사용하며,
    // department 필드를 패싯(Facet)으로 설정해야 함.
    // department 필드의 값이 category와 일치하는 항목만 필터링합니다.
    facetFilters = [[`department:${category}`]]
  }

  // Algolia 검색 요청 (facetFilters 적용)
  const response = await searchClient.search({
    requests: [
      {
        indexName: NOTICES_INDEX,
        query: '',
        page,
        hitsPerPage: hitsPerPage,
        facetFilters,
        attributesToRetrieve: searchConfig.attributesToRetrieve,
      },
    ],
  })

  const result = response.results[0] as unknown as {
    hits: Hit[]
    page: number
    nbPages: number
    nbHits: number
  }

  const hits = Array.isArray(result?.hits) ? result.hits : []

  // Hit을 Notice 타입으로 변환 (Timestamp 로직 간소화)
  const notices: Notice[] = hits.map((hit: Hit) => {
    // saved_at_ms, saved_at, published_at_ms, published_at 순으로 유효성 검사
    const savedAtVal =
      hit.saved_at_ms ?? hit.saved_at ?? hit.published_at_ms ?? hit.published_at

    let savedAtMs: number

    if (typeof savedAtVal === 'number') {
      savedAtMs = savedAtVal
    } else if (typeof savedAtVal === 'string' && savedAtVal) {
      // 유효한 문자열 날짜를 Date 객체로 변환
      savedAtMs = new Date(savedAtVal).getTime()
    } else {
      // 유효한 값이 없는 경우 현재 시각 사용
      savedAtMs = Date.now()
    }

    // Timestamp 생성 (유효한 숫자형태인지 확인)
    const timestamp = Timestamp.fromMillis(
      Number.isFinite(savedAtMs) ? savedAtMs : Date.now()
    )

    return {
      category: hit.category ?? '',
      content_hash: hit.content_hash ?? hit.objectID,
      department: hit.department ?? '',
      link: hit.link ?? '',
      saved_at: timestamp,
      scrap_count: hit.scrap_count ?? 0,
      tags: Array.isArray(hit.tags) ? hit.tags : [],
      title: hit.title ?? '',
      target_id: hit.target_id, // Firestore 문서 ID (있으면 포함)
    }
  })

  // 다음 페이지 번호 계산
  const nextPage =
    result.page + 1 < result.nbPages ? result.page + 1 : undefined

  // Algolia 서버가 필터링을 처리했으므로, 클라이언트 측 로직 없이 서버 결과를 그대로 반환
  return { notices, nextPage, nbPages: result.nbPages }
}

export const useFetchNotices = (limitCount = 10) => {
  const { selectedCategory } = useCategoryFilterStore()

  return useInfiniteQuery({
    queryKey: ['notices_algolia', selectedCategory || undefined, limitCount],
    queryFn: async ({ pageParam }) => {
      const page = typeof pageParam === 'number' ? pageParam : 0
      const result = await fetchNoticesFromAlgolia({
        page,
        category: selectedCategory || undefined,
        hitsPerPage: limitCount,
      })
      return result
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
