import { useEffect, useRef } from 'react'

import * as Notifications from 'expo-notifications'
import * as WebBrowser from 'expo-web-browser'

import { useInterstitialAd } from '@/hooks/useInterstitialAd'
import { useAdStore } from '@/store/adStore'
import { canShowAd } from '@/utils/adManager'

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
 * 링크를 열고 공지 링크와 동일한 전면 광고 규칙을 적용합니다.
 */
export function useNotificationResponseLinkAd(enabled: boolean) {
  const { showAd } = useInterstitialAd()
  const { incrementLinkCount, increaseCount, resetIfDateChanged } = useAdStore()
  const handledIdsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!enabled) return

    const runAdIfNeeded = () => {
      const { linkOpenCount, todayAdCount } = useAdStore.getState()
      if (
        canShowAd({
          viewedCount: linkOpenCount,
          todayCount: todayAdCount,
        })
      ) {
        setTimeout(() => {
          showAd()
          increaseCount()
        }, 500)
      }
    }

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

      resetIfDateChanged()
      incrementLinkCount()

      if (url.includes('lib.deu.ac.kr')) {
        WebBrowser.openBrowserAsync(url)
        runAdIfNeeded()
        return
      }

      await WebBrowser.openBrowserAsync(url)
      runAdIfNeeded()
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
  }, [enabled, showAd, incrementLinkCount, increaseCount, resetIfDateChanged])
}
