import { useEffect } from 'react'

import {
  AndroidImportance,
  setNotificationChannelAsync,
} from 'expo-notifications'
import { Platform } from 'react-native'

export function useAndroidChannel() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      void setNotificationChannelAsync('default', {
        name: '동리미',
        importance: AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      })
    }
  }, [])
}
