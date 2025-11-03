import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { NotificationSettings } from '@/types/notification.type'

// 스토어에 보관할 상태와 함수의 타입을 정의합니다.
interface NotificationStore extends NotificationSettings {
  // 알림 설정 전체 업데이트
  setNotificationSettings: (settings: NotificationSettings) => void
  // 단과대학 선택
  setSelectedCollege: (college: string | null) => void
  // 학과 선택
  setSelectedDepartment: (department: string | null) => void
  // 키워드 토글
  toggleKeyword: (keyword: string) => void
  // 키워드 배열 설정
  setSelectedKeywords: (keywords: string[]) => void
  // 알림 활성화 토글
  setNotificationEnabled: (enabled: boolean) => void
  // 모든 설정 초기화
  resetSettings: () => void
}

// 초기 상태
const initialState: NotificationSettings = {
  selectedCollege: null,
  selectedDepartment: null,
  selectedKeywords: [],
  notificationEnabled: false,
}

// Zustand 스토어 생성 (persist 미들웨어로 AsyncStorage에 자동 저장)
export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      ...initialState,

      // 알림 설정 전체 업데이트
      setNotificationSettings: (settings) => set(settings),

      // 단과대학 선택
      setSelectedCollege: (college) =>
        set({ selectedCollege: college, selectedDepartment: null }),

      // 학과 선택
      setSelectedDepartment: (department) =>
        set({ selectedDepartment: department }),

      // 키워드 토글 (있으면 제거, 없으면 추가)
      toggleKeyword: (keyword) =>
        set((state) => {
          const currentKeywords = Array.isArray(state.selectedKeywords)
            ? state.selectedKeywords
            : []
          return {
            selectedKeywords: currentKeywords.includes(keyword)
              ? currentKeywords.filter((k) => k !== keyword)
              : [...currentKeywords, keyword],
          }
        }),

      // 키워드 배열 설정
      setSelectedKeywords: (keywords) =>
        set({ selectedKeywords: Array.isArray(keywords) ? keywords : [] }),

      // 알림 활성화 토글
      setNotificationEnabled: (enabled) =>
        set({ notificationEnabled: enabled }),

      // 모든 설정 초기화
      resetSettings: () => set(initialState),
    }),
    {
      name: 'notification-storage', // AsyncStorage 키
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedCollege: state.selectedCollege,
        selectedDepartment: state.selectedDepartment,
        selectedKeywords: state.selectedKeywords,
        notificationEnabled: state.notificationEnabled,
      }),
      // 데이터 복원 시 유효성 검증
      migrate: (persistedState: any) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return initialState
        }
        return {
          selectedCollege: persistedState.selectedCollege ?? null,
          selectedDepartment: persistedState.selectedDepartment ?? null,
          selectedKeywords: Array.isArray(persistedState.selectedKeywords)
            ? persistedState.selectedKeywords
            : [],
          notificationEnabled:
            typeof persistedState.notificationEnabled === 'boolean'
              ? persistedState.notificationEnabled
              : false,
        }
      },
    }
  )
)
