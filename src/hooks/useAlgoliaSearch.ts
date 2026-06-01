import { useState } from 'react'

import {
  searchClient,
  NOTICES_INDEX,
  searchConfig,
} from '@/config/algoliaConfig'
import { Notice } from '@/types/notice.type'
import { mapAlgoliaHitsToNotices } from '@/utils/noticeMappers'

/**
 * Algolia 검색을 위한 React Custom Hook
 * @returns {UseAlgoliaSearchReturn} 검색 결과, 로딩 상태, 에러,
 * 검색 실행 함수(search), 결과 초기화 함수(clearResults)를 반환합니다.
 */
interface UseAlgoliaSearchReturn {
  searchResults: Notice[]
  isLoading: boolean
  error: string | null
  search: (query: string) => Promise<void>
  clearResults: () => void
}

export const useAlgoliaSearch = (): UseAlgoliaSearchReturn => {
  const [searchResults, setSearchResults] = useState<Notice[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const searchParams = {
        query: query.trim(),
        hitsPerPage: searchConfig.hitsPerPage,
        attributesToRetrieve: searchConfig.attributesToRetrieve,
      }

      const response = await searchClient.search({
        requests: [
          {
            indexName: NOTICES_INDEX,
            ...searchParams,
          },
        ],
      })

      const result = response.results[0]
      if (!result) {
        setSearchResults([])
        return
      }

      if ('hits' in result && Array.isArray(result.hits)) {
        setSearchResults(mapAlgoliaHitsToNotices(result.hits))
      } else {
        setSearchResults([])
      }
    } catch (err) {
      console.error('Algolia search error:', err)
      setError(
        err instanceof Error ? err.message : '검색 중 오류가 발생했습니다.'
      )
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const clearResults = () => {
    setSearchResults([])
    setError(null)
    setIsLoading(false)
  }

  return {
    searchResults,
    isLoading,
    error,
    search,
    clearResults,
  }
}
