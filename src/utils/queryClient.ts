import { QueryClient } from '@tanstack/react-query'

// 리액트 쿼리 클라이언트 설정
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 데이터가 fresh 상태로 유지되는 시간 (5분)
      staleTime: 5 * 60 * 1000,

      // 캐시가 메모리에 유지되는 시간 (10분)
      gcTime: 10 * 60 * 1000,

      // 재시도 설정
      retry: (failureCount, error) => {
        // 네트워크 에러의 경우만 재시도
        if (error?.message?.includes('network')) {
          return failureCount < 3
        }
        return false
      },

      // 앱 포커스 시 리페치 방지 (배터리 절약)
      refetchOnWindowFocus: false,

      // 앱 백그라운드에서 돌아올 때 리페치 방지
      refetchOnReconnect: false,

      // 마운트 시 중복 요청 방지
      refetchOnMount: true,
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
