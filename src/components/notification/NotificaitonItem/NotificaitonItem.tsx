import { useRef, useState } from 'react'

import * as Haptics from 'expo-haptics'
import { View, Text, TouchableOpacity } from 'react-native'
import Swipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable'

import InAppBrowser from '@/components/ui/InAppBrowser/InAppBrowser'
import RightSwipeActions from '@/components/ui/RightSwipeActions/RightSwipeActions'
import { PushNotificationItem } from '@/types/notification.type'
import { getFormattedDate } from '@/utils/dateUtils'
import { getDepartmentStyles } from '@/utils/departmentStyles'

interface NotificaitonItemProps {
  items: Array<
    Pick<
      PushNotificationItem,
      'id' | 'title' | 'department' | 'category' | 'read' | 'createdAtMs'
    > & { tags?: string[] }
  >
  onPress?: (item: {
    id: string
    noticeLink?: string
    noticeId?: string
  }) => void
  onDelete?: (item: { id: string; title: string }) => void
}

export function NotificaitonItem({
  items,
  onPress,
  onDelete,
}: NotificaitonItemProps) {
  return (
    <>
      {items.map((item) => (
        <NotificationItemContent
          key={item.id}
          item={item}
          onPress={onPress}
          onDelete={onDelete}
        />
      ))}
    </>
  )
}

interface NotificationItemContentProps {
  item: Pick<
    PushNotificationItem,
    | 'id'
    | 'title'
    | 'department'
    | 'category'
    | 'read'
    | 'createdAtMs'
    | 'noticeLink'
    | 'noticeId'
  > & { tags?: string[] }
  onPress?: (item: {
    id: string
    noticeLink?: string
    noticeId?: string
  }) => void
  onDelete?: (item: { id: string; title: string }) => void
}

function NotificationItemContent({
  item,
  onPress,
  onDelete,
}: NotificationItemContentProps) {
  // 스와이프 참조
  const swipeableRef = useRef<SwipeableMethods>(null)

  // 인앱 브라우저 상태
  const [browserVisible, setBrowserVisible] = useState(false)
  const [browserUrl, setBrowserUrl] = useState<string | null>(null)

  // 부서 스타일 가져오기
  const departmentStyle = item.department
    ? getDepartmentStyles(item.department)
    : null

  // 삭제 핸들러
  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    onDelete?.({ id: item.id, title: item.title })
    swipeableRef.current?.close()
  }

  // 스와이프 활성화 시 햅틱 피드백
  const handleSwipeableWillOpen = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  // 알림 탭: 브라우저 열고(있으면) 상위 onPress 호출
  const handlePress = () => {
    // 읽음 처리만 위해 상위 onPress 호출, 브라우저는 열지 않음
    if (!item.read) {
      onPress?.({
        id: item.id,
        noticeLink: item.noticeLink,
        noticeId: item.noticeId,
      })
      return
    }

    // 읽음이면 링크가 있을 때만 인앱 브라우저 오픈 후 상위 onPress
    if (item.noticeLink) {
      setBrowserUrl(item.noticeLink)
      setBrowserVisible(true)
    }
    onPress?.({
      id: item.id,
      noticeLink: item.noticeLink,
      noticeId: item.noticeId,
    })
  }

  return (
    <>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={() => (
          <RightSwipeActions
            onPress={handleDelete}
            isScraped={false}
            isDeleteOnly={true} // 알림은 삭제만 가능
          />
        )}
        onSwipeableWillOpen={handleSwipeableWillOpen}
        containerStyle={{
          marginBottom: 10,
        }}
        overshootLeft={false}
        overshootRight={false}
      >
        <TouchableOpacity
          className={`ml-4 mr-0 min-h-[105px] rounded-l-lg border-b border-l border-t ${
            item.read
              ? 'border-gray-200 bg-white'
              : 'border-blue-200 bg-blue-50'
          } p-5 pr-4`}
          onPress={handlePress}
          activeOpacity={0.7}
        >
          <View className="flex-1 justify-between">
            <View className="flex-row items-start justify-between">
              <Text
                className={`flex-1 pr-2 text-base font-medium leading-snug ${
                  item.read ? 'text-gray-900' : 'text-gray-800'
                }`}
                numberOfLines={2}
              >
                {item.title}
              </Text>
              {!item.read && (
                <View className="h-2 w-2 rounded-full bg-blue-500" />
              )}
            </View>

            <View className="flex-row items-center justify-between gap-3">
              <View className="flex-1 flex-row items-center gap-2">
                {item.department && departmentStyle && (
                  <View
                    className={`rounded-md px-2.5 py-1 ${departmentStyle.bg}`}
                  >
                    <Text
                      className={`text-xs font-medium ${departmentStyle.text}`}
                    >
                      {item.department}
                    </Text>
                  </View>
                )}

                {item.category && (
                  <View className="rounded-md bg-gray-100 px-2 py-1">
                    <Text className="text-xs font-medium text-gray-600">
                      #{item.category}
                    </Text>
                  </View>
                )}

                {item.tags && item.tags.length > 0 && (
                  <View className="flex-1 flex-row flex-wrap gap-1.5">
                    {item.tags.slice(0, 2).map((tag) => (
                      <View
                        key={tag}
                        className="rounded-md bg-gray-100 px-2 py-1"
                      >
                        <Text className="text-xs font-medium text-gray-600">
                          #{tag}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
              <Text className="text-xs font-normal text-gray-500">
                {getFormattedDate(item.createdAtMs)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>

      <InAppBrowser
        visible={browserVisible}
        url={browserUrl}
        onClose={() => setBrowserVisible(false)}
      />
    </>
  )
}
