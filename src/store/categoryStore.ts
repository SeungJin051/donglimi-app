import { create } from 'zustand'

import { Subscription } from '@/types/category.type'

// 스토어에 보관할 상태와 함수의 타입을 정의합니다.
interface CategoryStore {
  subscribedCategories: Subscription[]
  setSubscribedCategories: (categories: Subscription[]) => void
}

// creat 함수를 사용해 스토어를 생성합니다.
export const useCategoryStore = create<CategoryStore>((set) => ({
  // 초기 상태
  subscribedCategories: [],
  // setSubscribedCategories 함수를 정의하여 상태를 업데이트합니다.
  setSubscribedCategories: (categories) =>
    // 스토어의 subscribedCategories 상태를 입력으로 받은 categories 배열로 완전히 덮어써라
    set({ subscribedCategories: categories }),
}))
