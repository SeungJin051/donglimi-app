import { Ionicons } from '@expo/vector-icons'
import { Text, TouchableOpacity } from 'react-native'

// 우측 스와이프 시 표시될 액션 컴포넌트 (스크랩/삭제)
export default function RightSwipeActions({
  onPress,
  isScraped,
  isDeleteOnly = false,
}: {
  onPress: () => void
  isScraped: boolean
  isDeleteOnly?: boolean
}) {
  const isDeleteAction = isDeleteOnly || isScraped

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`mr-4 min-h-[105px] w-20 items-center justify-center rounded-r-lg ${
        isDeleteAction ? 'bg-red-500' : 'bg-blue-500'
      }`}
      activeOpacity={0.7}
    >
      <Ionicons
        name={isDeleteAction ? 'trash-outline' : 'bookmark'}
        size={24}
        color="white"
      />
      <Text className="mt-1 text-sm font-semibold text-white">
        {isDeleteAction ? '삭제' : '스크랩'}
      </Text>
    </TouchableOpacity>
  )
}
