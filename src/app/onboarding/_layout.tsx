import { Stack } from 'expo-router'

import { OfflineFullScreen } from '@/components/network/OfflineFullScreen'
import { useInternetStatus } from '@/hooks/useInternetStatus'

export default function OnboardingLayout() {
  const { isOnline, retry, checking } = useInternetStatus()

  if (!isOnline && !checking) {
    return (
      <OfflineFullScreen
        onRetry={() => {
          void retry()
        }}
      />
    )
  }

  return <Stack screenOptions={{ headerShown: false }} />
}
