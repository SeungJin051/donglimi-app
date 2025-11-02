import 'react-native-gesture-handler'
import '../../global.css'

import { useEffect } from 'react'

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { QueryClientProvider } from '@tanstack/react-query'
import { Drawer } from 'expo-router/drawer'
import { AppState } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Toast from 'react-native-toast-message'

import HomeDrawer from '@/components/layout/HomeDrawer/HomeDrawer'
import { RefetchOnReconnectBridge } from '@/components/network/RefetchOnReconnectBridge'
import { toastConfig } from '@/components/ui/CustomToast/CustomToast'
import { useOnboarding } from '@/hooks/useOnboarding'
import { useAdStore } from '@/store/adStore'
import { resetSessionFlag } from '@/utils/adManager'
import { queryClient } from '@/utils/queryClient'

export default function RootLayout() {
  const { isOnboardingComplete } = useOnboarding()

  // hydration 상태 추가
  const { resetLinkCount, resetIfDateChanged, _hasHydrated } = useAdStore()

  useEffect(() => {
    // store가 hydrate된 후에만 실행
    if (!_hasHydrated) {
      console.log('Waiting for store hydration...')
      return
    }

    console.log('Store hydrated, initializing...')

    try {
      resetIfDateChanged()
      resetLinkCount()
    } catch (error) {
      console.error('Store initialization error:', error)
    }

    // 앱 활성화 시 세션 리셋 + 날짜 체크
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        try {
          resetSessionFlag()
          resetIfDateChanged()
        } catch (error) {
          console.error('AppState change error:', error)
        }
      }
    })

    return () => subscription.remove()
  }, [_hasHydrated, resetLinkCount, resetIfDateChanged])

  // 온보딩 체크 또는 store hydration 대기
  if (isOnboardingComplete === null || !_hasHydrated) {
    return <GestureHandlerRootView style={{ flex: 1 }} />
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <BottomSheetModalProvider>
          <RefetchOnReconnectBridge />
          <Drawer
            drawerContent={(props) => <HomeDrawer {...props} />}
            screenOptions={{
              headerShown: false,
              swipeEnabled: false,
            }}
          >
            <Drawer.Screen
              name="(tabs)"
              options={{ drawerLabel: '홈', title: '홈' }}
            />
          </Drawer>
          <Toast config={toastConfig} />
        </BottomSheetModalProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  )
}
