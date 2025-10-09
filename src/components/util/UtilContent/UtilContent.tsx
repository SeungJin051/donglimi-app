import { MaterialIcons } from '@expo/vector-icons'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'

import { calculateDDay } from '@/utils/dDay'

export const UtilContent = () => {
  const quickItem = [
    {
      id: 1,
      title: '동의대학교',
      icon: '🏫',
      link: '/util/quick',
    },
    {
      id: 2,
      title: 'DAP',
      icon: '💻',
      link: '/util/dap',
    },
    {
      id: 3,
      title: 'DOOR',
      icon: '🚪',
      link: '/util/door',
    },
  ]

  const uniPlan = [
    {
      id: 1,
      title: '수강신청 변경 기간',
      date: '10/10 ~ 10/11',
    },
    {
      id: 2,
      title: '2학기 중간고사',
      date: '10/20 ~ 10/25',
    },
    {
      id: 3,
      title: '개교 기념일',
      date: '10/26',
    },
  ]

  const campusUtil = [
    {
      id: 1,
      icon: 'location-pin',
      title: '캠퍼스 맵',
    },
    {
      id: 2,
      icon: 'restaurant-menu',
      title: '오늘의 학식',
    },
  ]

  return (
    <ScrollView>
      <View className="gap-6 px-4 py-4">
        {/* 빠른 바로가기 */}
        <View className="rounded-xl border border-gray-100 bg-white px-4 py-4">
          <Text className="mb-5 text-lg font-semibold">빠른 바로가기</Text>
          <View className="flex-row justify-around gap-4">
            {quickItem.map((item) => (
              <TouchableOpacity
                key={item.id}
                className="w-[100px] items-center gap-2 rounded-xl border border-gray-100 px-3 py-3"
              >
                <Text>{item.icon}</Text>
                <Text>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 학사 일정 */}
        <View className="rounded-xl border border-gray-100 bg-white px-4 py-4">
          <View className="flex-row justify-between">
            <Text className="mb-5 text-center text-lg font-semibold">
              잊지마세요! 주요 학사일정
            </Text>
            <MaterialIcons name="calendar-today" size={18} color="black" />
          </View>
          <View className="gap-3">
            {uniPlan.map((plan) => (
              <View
                key={plan.id}
                className="w-full rounded-xl bg-gray-50 px-2.5 py-2"
              >
                <View className="flex-row justify-between">
                  <View>
                    <Text className="text-base font-medium">{plan.title}</Text>
                    <Text className="text-sm text-gray-500">{plan.date}</Text>
                  </View>
                  <View className="justify-center">
                    {(() => {
                      const { text, textColor, bgColor } = calculateDDay(
                        plan.date
                      )
                      return (
                        <View
                          className={`justify-center rounded-lg ${bgColor} px-1.5 py-0.5`}
                        >
                          <Text className={`text-sm font-medium ${textColor}`}>
                            {text}
                          </Text>
                        </View>
                      )
                    })()}
                  </View>
                </View>
              </View>
            ))}
            <TouchableOpacity className="w-full items-center justify-center rounded-xl border border-gray-100 px-4 py-3">
              <Text className="text-base font-medium">전체 학사일정 보기</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 편의 기능 */}
        <View className="rounded-xl border border-gray-100 bg-white px-4 py-4">
          <Text className="mb-5 text-lg font-semibold">편의 기능</Text>
          <View className="flex-col gap-4">
            {campusUtil.map((item) => (
              <TouchableOpacity
                key={item.id}
                className="w-full flex-row items-center gap-4 rounded-xl border border-gray-100 px-4 py-3"
              >
                <MaterialIcons
                  name={item.icon as keyof typeof MaterialIcons.glyphMap}
                  size={18}
                  color="black"
                />
                <Text className="text-base font-medium">{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
