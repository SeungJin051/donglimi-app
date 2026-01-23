import { useState } from 'react'

import { MaterialIcons } from '@expo/vector-icons'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'

import InAppBrowser from '@/components/ui/InAppBrowser/InAppBrowser'
import { quickItem } from '@/constants/utilContent'
import { useAcademicSchedule } from '@/hooks/useAcademicSchedule'
import { calculateDDay } from '@/utils/dDay'

export const UtilContent = () => {
  // 학사일정 데이터 (Firestore에서 가져오기)
  const { schedules: academicSchedules, url: academicScheduleUrl } =
    useAcademicSchedule()

  // 인앱 브라우저 상태
  const [browserVisible, setBrowserVisible] = useState(false)
  const [browserUrl, setBrowserUrl] = useState<string | null>(null)

  // 링크 열기
  const handleOpenLink = (link: string) => {
    if (link) {
      setBrowserUrl(link)
      setBrowserVisible(true)
    }
  }

  return (
    <>
      <ScrollView>
        <View className="gap-6 bg-gray-50 px-4 py-4">
          {/* 학사 일정 */}
          <View className="rounded-xl border border-gray-100 bg-white px-4 py-4">
            <View className="flex-row justify-between">
              <Text className="mb-5 text-center text-lg font-semibold">
                잊지마세요! 주요 학사일정
              </Text>
              <MaterialIcons name="calendar-today" size={18} color="black" />
            </View>
            <View className="gap-3">
              {academicSchedules.length > 0 ? (
                academicSchedules
                  .map((plan) => ({
                    ...plan,
                    dday: calculateDDay(plan.date),
                  }))
                  .filter((plan) => {
                    // D-Day 또는 D-로 시작하는 항목만 필터링
                    return (
                      plan.dday.text === 'D-Day' ||
                      plan.dday.text.startsWith('D-')
                    )
                  })
                  .slice(0, 3)
                  .map((plan) => (
                    <View
                      key={plan.id}
                      className="w-full rounded-xl bg-gray-50 px-4 py-2"
                    >
                      <View className="flex-row justify-between">
                        <View>
                          <Text className="text-base font-medium">
                            {plan.title}
                          </Text>
                          <Text className="text-sm text-gray-500">
                            {plan.date}
                          </Text>
                        </View>
                        <View className="justify-center">
                          <View
                            className={`justify-center rounded-lg ${plan.dday.bgColor} px-1.5 py-0.5`}
                          >
                            <Text
                              className={`text-sm font-medium ${plan.dday.textColor}`}
                            >
                              {plan.dday.text}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))
              ) : (
                <View className="w-full items-center justify-center rounded-xl bg-gray-50 px-4 py-6">
                  <Text className="text-center text-sm text-gray-500">
                    학사일정을 불러올 수 없어요
                  </Text>
                </View>
              )}
              <TouchableOpacity
                className="w-full items-center justify-center rounded-xl border border-gray-100 px-4 py-3"
                onPress={() => handleOpenLink(academicScheduleUrl)}
              >
                <Text className="text-base font-medium">
                  전체 학사일정 보기
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 빠른 바로가기 */}
          <View className="rounded-xl border border-gray-100 bg-white px-4 py-4">
            <Text className="mb-5 text-lg font-semibold">빠른 바로가기</Text>
            <View className="flex-row flex-wrap justify-center gap-3">
              {quickItem.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  className="w-[30%] items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-3 py-4 transition-all active:scale-95 active:bg-gray-100"
                  onPress={() => handleOpenLink(item.link)}
                >
                  <View className="rounded-full bg-white p-3 shadow-sm">
                    <MaterialIcons
                      name={item.icon as keyof typeof MaterialIcons.glyphMap}
                      size={24}
                      color="#3B82F6"
                    />
                  </View>
                  <Text className="text-center text-sm font-medium text-gray-700">
                    {item.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      <InAppBrowser
        visible={browserVisible}
        url={browserUrl}
        onClose={() => setBrowserVisible(false)}
      />
    </>
  )
}
