import { useEffect } from 'react'

import { useInternetStatus } from '@/hooks/useInternetStatus'
import { useRefetchOnReconnect } from '@/hooks/useRefetchOnReconnect'
import { flushScrapQueue } from '@/utils/scrapSync'

export function RefetchOnReconnectBridge() {
  useRefetchOnReconnect()
  const { isOnline } = useInternetStatus()

  useEffect(() => {
    if (isOnline) {
      void flushScrapQueue()
    }
  }, [isOnline])
  return null
}
