import { useState } from 'react'

import { View, Text, TouchableOpacity } from 'react-native'

import { NotificaitonItem } from '../NotificaitonItem/NotificaitonItem'

export const NotificationContent = () => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread'>('all')

  return (
    <View className="flex-1 bg-gray-50">
      <View className="mb-4 flex-row items-center justify-center bg-gray-100 py-1">
        <TouchableOpacity
          className={`px-20 py-2 ${
            selectedTab === 'all' ? 'rounded-full bg-white' : 'bg-gray-100'
          }`}
          onPress={() => setSelectedTab('all')}
        >
          <Text className="font-semibold">전체</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`px-20 py-2 ${
            selectedTab === 'unread' ? 'rounded-full bg-white' : 'bg-gray-100'
          }`}
          onPress={() => setSelectedTab('unread')}
        >
          <Text className="font-semibold">안 읽음</Text>
        </TouchableOpacity>
      </View>
      <NotificaitonItem filter={selectedTab} />
    </View>
  )
}
