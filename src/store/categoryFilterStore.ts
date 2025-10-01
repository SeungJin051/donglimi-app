import { create } from 'zustand'

// 카테고리 필터 타입 정의
export type CategoryFilter = string | null // 선택된 카테고리, null이면 전체

// 카테고리 필터 상태 인터페이스
export interface CategoryFilterState {
  selectedCategory: CategoryFilter
  setSelectedCategory: (category: string) => void
  clearCategory: () => void
}

// Zustand 스토어 생성
export const useCategoryFilterStore = create<CategoryFilterState>((set) => ({
  selectedCategory: null, // 선택된 카테고리 (null이면 전체 공지사항)
  setSelectedCategory: (category: string) =>
    set({ selectedCategory: category }),
  clearCategory: () => set({ selectedCategory: null }),
}))
