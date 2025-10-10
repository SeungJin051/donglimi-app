import { useRef } from 'react'

import * as Haptics from 'expo-haptics'
import { Text, View } from 'react-native'
import Swipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable'

import RightSwipeActions from '@/components/ui/RightSwipeActions/RightSwipeActions'
import { Scrap, useScrapStore } from '@/store/scrapStore'
import { getDepartmentStyles } from '@/utils/departmentStyles'

// 개별 스크랩 아이템 컴포넌트
export const ScrapItem = ({ scrap }: { scrap: Scrap }) => {
  const { removeScrap } = useScrapStore()
  const departmentStyle = getDepartmentStyles(scrap.notice.department)
  const swipeableRef = useRef<SwipeableMethods>(null)

  // 스크랩 삭제 핸들러
  const handleRemoveScrap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    removeScrap(scrap)
    swipeableRef.current?.close()
  }

  // 스와이프 활성화 시 햅틱 피드백
  const handleSwipeableWillOpen = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={() => (
        <RightSwipeActions onPress={handleRemoveScrap} isScraped={true} />
      )}
      onSwipeableWillOpen={handleSwipeableWillOpen}
      containerStyle={{
        marginBottom: 12,
      }}
      overshootLeft={false}
      overshootRight={false}
    >
      <View className="min-h-[105px] rounded-lg border-l-4 border-deu-light-blue bg-white p-6">
        <View className="flex-1 justify-between">
          <View className="flex-row items-start justify-between">
            <Text
              className="flex-1 pr-2 text-[15px] font-semibold leading-snug text-gray-900"
              numberOfLines={2}
            >
              {scrap.notice.title}
            </Text>
          </View>

          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-1 flex-row items-center gap-2">
              <View className={`rounded-md px-2.5 py-1 ${departmentStyle.bg}`}>
                <Text className={`text-xs font-medium ${departmentStyle.text}`}>
                  {scrap.notice.department}
                </Text>
              </View>

              <View className="flex-1 flex-row flex-wrap gap-1.5">
                {scrap.notice.tags.slice(0, 2).map((tag) => (
                  <View key={tag} className="rounded-md bg-gray-100 px-2 py-1">
                    <Text className="text-xs font-medium text-gray-600">
                      #{tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <Text className="text-xs font-normal text-gray-500">
              {scrap.notice.posted_at.replace('작성일자:', '').trim()}
            </Text>
          </View>
        </View>
      </View>
    </Swipeable>
  )
}
