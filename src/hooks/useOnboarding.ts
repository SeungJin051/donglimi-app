import { useEffect, useState } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter, useSegments } from 'expo-router'

// AsyncStorage 키
const ONBOARDING_KEY = 'hasSeenOnboarding'

export function useOnboarding() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<
    boolean | null
  >(null)
  const router = useRouter()
  const segments = useSegments()

  // 온보딩 완료 여부 체크
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY)
        setIsOnboardingComplete(value === 'true')
      } catch (error) {
        console.error('온보딩 상태 확인 실패:', error)
        setIsOnboardingComplete(false)
      }
    }

    checkOnboarding()
  }, [])

  // 온보딩 완료 여부에 따라 라우팅
  useEffect(() => {
    const handleRouting = async () => {
      if (isOnboardingComplete === null) return // 로딩 중

      const inOnboarding = segments[0] === 'onboarding'
      const inTabs = segments[0] === '(tabs)'

      // (tabs)로 이동하려는 경우 AsyncStorage를 다시 체크
      if (inTabs && !isOnboardingComplete) {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY)
        if (value === 'true') {
          setIsOnboardingComplete(true)
          return
        }
      }

      if (!isOnboardingComplete && !inOnboarding) {
        // 온보딩 미완료 상태이고 온보딩 화면이 아니면 온보딩으로 이동
        router.replace('/onboarding')
      } else if (isOnboardingComplete && inOnboarding) {
        // 온보딩 완료 상태인데 온보딩 화면에 있으면 메인으로 이동
        router.replace('/(tabs)')
      }
    }

    handleRouting()
  }, [isOnboardingComplete, segments, router])

  return { isOnboardingComplete }
}
