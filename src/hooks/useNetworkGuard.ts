import { useCallback } from 'react'

import { useInternetStatus } from '@/hooks/useInternetStatus'
import { showInfoToast } from '@/utils/toastUtils'

export function useNetworkGuard(message?: { title?: string; desc?: string }) {
  const { isOnline } = useInternetStatus()

  const notifyOffline = useCallback(() => {
    showInfoToast(
      message?.title ?? '오프라인 상태입니다',
      message?.desc ?? '네트워크 연결 후 다시 시도해 주세요.'
    )
  }, [message?.title, message?.desc])

  const ensureOnline = useCallback(() => {
    if (isOnline === false) {
      notifyOffline()
      return false
    }
    return true
  }, [isOnline, notifyOffline])

  const guardAction = useCallback(
    <Args extends unknown[]>(fn: (...args: Args) => void) =>
      (...args: Args) => {
        if (!ensureOnline()) return
        fn(...args)
      },
    [ensureOnline]
  )

  const guardAsync = useCallback(
    <Args extends unknown[], R>(fn: (...args: Args) => Promise<R>) =>
      async (...args: Args) => {
        if (!ensureOnline()) return undefined as unknown as R
        return await fn(...args)
      },
    [ensureOnline]
  )

  return { isOnline: Boolean(isOnline), ensureOnline, guardAction, guardAsync }
}
