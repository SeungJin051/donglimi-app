import { useEffect, useRef } from 'react'

import { useInternetStatus } from '@/hooks/useInternetStatus'
import { showInfoToast, showSuccessToast } from '@/utils/toastUtils'

export function OfflineToastBridge() {
  const { isOnline } = useInternetStatus()
  const prevOnline = useRef<boolean | null>(null)
  const hasBeenOffline = useRef<boolean>(false)

  useEffect(() => {
    if (prevOnline.current === null) {
      prevOnline.current = Boolean(isOnline)
      return
    }

    if (isOnline === false && prevOnline.current !== false) {
      showInfoToast(
        '오프라인 상태입니다',
        '온라인이 되면 바로 확인할 수 있어요.'
      )
      hasBeenOffline.current = true
    }

    if (
      isOnline === true &&
      prevOnline.current === false &&
      hasBeenOffline.current === true
    ) {
      showSuccessToast('연결이 복구되었어요', '새 데이터가 준비됐어요.')
    }

    prevOnline.current = Boolean(isOnline)
  }, [isOnline])

  return null
}
