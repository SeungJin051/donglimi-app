import {
  AndroidImportance,
  setNotificationChannelAsync,
} from 'expo-notifications'
import { Platform } from 'react-native'

export async function useAndroidChannel() {
  if (Platform.OS === 'android') {
    await setNotificationChannelAsync('default', {
      name: '동리미',
      importance: AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    })
  }
}
