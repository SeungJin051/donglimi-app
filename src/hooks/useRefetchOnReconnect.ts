import { useEffect, useRef } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { useInternetStatus } from '@/hooks/useInternetStatus'

export function useRefetchOnReconnect() {
  const { isOnline } = useInternetStatus()
  const queryClient = useQueryClient()
  const prevOnline = useRef<boolean>(true)

  useEffect(() => {
    if (isOnline && prevOnline.current === false) {
      // 온라인 복귀 시 활성 쿼리만 재요청
      void queryClient.refetchQueries({ type: 'active' })
    }
    prevOnline.current = Boolean(isOnline)
  }, [isOnline, queryClient])
}
