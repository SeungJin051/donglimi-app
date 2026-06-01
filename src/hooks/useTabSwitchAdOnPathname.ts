import { useEffect } from 'react'

import { usePathname } from 'expo-router'

import { useInterstitialAd } from '@/hooks/useInterstitialAd'
import { useAdStore } from '@/store/adStore'
import { canShowTabSwitchAd } from '@/utils/adManager'

/** 탭 전환 시 전면 광고 노출 규칙 */
export function useTabSwitchAdOnPathname() {
  const pathname = usePathname()
  const { showAd } = useInterstitialAd()
  const {
    tabSwitchCount,
    todayAdCount,
    incrementTabSwitchCount,
    increaseCount,
  } = useAdStore()

  useEffect(() => {
    if (!pathname) return

    incrementTabSwitchCount()

    const shouldShow = canShowTabSwitchAd({
      tabSwitchCount: tabSwitchCount + 1,
      todayCount: todayAdCount,
    })

    if (shouldShow) {
      setTimeout(() => {
        showAd()
        increaseCount()
      }, 800)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])
}
