import AntDesign from '@expo/vector-icons/AntDesign'
import { View, Text } from 'react-native'

import { Notice } from '@/types/notice.type'

interface NoticeItemProps {
  item: Notice
}

export const NoticeItem = ({ item }: NoticeItemProps) => {
  return (
    <View className="mx-4 mb-3 rounded-lg bg-white p-4 shadow-sm">
      <Text className="text-base font-semibold text-gray-800" numberOfLines={2}>
        {item.title}
      </Text>
      <View className="mt-2">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-gray-700">
              {item.department}
            </Text>
          </View>
          <View>
            {item.tags.map((tag) => (
              <Text key={tag} className="text-xs text-gray-700">
                #{tag}
              </Text>
            ))}
          </View>
        </View>
      </View>
      <View className="mt-2">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1">
            <AntDesign name="like" size={12} color="black" />
            <Text className="text-xs text-gray-500">{item.like_count}</Text>
            <AntDesign name="comment" size={12} color="black" />
            <Text className="text-xs text-gray-500">{item.comment_count}</Text>
            <AntDesign name="book" size={12} color="black" />
            <Text className="text-xs text-gray-500">{item.bookmark_count}</Text>
          </View>
          <View>
            <Text className="text-xs text-gray-500">{item.posted_at}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
