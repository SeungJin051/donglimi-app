import { useMemo } from 'react'

import { NOTIFICATION_KEYWORDS } from '@/constants/keyword'
import { Scrap } from '@/store/scrapStore'
import { getTimeMs } from '@/utils/dateUtils'

type SortOption = 'latest' | 'oldest'

interface UseFilteredAndSortedScrapsProps {
  scraps: Scrap[]
  sortBy: SortOption
  selectedKeywords: Set<string>
}

export const useFilteredAndSortedScraps = ({
  scraps,
  sortBy,
  selectedKeywords,
}: UseFilteredAndSortedScrapsProps) => {
  return useMemo(() => {
    let result = [...scraps]

    // 키워드 필터링
    if (selectedKeywords.size > 0) {
      result = result.filter((scrap) =>
        Array.from(selectedKeywords).some((keywordKey) => {
          // '기타' 키워드인 경우 특별 처리
          if (keywordKey === 'etc') {
            // tags에 다른 키워드가 없는 경우만 포함
            return !Object.entries(NOTIFICATION_KEYWORDS)
              .filter(([key]) => key !== 'etc')
              .some(([, value]) =>
                value.keywords.some((kw) => scrap.notice.tags.includes(kw))
              )
          }

          const keywordData =
            NOTIFICATION_KEYWORDS[
              keywordKey as keyof typeof NOTIFICATION_KEYWORDS
            ]
          // 해당 키워드 카테고리의 keywords 배열 중 하나라도 태그에 포함되어 있는지 확인
          return keywordData.keywords.some((kw) =>
            scrap.notice.tags.includes(kw)
          )
        })
      )
    }

    // 정렬
    if (sortBy === 'latest') {
      result.sort(
        (a, b) => getTimeMs(b.notice.saved_at) - getTimeMs(a.notice.saved_at)
      )
    } else if (sortBy === 'oldest') {
      result.sort(
        (a, b) => getTimeMs(a.notice.saved_at) - getTimeMs(b.notice.saved_at)
      )
    }

    return result
  }, [scraps, sortBy, selectedKeywords])
}
