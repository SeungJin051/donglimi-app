import { Ionicons } from '@expo/vector-icons'
import { View, Text, TouchableOpacity } from 'react-native'

import { COLORS } from '@/constants/colors'

interface TagItem {
  id: string
  title: string
  color?: string
}

interface TagListProps {
  items: TagItem[]
  onRemove: (id: string) => void
  onAdd?: () => void
  emptyText: string
  addButtonText?: string
  showAddButton?: boolean
}

export function TagList({
  items,
  onRemove,
  onAdd,
  emptyText,
  addButtonText = '추가',
  showAddButton = true,
}: TagListProps) {
  return (
    <View className="gap-2">
      {/* 태그 목록 */}
      <View className="flex flex-row flex-wrap gap-2">
        {items.length > 0 ? (
          items.map((item) => (
            <View
              key={item.id}
              className="flex flex-row items-center justify-center gap-1 rounded-full bg-primary-soft px-4 py-2"
            >
              <TouchableOpacity>
                <Text className="text-sm font-medium text-primary">
                  {item.title}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => onRemove(item.id)}>
                <Ionicons
                  name="close-outline"
                  size={16}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View className="flex flex-row items-center justify-center gap-1 rounded-full bg-bg px-4 py-2">
            <TouchableOpacity>
              <Text className="text-sm text-text-tertiary">{emptyText}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 추가 버튼 */}
      {showAddButton && onAdd && (
        <View>
          <TouchableOpacity
            className="flex-row items-center justify-center gap-2 rounded-control bg-bg p-3"
            onPress={onAdd}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={18} color={COLORS.textSecondary} />
            <Text className="text-[14px] font-semibold text-text-secondary">
              {items.length > 0
                ? `${addButtonText} 수정`
                : `${addButtonText} 추가`}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
