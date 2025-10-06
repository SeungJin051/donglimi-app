import { useState } from 'react'

import { View, Text, TouchableOpacity, FlatList } from 'react-native'
type NotificationItem = {
  id: string
  title: string
  department: string
  tag: string[]
  date: string
  timeAgo: string
  isRead: boolean
}

// 임시 데이터
const notifications: NotificationItem[] = [
  {
    id: '1',
    title: '2025학년도 2학기 자격 시험 결과 발표 예정일 안내',
    department: '컴퓨터공학과',
    tag: ['#학사'],
    date: '2025.10.06',
    timeAgo: '5분전',
    isRead: false,
  },
  {
    id: '2',
    title: '다른 공지사항입니다',
    department: '컴퓨터공학과',
    tag: ['#공지'],
    date: '2025.10.06',
    timeAgo: '10분전',
    isRead: true,
  },
]

const renderItem = ({ item }: { item: NotificationItem }) => (
  <TouchableOpacity
    className={`mx-4 mb-3 min-h-[100px] rounded-lg border ${
      item.isRead ? 'border-gray-100 bg-white' : 'border-blue-100 bg-blue-50'
    } p-4`}
  >
    <View className="flex-row justify-between">
      <View className="flex-1">
        <Text
          className="text-base font-semibold text-gray-800"
          numberOfLines={2}
        >
          {item.title}
        </Text>
      </View>
      {!item.isRead && <View className="h-2 w-2 rounded-full bg-blue-500" />}
    </View>
    <View className="mt-2">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="ml-[-4px] rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-gray-700">
            {item.department}
          </Text>
          <Text className="text-xs text-gray-700">{item.tag}</Text>
        </View>
        <Text className="text-xs text-gray-500">{item.date}</Text>
      </View>
      <Text className="mt-2 text-xs text-gray-500">{item.timeAgo}</Text>
    </View>
  </TouchableOpacity>
)

export const NotificaitonItem = () => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread'>('all')

  const filteredNotifications =
    selectedTab === 'unread'
      ? notifications.filter((item) => !item.isRead)
      : notifications

  return (
    <View className="flex-1">
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
      <FlatList
        data={filteredNotifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  )
}
