import { useCallback } from 'react'

import Constants from 'expo-constants'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { Alert, Linking, Platform } from 'react-native'

export function usePushNotifications() {
  const requestPushPermission = useCallback(async () => {
    try {
      if (!Device.isDevice) {
        Alert.alert(
          '실기기 필요',
          '푸시 권한 요청은 시뮬레이터에서 동작하지 않아요. 실제 기기에서 시도해주세요.'
        )
        return false
      }

      const { status: existingStatus, canAskAgain } =
        await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus
      if (existingStatus !== 'granted' && canAskAgain) {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }

      if (finalStatus !== 'granted') {
        Alert.alert(
          '알림 권한 필요',
          '설정에서 알림 권한을 허용해야 알림을 받을 수 있어요.',
          [
            { text: '취소', style: 'cancel' },
            {
              text: '설정 열기',
              onPress: () => {
                try {
                  Linking.openSettings()
                } catch {}
              },
            },
          ]
        )
        return false
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: '동리미',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
        })
      }

      return true
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      Alert.alert('오류', '푸시 권한 요청 중 문제가 발생했어요.')
      return false
    }
  }, [])

  const getPushToken = useCallback(async (): Promise<string | null> => {
    try {
      if (!Device.isDevice) return null
      const { status } = await Notifications.getPermissionsAsync()
      if (status !== 'granted') return null

      const constantsTyped = Constants as unknown as {
        easConfig?: { projectId?: string }
        expoConfig?: { extra?: { eas?: { projectId?: string } } }
      }
      const projectId =
        constantsTyped?.easConfig?.projectId ||
        constantsTyped?.expoConfig?.extra?.eas?.projectId

      const tokenResponse = projectId
        ? await Notifications.getExpoPushTokenAsync({ projectId })
        : await Notifications.getExpoPushTokenAsync()

      return tokenResponse?.data ?? null
    } catch (e) {
      return null
    }
  }, [])

  const handleToggleNotification = useCallback(
    async (
      value: boolean,
      setNotificationEnabled: (enabled: boolean) => void
    ) => {
      setNotificationEnabled(value)
      if (value) {
        const ok = await requestPushPermission()
        if (!ok) setNotificationEnabled(false)
      }
    },
    [requestPushPermission]
  )

  return { requestPushPermission, getPushToken, handleToggleNotification }
}
