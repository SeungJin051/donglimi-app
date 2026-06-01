import React from 'react'

import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useRouter } from 'expo-router'
import { Text, TouchableOpacity } from 'react-native'

import { TabScreenHeader } from '@/components/layout/TabScreenHeader'

export function NotificationHeader() {
  const router = useRouter()

  const handleNotificationSettingPress = () => {
    router.push('/notification-setting')
  }

  return (
    <TabScreenHeader className="flex-row items-center justify-between px-4 pb-3">
      <Text className="text-2xl font-bold">알림</Text>
      <TouchableOpacity
        onPress={handleNotificationSettingPress}
        className="p-1"
      >
        <MaterialIcons name="notifications-none" size={24} color="#6B7280" />
      </TouchableOpacity>
    </TabScreenHeader>
  )
}
