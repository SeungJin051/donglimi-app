import { useState, useEffect, useRef } from 'react'

import { AppState } from 'react-native'

import { useAdStore } from '@/store/adStore'
import { resetSessionFlag } from '@/utils/adManager'

import { useOnboarding } from './useOnboarding'

/**
 * 앱 초기화 로직을 관리하고,
 * 앱이 렌더링될 준비가 되었는지 여부를 반환하는 훅입니다.
 * (온보딩, 스토어 Hydration 설정)
 */
export function useOnboardingCheck() {
  const [isReady, setIsReady] = useState(false)
  const initTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { isOnboardingComplete } = useOnboarding()
  const { _hasHydrated, resetLinkCount, resetIfDateChanged } = useAdStore()

  // 10초 강제 실행 Failsafe
  useEffect(() => {
    initTimeoutRef.current = setTimeout(() => {
      console.warn('Initialization timeout, proceeding anyway...')
      setIsReady(true) // 10초가 지나면 강제로 준비 완료 처리
    }, 10000)

    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current)
      }
    }
  }, []) // 앱 마운트 시 한 번만 실행

  // 메인 초기화 로직 (Hydration, Onboarding 체크)
  useEffect(() => {
    // 스토어가 준비되지 않았거나, 온보딩 체크가 안 끝났으면 대기
    if (!_hasHydrated || isOnboardingComplete === null) {
      return
    }

    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current) // Failsafe 타이머 취소
    }
    setIsReady(true) // "준비 완료" 상태로 변경
    console.log('Store hydrated and onboarding checked, initializing...')

    // 앱 준비 완료 후 실행할 백그라운드 작업들
    const initTimer = setTimeout(() => {
      try {
        resetIfDateChanged()
        resetLinkCount()
      } catch (error) {
        console.error('Store initialization error:', error)
      }
    }, 100)

    // 앱 상태 리스너 (활성화 시)
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
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

  return { isReady }
}
