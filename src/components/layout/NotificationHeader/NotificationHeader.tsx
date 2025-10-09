import React from 'react'

import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useRouter } from 'expo-router'
import { Platform, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function NotificationHeader() {
  const { top } = useSafeAreaInsets()

  const router = useRouter()

  // 설정 버튼 클릭 시 알림 설정 페이지로 이동
  const handleNotificationSettingPress = () => {
    router.push('/notification-setting')
  }

  return (
    <View
      className="flex-row items-center justify-between bg-white px-4 pb-2"
      style={{
        paddingTop: Platform.OS === 'android' ? top + 10 : top,
      }}
    >
      <View className="flex-1 flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-semibold">알림</Text>
        </View>
        <View className="flex-row items-center gap-9">
          <TouchableOpacity onPress={handleNotificationSettingPress}>
            <MaterialIcons name="notifications-none" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
