import { useState } from 'react'

import { MaterialIcons } from '@expo/vector-icons'
import * as WebBrowser from 'expo-web-browser'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'

import { CenterAdCard } from '@/components/notice/CenterAdCard/CenterAdCard'
import InAppBrowser from '@/components/ui/InAppBrowser/InAppBrowser'
import { COLORS } from '@/constants/colors'
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
    if (!link) return

    // 도서관 사이트는 외부 브라우저로 바로 열기 (SSL 이슈)
    if (link.includes('lib.deu.ac.kr')) {
      WebBrowser.openBrowserAsync(link)
      return
    }

    // 나머지는 InApp 브라우저
    setBrowserUrl(link)
    setBrowserVisible(true)
  }

  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1 }}
      >
        {/* 상단 배너 광고 */}
        <View>
          <CenterAdCard />
        </View>
        <View className="gap-4 bg-bg px-4 pb-6">
          {/* 학사 일정 */}
          <View className="rounded-card bg-surface p-5">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-[17px] font-bold text-text-primary">
                잊지마세요! 주요 학사일정
              </Text>
              <MaterialIcons
                name="calendar-today"
                size={18}
                color={COLORS.textTertiary}
              />
            </View>
            <View className="gap-2.5">
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
                      className="w-full rounded-control bg-bg px-4 py-3"
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1 pr-3">
                          <Text className="text-[15px] font-semibold text-text-primary">
                            {plan.title}
                          </Text>
                          <Text className="mt-0.5 text-[13px] text-text-tertiary">
                            {plan.date}
                          </Text>
                        </View>
                        <View
                          className={`justify-center rounded-badge ${plan.dday.bgColor} px-2 py-1`}
                        >
                          <Text
                            className={`text-[13px] font-semibold ${plan.dday.textColor}`}
                          >
                            {plan.dday.text}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))
              ) : (
                <View className="w-full items-center justify-center rounded-control bg-bg px-4 py-6">
                  <Text className="text-center text-[13px] text-text-tertiary">
                    학사일정을 불러올 수 없어요
                  </Text>
                </View>
              )}
              <TouchableOpacity
                className="w-full items-center justify-center rounded-control bg-primary-soft px-4 py-3.5"
                onPress={() => handleOpenLink(academicScheduleUrl)}
                activeOpacity={0.7}
              >
                <Text className="text-[15px] font-semibold text-primary">
                  전체 학사일정 보기
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 빠른 바로가기 */}
          <View className="rounded-card bg-surface p-5">
            <Text className="mb-4 text-[17px] font-bold text-text-primary">
              빠른 바로가기
            </Text>
            <View className="flex-row flex-wrap justify-center gap-3">
              {quickItem.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  className="w-[30%] items-center gap-2.5 rounded-control bg-bg px-3 py-4 active:bg-surface-pressed"
                  onPress={() => handleOpenLink(item.link)}
                  activeOpacity={0.7}
                >
                  <View className="h-11 w-11 items-center justify-center rounded-full bg-primary-soft">
                    <MaterialIcons
                      name={item.icon as keyof typeof MaterialIcons.glyphMap}
                      size={22}
                      color={COLORS.primary}
                    />
                  </View>
                  <Text className="text-center text-[13px] font-medium text-text-secondary">
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
