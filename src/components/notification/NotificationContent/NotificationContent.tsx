import { useState, useCallback } from 'react'

import { Ionicons } from '@expo/vector-icons'
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native'

import { CenterAdCard } from '@/components/notice/CenterAdCard/CenterAdCard'
import useFetchNotification from '@/hooks/useFetchNotification'
import { PushNotificationItem } from '@/types/notification.type'

import { NotificaitonItem } from '../NotificaitonItem/NotificaitonItem'

export const NotificationContent = () => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread'>('all')
  const {
    items,
    loading,
    error,
    markAsRead,
    deleteNotification,
    deleteAllNotifications,
    loadMore,
    hasMore,
    loadingMore,
  } = useFetchNotification({
    pageSize: 10,
    realtime: false,
    filterUnread: selectedTab === 'unread',
  })

  const isEmptyUnread = selectedTab === 'unread' && items.length === 0
  const isEmptyAll = selectedTab === 'all' && items.length === 0

  const handlePress = useCallback(
    async (item: PushNotificationItem) => {
      if (!item.read) {
        await markAsRead(item.id)
      }
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

  const handleDeleteAll = useCallback(() => {
    if (items.length === 0) return

    const tabName = selectedTab === 'all' ? '전체' : '안 읽은'
    Alert.alert(
      '알림 삭제',
      `${tabName} 알림 ${items.length}개를 모두 삭제하시겠어요?`,
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAllNotifications()
            } catch (error) {
              console.error('알림 전체 삭제 실패:', error)
              Alert.alert('오류', '알림 삭제 중 문제가 발생했어요.')
            }
          },
        },
      ]
    )
  }, [items.length, selectedTab, deleteAllNotifications])

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row items-center justify-between bg-gray-100 px-4 py-1">
        <View className="flex-1 flex-row items-center justify-center">
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
        {items.length > 0 && (
          <TouchableOpacity
            onPress={handleDeleteAll}
            className="ml-2 p-2"
            disabled={loading}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color={loading ? '#9CA3AF' : '#6B7280'}
            />
          </TouchableOpacity>
        )}
      </View>

      {items.length > 0 && (
        <View>
          <CenterAdCard />
        </View>
      )}

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
            <FlatList
              data={items}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <NotificaitonItem
                  items={[item]}
                  onPress={() => handlePress(item)}
                  onDelete={handleDelete}
                />
              )}
              onEndReachedThreshold={0.6}
              onEndReached={() => {
                if (hasMore && !loadingMore) {
                  loadMore()
                }
              }}
              ListFooterComponent={
                loadingMore ? (
                  <View className="py-4">
                    <ActivityIndicator size="small" color="#3B82F6" />
                  </View>
                ) : null
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 24 }}
            />
          )}
        </>
      )}
    </View>
  )
}
