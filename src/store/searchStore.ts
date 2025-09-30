import { create } from 'zustand'

import { Subscription } from '@/types/category.type'

interface SearchState {
  searchHistory: Subscription['name'][]
  addHistory: (searchTerm: string) => void
  removeHistory: (searchTerm: string) => void
  clearHistory: () => void
}

export const useSearchStore = create<SearchState>((set) => ({
  searchHistory: [],
  addHistory: (searchTerm) => {
    // 빈 문자열은 추가하지 않음
    if (!searchTerm.trim()) return

    set((state) => {
      // 이미 검색 기록에 있다면 추가하지 않음
      if (state.searchHistory.includes(searchTerm)) {
        return state // 상태 변경 없음
      }

      // 최신 검색어가 맨 앞에 오도록
      return { searchHistory: [searchTerm, ...state.searchHistory] }
    })
  },
  removeHistory: (searchTerm) => {
    set((state) => ({
      // 해당 검색어를 제외한 나머지 검색어를 반환
      searchHistory: state.searchHistory.filter((item) => item !== searchTerm),
    }))
  },
  clearHistory: () => {
    set({ searchHistory: [] })
  },
}))
