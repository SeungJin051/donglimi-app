import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface AdState {
  todayAdCount: number
  lastAdDate: string | null
  linkOpenCount: number
  _hasHydrated: boolean // hydration 상태 추적
  setHasHydrated: (state: boolean) => void // 추가
  increaseCount: () => void
  incrementLinkCount: () => void
  resetLinkCount: () => void
  resetIfDateChanged: () => void
}

export const useAdStore = create(
  persist<AdState>(
    (set, get) => ({
      todayAdCount: 0,
      lastAdDate: null,
      linkOpenCount: 0,
      _hasHydrated: false, // 추가

      // hydration 상태 설정
      setHasHydrated: (state) => {
        set({ _hasHydrated: state })
      },

      increaseCount: () => {
        const current = get().todayAdCount
        if (current < 3) {
          set({ todayAdCount: current + 1 })
        }
      },

      incrementLinkCount: () => {
        set({ linkOpenCount: get().linkOpenCount + 1 })
      },

      resetLinkCount: () => {
        set({ linkOpenCount: 0 })
      },

      resetIfDateChanged: () => {
        try {
          const state = get()

          // hydrate 전이면 실행하지 않음
          if (!state._hasHydrated) {
            console.log('Store not hydrated yet, skipping resetIfDateChanged')
            return
          }

          const today = new Date().toDateString()
          const lastDate = state.lastAdDate

          if (lastDate !== today) {
            set({
              todayAdCount: 0,
              lastAdDate: today,
            })
          }
        } catch (error) {
          console.error('resetIfDateChanged error:', error)
        }
      },
    }),
    {
      name: 'ad-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // hydration 완료 후 콜백
      onRehydrateStorage: () => (state) => {
        console.log('Store hydration complete')
        state?.setHasHydrated(true)
      },
    }
  )
)
