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
      className={`min-h-[105px] w-20 items-center justify-center rounded-l-card ${
        isDeleteAction ? 'bg-danger' : 'bg-primary'
      }`}
      activeOpacity={0.8}
    >
      <Ionicons
        name={isDeleteAction ? 'trash-outline' : 'bookmark'}
        size={24}
        color="white"
      />
      <Text className="mt-1 text-[13px] font-semibold text-white">
        {isDeleteAction ? '삭제' : '스크랩'}
      </Text>
    </TouchableOpacity>
  )
}
