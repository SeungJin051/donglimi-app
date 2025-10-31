import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import NetInfo from '@react-native-community/netinfo'

const REACHABILITY_URL = 'https://clients3.google.com/generate_204'
const DEFAULT_TIMEOUT_MS = 3000

async function pingReachability(
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)
    const res = await fetch(REACHABILITY_URL, {
      method: 'HEAD',
      cache: 'no-cache',
      signal: controller.signal,
    })
    clearTimeout(timeout)
    // 204 혹은 200 범위를 온라인으로 간주
    return res.ok
  } catch {
    return false
  }
}

export function useInternetStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [isInternetReachable, setIsInternetReachable] = useState<
    boolean | null
  >(null)
  const [checking, setChecking] = useState<boolean>(false)

  const lastEmittedRef = useRef<boolean | null>(null)

  const computeStatus = useCallback(async () => {
    setChecking(true)
    const state = await NetInfo.fetch()
    const baseConnected = Boolean(state.isConnected)
    // NetInfo의 isInternetReachable가 undefined일 수 있어 별도 핑 수행
    const reachable = baseConnected ? await pingReachability() : false
    setIsConnected(baseConnected)
    setIsInternetReachable(reachable)
    setChecking(false)
    return reachable
  }, [])

  const retry = useCallback(async () => {
    return computeStatus()
  }, [computeStatus])

  useEffect(() => {
    const unsub = NetInfo.addEventListener(async (state) => {
      const baseConnected = Boolean(state.isConnected)
      let reachable: boolean
      if (!baseConnected) {
        reachable = false
      } else if (state.isInternetReachable != null) {
        reachable = Boolean(state.isInternetReachable)
        if (!reachable) {
          // 추가 확인
          reachable = await pingReachability()
        }
      } else {
        reachable = await pingReachability()
      }

      setIsConnected(baseConnected)
      setIsInternetReachable(reachable)

      // 디바운스 동일 상태 반복 방지
      if (lastEmittedRef.current !== reachable) {
        lastEmittedRef.current = reachable
      }
    })

    void computeStatus()
    return () => unsub()
  }, [computeStatus])

  return useMemo(
    () => ({
      checking,
      isConnected,
      isInternetReachable,
      isOnline: Boolean(isConnected && isInternetReachable),
      retry,
    }),
    [checking, isConnected, isInternetReachable, retry]
  )
}
