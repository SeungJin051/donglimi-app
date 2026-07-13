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
import { COLORS } from '@/constants/colors'
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
    <View className="flex-1 bg-bg">
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row gap-2">
          <TouchableOpacity
            className={`rounded-full px-4 py-2 ${
              selectedTab === 'all' ? 'bg-text-primary' : 'bg-surface'
            }`}
            onPress={() => setSelectedTab('all')}
            activeOpacity={0.8}
          >
            <Text
              className={`text-[14px] font-semibold ${
                selectedTab === 'all' ? 'text-white' : 'text-text-secondary'
              }`}
            >
              전체
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`rounded-full px-4 py-2 ${
              selectedTab === 'unread' ? 'bg-text-primary' : 'bg-surface'
            }`}
            onPress={() => setSelectedTab('unread')}
            activeOpacity={0.8}
          >
            <Text
              className={`text-[14px] font-semibold ${
                selectedTab === 'unread' ? 'text-white' : 'text-text-secondary'
              }`}
            >
              안 읽음
            </Text>
          </TouchableOpacity>
        </View>
        {items.length > 0 && (
          <TouchableOpacity
            onPress={handleDeleteAll}
            className="ml-2 h-9 w-9 items-center justify-center rounded-full bg-surface"
            disabled={loading}
          >
            <Ionicons
              name="trash-outline"
              size={18}
              color={loading ? COLORS.textDisabled : COLORS.textSecondary}
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
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : error ? (
        <Text className="px-4 py-2 text-danger">{error}</Text>
      ) : (
        <>
          {isEmptyUnread ? (
            <View className="mx-4 items-center justify-center rounded-card bg-surface px-6 py-12">
              <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-bg">
                <Ionicons
                  name="checkmark-done"
                  size={26}
                  color={COLORS.textTertiary}
                />
              </View>
              <Text className="text-[17px] font-bold text-text-primary">
                지금은 새 알림이 없어요
              </Text>
              <Text className="mt-2 text-center text-[14px] leading-5 text-text-tertiary">
                중요한 학과 소식이 오면 잊지 않고 챙겨드릴게요.
              </Text>
            </View>
          ) : isEmptyAll ? (
            <View className="mx-4 items-center justify-center rounded-card bg-surface px-6 py-12">
              <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-bg">
                <Ionicons
                  name="notifications-outline"
                  size={26}
                  color={COLORS.textTertiary}
                />
              </View>
              <Text className="text-[17px] font-bold text-text-primary">
                어떤 소식을 알려드릴까요?
              </Text>
              <Text className="mt-2 text-center text-[14px] leading-5 text-text-tertiary">
                우측 상단 종 아이콘에서 관심 주제를 설정하면,
                {'\n'}새 소식을 바로 알려드려요.
              </Text>
            </View>
          ) : (
            <FlatList
              contentInsetAdjustmentBehavior="automatic"
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
                    <ActivityIndicator size="small" color={COLORS.primary} />
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
