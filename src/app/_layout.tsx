import 'react-native-gesture-handler'
import '../../global.css'

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { QueryClientProvider } from '@tanstack/react-query'
import { Drawer } from 'expo-router/drawer'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Toast from 'react-native-toast-message'

import { ErrorBoundary } from '@/components/layout/ErrorBoundary/ErrorBoundary'
import HomeDrawer from '@/components/layout/HomeDrawer/HomeDrawer'
import { RefetchOnReconnectBridge } from '@/components/network/RefetchOnReconnectBridge'
import { toastConfig } from '@/components/ui/CustomToast/CustomToast'
import { useAndroidChannel } from '@/hooks/useAndroidChannel'
import { useOnboardingCheck } from '@/hooks/useOnboardingCheck'
import { queryClient } from '@/utils/queryClient'

export default function RootLayout() {
  // 온보딩 체크
  const { isReady } = useOnboardingCheck()

  // 안드로이드 채널 설정
  useAndroidChannel()

  // 로딩 체크
  if (!isReady) {
    // 로딩 중이거나, 온보딩이 완료되지 않았거나, 스토어 로딩이 끝나지 않음
    return <GestureHandlerRootView style={{ flex: 1 }} />
  }

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  )
}
