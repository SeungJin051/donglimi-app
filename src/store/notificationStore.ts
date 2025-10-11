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
  notificationEnabled: true,
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
        set((state) => ({
          selectedKeywords: state.selectedKeywords.includes(keyword)
            ? state.selectedKeywords.filter((k) => k !== keyword)
            : [...state.selectedKeywords, keyword],
        })),

      // 키워드 배열 설정
      setSelectedKeywords: (keywords) => set({ selectedKeywords: keywords }),

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
    }
  )
)
