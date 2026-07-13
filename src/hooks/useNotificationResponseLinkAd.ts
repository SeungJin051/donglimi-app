import { useEffect, useRef } from 'react'

import * as Notifications from 'expo-notifications'
import * as WebBrowser from 'expo-web-browser'

function getNoticeLinkFromResponse(
  response: Notifications.NotificationResponse
): string | null {
  const data = response.notification.request.content.data as
    | Record<string, unknown>
    | undefined
  if (!data) return null
  const raw = data.noticeLink ?? data.link
  return typeof raw === 'string' && raw.length > 0 ? raw : null
}

/**
 * 시스템 트레이에서 푸시 알림을 탭해 앱이 열릴 때 data에 noticeLink/link가 있으면
 * 링크를 엽니다.
 */
export function useNotificationResponseLinkAd(enabled: boolean) {
  const handledIdsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!enabled) return

    const handleResponse = async (
      response: Notifications.NotificationResponse
    ) => {
      const url = getNoticeLinkFromResponse(response)
      if (!url) return

      const id =
        response.notification.request.identifier ??
        `${url}-${response.notification.date}`
      if (handledIdsRef.current.has(id)) return
      handledIdsRef.current.add(id)

      await WebBrowser.openBrowserAsync(url)
    }

    let cancelled = false

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!cancelled && response) void handleResponse(response)
    })

    const sub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        void handleResponse(response)
      }
    )

    return () => {
      cancelled = true
      sub.remove()
    }
  }, [enabled])
}
