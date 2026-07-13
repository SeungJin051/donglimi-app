import { useState, useEffect, useRef } from 'react'

import { useOnboarding } from './useOnboarding'

/**
 * 앱 초기화 로직을 관리하고,
 * 앱이 렌더링될 준비가 되었는지 여부를 반환하는 훅입니다.
 */
export function useOnboardingCheck() {
  const [isReady, setIsReady] = useState(false)
  const initTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { isOnboardingComplete } = useOnboarding()

  // 10초 강제 실행 Failsafe
  useEffect(() => {
    initTimeoutRef.current = setTimeout(() => {
      console.warn('Initialization timeout, proceeding anyway...')
      setIsReady(true)
    }, 10000)

    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isOnboardingComplete === null) {
      return
    }

    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current)
    }
    setIsReady(true)
    console.log('Onboarding checked, initializing...')
  }, [isOnboardingComplete])

  return { isReady, isOnboardingComplete }
}
