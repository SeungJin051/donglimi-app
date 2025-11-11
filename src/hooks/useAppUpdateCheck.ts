import { useEffect, useState } from 'react'

import * as Application from 'expo-application'
import Constants from 'expo-constants'
import * as Linking from 'expo-linking'
import { Platform } from 'react-native'

// 최신 버전 (앱 스토어에 출시된 버전)
// app.config.ts의 extra.LATEST_STORE_VERSION에서 가져옴
const getLatestVersion = (): string => {
  return Constants.expoConfig?.extra?.LATEST_STORE_VERSION || '1.0'
}

// 스토어 링크
const IOS_APP_STORE_URL = 'https://apps.apple.com/app/id6754769898'
const ANDROID_PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.seungjin051.donglimiapp'

interface UpdateCheckResult {
  needsUpdate: boolean
  currentVersion: string
  latestVersion: string
}

/**
 * 버전 비교 함수
 * @param current 현재 버전 (예: "1.2")
 * @param latest 최신 버전 (예: "1.3")
 * @returns true if current < latest
 */
function compareVersions(current: string, latest: string): boolean {
  const currentParts = current.split('.').map(Number)
  const latestParts = latest.split('.').map(Number)

  for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
    const currentPart = currentParts[i] || 0
    const latestPart = latestParts[i] || 0

    if (currentPart < latestPart) return true
    if (currentPart > latestPart) return false
  }

  return false
}

/**
 * 앱 업데이트 체크 Hook
 */
export function useAppUpdateCheck() {
  const [updateInfo, setUpdateInfo] = useState<UpdateCheckResult | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkUpdate = async () => {
      try {
        // 실제 설치된 앱 버전 가져오기 (네이티브 버전)
        const nativeVersion = Application.nativeApplicationVersion
        const expoConfigVersion = Constants.expoConfig?.version
        const manifestVersion = Constants.manifest?.version

        // fallback으로 expo config 버전 사용
        const currentVersion =
          nativeVersion || expoConfigVersion || manifestVersion || '1.0'

        // 스토어 최신 버전 가져오기
        const latestVersion = getLatestVersion()

        // 버전 비교
        const needsUpdate = compareVersions(currentVersion, latestVersion)

        setUpdateInfo({
          needsUpdate,
          currentVersion,
          latestVersion,
        })
      } catch (error) {
        console.error('업데이트 체크 실패:', error)
        const latestVersion = getLatestVersion()
        setUpdateInfo({
          needsUpdate: false,
          currentVersion: '1.0',
          latestVersion,
        })
      } finally {
        setIsChecking(false)
      }
    }

    checkUpdate()
  }, [])

  /**
   * 스토어로 이동
   */
  const openStore = async () => {
    try {
      const storeUrl =
        Platform.OS === 'ios' ? IOS_APP_STORE_URL : ANDROID_PLAY_STORE_URL

      const canOpen = await Linking.canOpenURL(storeUrl)
      if (canOpen) {
        await Linking.openURL(storeUrl)
      } else {
        console.error('스토어 링크를 열 수 없습니다')
      }
    } catch (error) {
      console.error('스토어 열기 실패:', error)
    }
  }

  return {
    updateInfo,
    isChecking,
    openStore,
  }
}
