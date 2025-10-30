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
  objectID: string
  department?: string
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
  const filters = category ? `department:"${category}"` : undefined

  const response = await searchClient.search({
    requests: [
      {
        indexName: NOTICES_INDEX,
        query: '',
        page,
        hitsPerPage,
        filters,
        attributesToRetrieve: searchConfig.attributesToRetrieve,
      },
    ],
  })

  const result = response.results[0] as unknown as {
    hits: Hit[]
    page: number
    nbPages: number
  }

  const hits = Array.isArray(result?.hits) ? result.hits : []
  const notices: Notice[] = hits.map((hit: Hit) => {
    const savedAtVal =
      hit.saved_at_ms ?? hit.saved_at ?? hit.published_at_ms ?? hit.published_at
    const savedAtMs =
      typeof savedAtVal === 'number'
        ? savedAtVal
        : new Date((savedAtVal as string | undefined) ?? 0).getTime()
    return {
      category: hit.category ?? '',
      content_hash: hit.content_hash ?? hit.objectID,
      department: hit.department ?? '',
      link: hit.link ?? '',
      saved_at: Timestamp.fromMillis(
        Number.isFinite(savedAtMs) ? savedAtMs : Date.now()
      ),
      scrap_count: hit.scrap_count ?? 0,
      tags: Array.isArray(hit.tags) ? hit.tags : [],
      title: hit.title ?? '',
    }
  })

  const nextPage =
    result.page + 1 < result.nbPages ? result.page + 1 : undefined
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
