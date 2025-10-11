import { useRef, useMemo } from 'react'

import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { View, Text } from 'react-native'
import Swipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable'

import RightSwipeActions from '@/components/ui/RightSwipeActions/RightSwipeActions'
import { useScrapStore } from '@/store/scrapStore'
import { Notice } from '@/types/notice.type'
import { getDepartmentStyles } from '@/utils/departmentStyles'

interface NoticeContentProps {
  item: Notice
}

export const NoticeContent = ({ item }: NoticeContentProps) => {
  // 함수를 호출하여 현재 아이템의 부서에 맞는 스타일을 가져옵니다.
  const departmentStyle = getDepartmentStyles(item.department)

  // 스크랩 스토어 호출
  const { scraps, addScrap, removeScrap } = useScrapStore()

  // 스와이프 참조
  const swipeableRef = useRef<SwipeableMethods>(null)

  // 현재 공지가 스크랩되어 있는지 확인
  const isScraped = useMemo(() => {
    return scraps.some((s) => s.notice.content_hash === item.content_hash)
  }, [scraps, item.content_hash])

  // 스크랩 추가 핸들러
  const handleAddScrap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    addScrap({ notice: item })
    swipeableRef.current?.close()

    // Todo: 토스트 메시지 추가
  }

  // 스크랩 삭제 핸들러
  const handleRemoveScrap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    removeScrap({ notice: item })
    swipeableRef.current?.close()

    // Todo: 토스트 메시지 추가
  }

  // 스와이프 활성화 시 햅틱 피드백
  const handleSwipeableWillOpen = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={() => (
        <RightSwipeActions
          onPress={isScraped ? handleRemoveScrap : handleAddScrap}
          isScraped={isScraped}
        />
      )}
      onSwipeableWillOpen={handleSwipeableWillOpen}
      containerStyle={{
        marginBottom: 10,
      }}
      overshootLeft={false}
      overshootRight={false}
    >
      <View className="ml-4 mr-0 min-h-[105px] rounded-l-lg border-b border-l border-t border-gray-200 bg-white p-5 pr-4">
        <View className="flex-1 justify-between">
          <View className="flex-row items-start justify-between">
            <Text
              className="flex-1 pr-2 text-base font-medium leading-snug text-gray-900"
              numberOfLines={2}
            >
              {item.title}
            </Text>
            {isScraped && (
              <Ionicons name="bookmark" size={20} color="#0158a6" />
            )}
          </View>

          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-1 flex-row items-center gap-2">
              <View className={`rounded-md px-2.5 py-1 ${departmentStyle.bg}`}>
                <Text className={`text-xs font-medium ${departmentStyle.text}`}>
                  {item.department}
                </Text>
              </View>

              <View className="flex-1 flex-row flex-wrap gap-1.5">
                {item.tags.slice(0, 2).map((tag) => (
                  <View key={tag} className="rounded-md bg-gray-100 px-2 py-1">
                    <Text className="text-xs font-medium text-gray-600">
                      #{tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <Text className="text-xs font-normal text-gray-500">
              {item.posted_at.replace('작성일자:', '').trim()}
            </Text>
          </View>
        </View>
      </View>
    </Swipeable>
  )
}
