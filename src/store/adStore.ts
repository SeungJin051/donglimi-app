import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface AdState {
  todayAdCount: number // 오늘 노출 횟수
  lastAdDate: string | null // 마지막 광고 날짜
  linkOpenCount: number // 링크 열람 횟수 (세션 단위)
  increaseCount: () => void // 카운트 증가
  incrementLinkCount: () => void // 링크 카운트 증가
  resetLinkCount: () => void // 링크 카운트 리셋
  resetIfDateChanged: () => void // 날짜 변경 시 리셋
}

// 광고 상태 영구 저장
export const useAdStore = create(
  persist<AdState>(
    (set, get) => ({
      todayAdCount: 0,
      lastAdDate: null,
      linkOpenCount: 0,

      // 오늘 카운트 증가
      increaseCount: () => {
        const current = get().todayAdCount
        if (current < 3) {
          set({ todayAdCount: current + 1 })
        }
      },

      // 링크 열람 횟수 증가
      incrementLinkCount: () => {
        set({ linkOpenCount: get().linkOpenCount + 1 })
      },

      // 링크 카운트 리셋 (세션 변경 시)
      resetLinkCount: () => {
        set({ linkOpenCount: 0 })
      },

      // 날짜 변경 체크 및 리셋
      resetIfDateChanged: () => {
        const today = new Date().toDateString()
        const lastDate = get().lastAdDate

        if (lastDate !== today) {
          set({
            todayAdCount: 0,
            lastAdDate: today,
          })
        }
      },
    }),
    {
      name: 'ad-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
