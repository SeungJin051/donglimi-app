import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { Notice } from '@/types/notice.type'

// 스크랩 아이템의 타입을 정의합니다.
export interface Scrap {
  notice: Notice
}

// 스크랩 스토어의 상태와 함수의 타입을 정의합니다.
export interface ScrapState {
  scraps: Scrap[] // 스크랩한 공지사항 목록
  sortPreference: 'latest' | 'oldest' // 정렬 기본값
  addScrap: (scrap: Scrap) => void // 스크랩 추가 함수
  removeScrap: (scrap: Scrap) => void // 스크랩 삭제 함수
  setSortPreference: (sort: 'latest' | 'oldest') => void // 정렬 변경 함수
}

// create 함수를 사용해 스크랩 스토어를 생성합니다.
export const useScrapStore = create<ScrapState>()(
  persist(
    (set) => ({
      // 초기 상태
      scraps: [],
      sortPreference: 'latest',
      // addScrap 함수를 정의하여 새로운 스크랩을 추가합니다.
      addScrap: (scrap: Scrap) =>
        set((state) => ({ scraps: [...state.scraps, scrap] })),
      // removeScrap 함수를 정의하여 특정 스크랩을 삭제합니다.
      removeScrap: (scrap: Scrap) =>
        set((state) => ({
          // content_hash를 기준으로 해당 스크랩을 제외한 나머지만 유지
          scraps: state.scraps.filter(
            (s) => s.notice.content_hash !== scrap.notice.content_hash
          ),
        })),
      // 정렬 기본값 변경 함수
      setSortPreference: (sort) => set({ sortPreference: sort }),
    }),
    {
      name: 'scraps', // AsyncStorage 키
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
