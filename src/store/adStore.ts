import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface AdState {
  todayAdCount: number
  lastAdDate: string | null
  linkOpenCount: number
  appLaunchCount: number // 앱 실행 횟수
  tabSwitchCount: number // 탭 전환 횟수
  scrapActionCount: number // 스크랩 액션 횟수
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
  increaseCount: () => void
  incrementLinkCount: () => void
  incrementAppLaunchCount: () => void
  incrementTabSwitchCount: () => void
  incrementScrapActionCount: () => void
  resetLinkCount: () => void
  resetIfDateChanged: () => void
}

export const useAdStore = create(
  persist<AdState>(
    (set, get) => ({
      todayAdCount: 0,
      lastAdDate: null,
      linkOpenCount: 0,
      appLaunchCount: 0,
      tabSwitchCount: 0,
      scrapActionCount: 0,
      _hasHydrated: false,

      setHasHydrated: (state) => {
        set({ _hasHydrated: state })
      },

      increaseCount: () => {
        const current = get().todayAdCount
        if (current < 10) {
          // 하루 최대 광고 수 증가
          set({ todayAdCount: current + 1 })
        }
      },

      incrementLinkCount: () => {
        set({ linkOpenCount: get().linkOpenCount + 1 })
      },

      incrementAppLaunchCount: () => {
        set({ appLaunchCount: get().appLaunchCount + 1 })
      },

      incrementTabSwitchCount: () => {
        set({ tabSwitchCount: get().tabSwitchCount + 1 })
      },

      incrementScrapActionCount: () => {
        set({ scrapActionCount: get().scrapActionCount + 1 })
      },

      resetLinkCount: () => {
        set({ linkOpenCount: 0 })
      },

      resetIfDateChanged: () => {
        try {
          const state = get()

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
              appLaunchCount: 0,
              tabSwitchCount: 0,
              scrapActionCount: 0,
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
      onRehydrateStorage: () => (state) => {
        console.log('Store hydration complete')
        state?.setHasHydrated(true)
      },
    }
  )
)
