import { Ionicons } from '@expo/vector-icons'
import { View, Text } from 'react-native'

import { COLORS } from '@/constants/colors'

export default function SwipeGuideHeader() {
  return (
    <View className="mx-4 mb-3 mt-2 rounded-card bg-primary-soft p-4">
      <View className="flex-row items-center gap-3">
        <View className="h-9 w-9 items-center justify-center rounded-full bg-white">
          <Ionicons name="chevron-back" size={18} color={COLORS.primary} />
        </View>
        <View className="flex-1">
          <Text className="text-[15px] font-bold text-text-primary">
            스와이프하여 스크랩하기
          </Text>
          <Text className="mt-0.5 text-[13px] leading-4 text-text-secondary">
            공지사항을 왼쪽으로 밀면 스크랩하거나 삭제할 수 있어요
          </Text>
        </View>
        <View className="flex-row items-center gap-1 rounded-full bg-primary px-3 py-1.5">
          <Ionicons name="bookmark" size={13} color="white" />
          <Text className="text-xs font-semibold text-white">스크랩</Text>
        </View>
      </View>
    </View>
  )
}
