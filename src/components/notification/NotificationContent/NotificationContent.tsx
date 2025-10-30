import { useMemo, useState, useCallback } from 'react'

import { Ionicons } from '@expo/vector-icons'
import * as Linking from 'expo-linking'
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'

import useFetchNotification from '@/hooks/useFetchNotification'

import { NotificaitonItem } from '../NotificaitonItem/NotificaitonItem'

export const NotificationContent = () => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread'>('all')
  const { items, loading, error, markAsRead, deleteNotification } =
    useFetchNotification({
      pageSize: 100,
      realtime: true,
    })

  const filtered = useMemo(
    () => (selectedTab === 'unread' ? items.filter((x) => !x.read) : items),
    [items, selectedTab]
  )

  const isEmptyUnread = selectedTab === 'unread' && filtered.length === 0
  const isEmptyAll = selectedTab === 'all' && filtered.length === 0

  const handlePress = useCallback(
    async (item: { id: string; noticeLink?: string; noticeId?: string }) => {
      if (item.noticeLink) {
        Linking.openURL(item.noticeLink)
      }
      await markAsRead(item.id)
    },
    [markAsRead]
  )

  const handleDelete = useCallback(
    async (item: { id: string; title: string }) => {
      try {
        await deleteNotification(item.id)
      } catch (error) {
        console.error('알림 삭제 실패:', error)
      }
    },
    [deleteNotification]
  )

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
      {loading ? (
        <View className="flex-1 items-center justify-center bg-white">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : error ? (
        <Text className="px-4 py-2 text-red-500">{error}</Text>
      ) : (
        <>
          {isEmptyUnread ? (
            <View className="mx-4 items-center justify-center rounded-lg border border-gray-100 bg-white p-6">
              <Text className="text-xl font-semibold text-gray-900">
                지금은 새 알림이 없어요
              </Text>
              <Text className="mt-2 text-center text-base text-gray-500">
                요한 학과 소식이 오면 잊지 않고 챙겨드릴게요.
              </Text>
            </View>
          ) : isEmptyAll ? (
            <View className="mx-4 items-center justify-center rounded-lg border border-gray-100 bg-white p-6">
              <Text className="text-xl font-semibold text-gray-900">
                어떤 소식을 알려드릴까요?
              </Text>
              <Text className="mt-2 text-center text-base text-gray-500">
                우측 상단{' '}
                <Ionicons
                  name="notifications-outline"
                  size={14}
                  color="#6B7280"
                />
                에서 관심 주제를 설정하면,
                {'\n'}새 소식을 바로 알려드려요.
              </Text>
            </View>
          ) : (
            <NotificaitonItem
              items={filtered}
              onPress={handlePress}
              onDelete={handleDelete}
            />
          )}
        </>
      )}
    </View>
  )
}
