import { QueryClient } from '@tanstack/react-query'

// 리액트 쿼리 클라이언트 설정
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 데이터가 fresh 상태로 유지되는 시간
      staleTime: 10 * 60 * 1000,

      // 캐시가 메모리에 유지되는 시간
      gcTime: 30 * 60 * 1000,

      // 재시도 설정
      retry: (failureCount, error) => {
        // 네트워크 에러의 경우만 재시도
        if (error?.message?.includes('network')) {
          return failureCount < 2 // 재시도 횟수 줄임
        }
        return false
      },

      // 캐시가 있으면 사용, 없으면 요청 (불필요한 재요청 방지)
      refetchOnMount: false,

      // 앱 포커스 시 리페치 방지 (배터리 절약)
      refetchOnWindowFocus: false,

      // 앱 백그라운드에서 돌아올 때 리페치 방지
      refetchOnReconnect: false,
    },
    mutations: {
      // 뮤테이션 실패 시 재시도
      retry: 1,
    },
  },
})

// 개발 환경에서만 활성화
if (__DEV__) {
  // React Query DevTools를 위한 설정
  queryClient.mount()
}
