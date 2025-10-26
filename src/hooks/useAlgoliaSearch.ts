import { useState } from 'react'

import {
  searchClient,
  NOTICES_INDEX,
  searchConfig,
} from '@/config/algoliaConfig'
import { Notice } from '@/types/notice.type'

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
  const [searchResults, setSearchResults] = useState<Notice[]>([]) // 검색 결과 배열
  const [isLoading, setIsLoading] = useState(false) // 검색 API 로딩 상태
  const [error, setError] = useState<string | null>(null) // 검색 중 발생한 에러

  /**
   * Algolia 검색을 비동기적으로 수행하는 메인 함수
   * @param query - 사용자가 입력한 검색어
   */
  const search = async (query: string) => {
    // 검색어가 비어있으면 상태를 초기화하고 즉시 종료
    if (!query.trim()) {
      setSearchResults([])
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Algolia 검색 파라미터 설정
      const searchParams = {
        query: query.trim(),
        hitsPerPage: searchConfig.hitsPerPage,
        attributesToRetrieve: searchConfig.attributesToRetrieve,
      }

      // Algolia 검색 API 호출
      const response = await searchClient.search({
        requests: [
          {
            indexName: NOTICES_INDEX,
            ...searchParams,
          },
        ],
      })

      // Algolia는 여러 인덱스를 동시에 검색할 수 있으므로, 응답이 배열(results)로 옵니다.
      // 인덱스 하나만 검색했으므로 첫 번째 결과(results[0])를 사용합니다.
      const result = response.results[0]
      if (!result) {
        setSearchResults([])
        return
      }

      // 검색 결과를 Notice[] 타입으로 변환
      if ('hits' in result) {
        setSearchResults(result.hits as unknown as Notice[])
      } else {
        setSearchResults([])
      }
    } catch (err) {
      // 에러 핸들링
      console.error('Algolia search error:', err)
      setError(
        err instanceof Error ? err.message : '검색 중 오류가 발생했습니다.'
      )
      setSearchResults([]) // 에러 발생 시 결과 목록 비우기
    } finally {
      // API 요청이 성공하든 실패하든 항상 로딩 상태를 해제합니다.
      setIsLoading(false)
    }
  }

  // 모든 검색 상태(결과, 에러, 로딩)를 초기화합니다.
  const clearResults = () => {
    setSearchResults([])
    setError(null)
    setIsLoading(false)
  }

  // 컴포넌트에서 사용할 상태와 함수들을 객체로 내보냅니다.
  return {
    searchResults,
    isLoading,
    error,
    search,
    clearResults,
  }
}
