import { Ionicons } from '@expo/vector-icons'
import { View, Text, TouchableOpacity } from 'react-native'

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
              className="flex flex-row items-center justify-center gap-1 rounded-full bg-blue-100 px-4 py-2 text-sm"
            >
              <TouchableOpacity>
                <Text className="text-sm text-blue-700">{item.title}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => onRemove(item.id)}>
                <Ionicons name="close-outline" size={16} color="#3B82F6" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View className="flex flex-row items-center justify-center gap-1 rounded-full bg-gray-100 px-4 py-2 text-sm">
            <TouchableOpacity>
              <Text className="text-sm text-gray-500">{emptyText}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 추가 버튼 */}
      {showAddButton && onAdd && (
        <View>
          <TouchableOpacity
            className="flex-row items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-2"
            onPress={onAdd}
          >
            <Ionicons name="add" size={20} color="black" />
            <Text>
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
