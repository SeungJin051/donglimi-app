import 'react-native-gesture-handler'
import '../../global.css'

import { Component, useEffect, useRef, useState } from 'react'

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { QueryClientProvider } from '@tanstack/react-query'
import { Drawer } from 'expo-router/drawer'
import { AppState } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Toast from 'react-native-toast-message'

import HomeDrawer from '@/components/layout/HomeDrawer/HomeDrawer'
import { RefetchOnReconnectBridge } from '@/components/network/RefetchOnReconnectBridge'
import { toastConfig } from '@/components/ui/CustomToast/CustomToast'
import UpdateModal from '@/components/ui/UpdateModal/UpdateModal'
import { useAppUpdateCheck } from '@/hooks/useAppUpdateCheck'
import { useOnboarding } from '@/hooks/useOnboarding'
import { useAdStore } from '@/store/adStore'
import { resetSessionFlag } from '@/utils/adManager'
import { queryClient } from '@/utils/queryClient'

// 에러 경계 컴포넌트
class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error('App Error Boundary caught an error:', error)
  }

  render() {
    if (this.state.hasError) {
      // 에러 발생 시 최소한의 UI만 렌더링
      return <GestureHandlerRootView style={{ flex: 1 }} />
    }

    return this.props.children
  }
}

export default function RootLayout() {
  const { isOnboardingComplete } = useOnboarding()
  const [isInitialized, setIsInitialized] = useState(false)
  const initTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)

  // hydration 상태 추가
  const { resetLinkCount, resetIfDateChanged, _hasHydrated } = useAdStore()

  // 업데이트 체크
  const { updateInfo, isChecking, openStore } = useAppUpdateCheck()

  useEffect(() => {
    // 초기화 타임아웃 설정 (10초 후 강제 진행)
    initTimeoutRef.current = setTimeout(() => {
      console.warn('Initialization timeout, proceeding anyway...')
      setIsInitialized(true)
    }, 10000)

    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    // store가 hydrate되고 온보딩 체크가 완료된 후에만 실행
    if (!_hasHydrated || isOnboardingComplete === null) {
      return
    }

    // 초기화 완료
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current)
    }
    setIsInitialized(true)

    console.log('Store hydrated, initializing...')

    // 초기화 로직을 지연시켜 안정성 향상
    const initTimer = setTimeout(() => {
      try {
        resetIfDateChanged()
        resetLinkCount()
      } catch (error) {
        console.error('Store initialization error:', error)
        // 에러가 발생해도 앱은 계속 실행
      }
    }, 100)

    // 앱 활성화 시 세션 리셋 + 날짜 체크
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        // 지연 실행으로 크래시 방지
        setTimeout(() => {
          try {
            resetSessionFlag()
            resetIfDateChanged()
          } catch (error) {
            console.error('AppState change error:', error)
          }
        }, 200)
      }
    })

    return () => {
      clearTimeout(initTimer)
      subscription.remove()
    }
  }, [_hasHydrated, isOnboardingComplete, resetLinkCount, resetIfDateChanged])

  // 업데이트 모달 표시
  useEffect(() => {
    if (!isChecking && updateInfo?.needsUpdate && isInitialized) {
      // 초기화 완료 후 약간의 딜레이를 두고 모달 표시
      const timer = setTimeout(() => {
        setShowUpdateModal(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isChecking, updateInfo, isInitialized])

  // 온보딩 체크 또는 store hydration 대기
  if (!isInitialized || isOnboardingComplete === null || !_hasHydrated) {
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
            {updateInfo && (
              <UpdateModal
                visible={showUpdateModal}
                currentVersion={updateInfo.currentVersion}
                latestVersion={updateInfo.latestVersion}
                onUpdate={openStore}
                onLater={() => setShowUpdateModal(false)}
                forceUpdate={false}
              />
            )}
          </BottomSheetModalProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  )
}
