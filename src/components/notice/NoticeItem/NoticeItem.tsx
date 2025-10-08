import { View, Text } from 'react-native'

import { Notice } from '@/types/notice.type'
import { getDepartmentStyles } from '@/utils/departmentStyles'

interface NoticeItemProps {
  item: Notice
}

export const NoticeItem = ({ item }: NoticeItemProps) => {
  // 함수를 호출하여 현재 아이템의 부서에 맞는 스타일을 가져옵니다.
  const departmentStyle = getDepartmentStyles(item.department)

  return (
    <View className="mb-2 ml-4 mr-0 min-h-[105px] rounded-l-lg border-b border-l border-t border-gray-200 bg-white p-5 pr-4">
      <View className="flex-1 justify-between">
        <Text
          className="text-[15px] font-semibold leading-snug text-gray-900"
          numberOfLines={2}
        >
          {item.title}
        </Text>

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
  )
}
