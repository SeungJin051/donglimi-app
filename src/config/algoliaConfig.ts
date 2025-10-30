import { algoliasearch } from 'algoliasearch'

const ALGOLIA_APPLICATION_ID = process.env.EXPO_PUBLIC_ALGOLIA_APPLICATION_ID
const ALGOLIA_SEARCH_ONLY_API_KEY =
  process.env.EXPO_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY

if (!ALGOLIA_APPLICATION_ID || !ALGOLIA_SEARCH_ONLY_API_KEY) {
  throw new Error('Algolia 환경변수가 존재하지 않습니다.')
}

// Algolia 클라이언트 초기화
export const searchClient = algoliasearch(
  ALGOLIA_APPLICATION_ID,
  ALGOLIA_SEARCH_ONLY_API_KEY
)

// 인덱스 이름 (실제 Algolia 대시보드에서 설정한 인덱스 이름)
export const NOTICES_INDEX = 'notices'

// 검색 설정
export const searchConfig = {
  hitsPerPage: 20,
  attributesToRetrieve: ['*'],
  attributesToHighlight: ['title', 'content', 'department', 'tags'],
  highlightPreTag: '<mark>',
  highlightPostTag: '</mark>',
}
