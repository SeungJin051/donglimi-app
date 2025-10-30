import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import { PushNotificationItem } from '@/types/notification.type'

// 알림 조회 스코프: 전체/안읽음
export type NotificationScope = 'all' | 'unread'

// 페이지네이션 커서 메타정보
type CursorMeta = {
  lastCreatedAt?: number | null
  lastId?: string | null
}

// 스코프별 캐시 데이터 구조
type ScopeCache = {
  items: PushNotificationItem[] // 알림 아이템 배열
  cursor: CursorMeta // 페이지네이션 커서
  cachedAt: number | null // 캐시 시각 (ms)
}

// 알림 캐시 스토어 상태 및 액션
type NotificationCacheState = {
  token: string | null // FCM 토큰
  version: number // 캐시 버전
  scopes: Record<NotificationScope, ScopeCache> // 스코프별 캐시
  setToken: (token: string | null) => void // 토큰 설정
  hydrateScope: (scope: NotificationScope, data: Partial<ScopeCache>) => void // 스코프 부분 업데이트
  setScopeData: (
    scope: NotificationScope,
    items: PushNotificationItem[],
    cursor: CursorMeta,
    now?: number
  ) => void // 스코프 데이터 전체 교체
  appendScopeData: (
    scope: NotificationScope,
    items: PushNotificationItem[],
    cursor: CursorMeta,
    now?: number
  ) => void // 스코프 데이터 추가 (페이지네이션)
  updateItem: (
    scope: NotificationScope,
    id: string,
    patch: Partial<PushNotificationItem>
  ) => void // 특정 아이템 부분 업데이트
  removeItem: (scope: NotificationScope, id: string) => void // 특정 아이템 삭제
  clearAll: () => void // 전체 캐시 초기화
}

// 스코프 초기값 생성 함수
const initialScope = (): ScopeCache => ({
  items: [],
  cursor: { lastCreatedAt: null, lastId: null },
  cachedAt: null,
})

// 알림 캐시 스토어 (AsyncStorage 영구 저장)
export const useNotificationCacheStore = create<NotificationCacheState>()(
  persist(
    (set) => ({
      token: null,
      version: 1,
      scopes: {
        all: initialScope(),
        unread: initialScope(),
      },
      // 토큰 설정
      setToken: (token) => set({ token }),
      // 스코프 데이터 부분 하이드레이트 (SWR 패턴용)
      hydrateScope: (scope, data) =>
        set((state) => ({
          scopes: {
            ...state.scopes,
            [scope]: {
              items: data.items ?? state.scopes[scope].items,
              cursor: data.cursor ?? state.scopes[scope].cursor,
              cachedAt: data.cachedAt ?? state.scopes[scope].cachedAt,
            },
          },
        })),
      // 스코프 데이터 전체 교체 (초기 로드)
      setScopeData: (scope, items, cursor, now = Date.now()) =>
        set((state) => ({
          scopes: {
            ...state.scopes,
            [scope]: { items, cursor, cachedAt: now },
          },
        })),
      // 스코프 데이터 추가 (페이지네이션)
      appendScopeData: (scope, items, cursor, now = Date.now()) =>
        set((state) => ({
          scopes: {
            ...state.scopes,
            [scope]: {
              items: [...state.scopes[scope].items, ...items],
              cursor,
              cachedAt: now,
            },
          },
        })),
      // 특정 아이템 부분 업데이트 (읽음 처리 등)
      updateItem: (scope, id, patch) =>
        set((state) => ({
          scopes: {
            ...state.scopes,
            [scope]: {
              ...state.scopes[scope],
              items: state.scopes[scope].items.map((x) =>
                x.id === id ? { ...x, ...patch } : x
              ),
            },
          },
        })),
      // 특정 아이템 삭제
      removeItem: (scope, id) =>
        set((state) => ({
          scopes: {
            ...state.scopes,
            [scope]: {
              ...state.scopes[scope],
              items: state.scopes[scope].items.filter((x) => x.id !== id),
            },
          },
        })),
      // 전체 캐시 초기화
      clearAll: () =>
        set({
          token: null,
          scopes: { all: initialScope(), unread: initialScope() },
        }),
    }),
    {
      name: 'notification-cache-v1',
      storage: createJSONStorage(() => AsyncStorage),
      // 액션 함수는 제외하고 상태만 영구 저장
      partialize: (state) => ({
        token: state.token,
        version: state.version,
        scopes: state.scopes,
      }),
    }
  )
)
