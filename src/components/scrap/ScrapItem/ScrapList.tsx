import { MaterialIcons } from '@expo/vector-icons'
import { Text, TouchableOpacity, View } from 'react-native'

import { useScrapStore } from '@/store/scrapStore'

export const ScrapItem = () => {
  const { scraps } = useScrapStore()

  return (
    <View className="px-4">
      {scraps.map((scrap) => (
        <View
          key={scrap.notice.content_hash}
          className="mb-2.5 min-h-[105px] rounded-lg border border-gray-200 bg-white p-5"
        >
          <View className="flex-1 justify-between">
            <View className="flex-row items-start justify-between">
              <Text
                className="flex-1 pr-2 text-[15px] font-semibold leading-snug text-gray-900"
                numberOfLines={2}
              >
                {scrap.notice.title}
              </Text>
              <TouchableOpacity>
                <MaterialIcons
                  name="delete-outline"
                  size={20}
                  color="#999999"
                />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between gap-3">
              <View className="flex-1 flex-row items-center gap-2">
                <View className="rounded-md bg-blue-50 px-2.5 py-1">
                  <Text className="text-xs font-medium text-blue-600">
                    {scrap.notice.department}
                  </Text>
                </View>

                <View className="flex-1 flex-row flex-wrap gap-1.5">
                  {scrap.notice.tags.slice(0, 2).map((tag) => (
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
              </View>

              <Text className="text-xs font-normal text-gray-500">
                {scrap.notice.posted_at.replace('작성일자:', '').trim()}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  )
}
