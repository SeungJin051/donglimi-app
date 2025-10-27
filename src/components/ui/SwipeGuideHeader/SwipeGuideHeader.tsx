import { Ionicons } from '@expo/vector-icons'
import { View, Text } from 'react-native'

export default function SwipeGuideHeader() {
  return (
    <View className="mx-4 mb-2 mt-2 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <View className="flex-row items-center gap-3">
        <View className="rounded-full bg-blue-100 p-2">
          <Ionicons name="chevron-back" size={20} color="#3B82F6" />
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-blue-900">
            스와이프하여 스크랩하기
          </Text>
          <Text className="mt-1 text-sm text-blue-700">
            공지사항을 왼쪽으로 밀면 스크랩하거나 삭제할 수 있어요
          </Text>
        </View>
        <View className="flex-row items-center gap-1 rounded-full bg-blue-500 px-3 py-1">
          <Ionicons name="bookmark" size={14} color="white" />
          <Text className="text-xs font-medium text-white">스크랩</Text>
        </View>
      </View>
    </View>
  )
}
