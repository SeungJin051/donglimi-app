import { useCallback, useState } from 'react'

import { MaterialIcons } from '@expo/vector-icons'
import { useFocusEffect } from 'expo-router'
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'

import InAppBrowser from '@/components/ui/InAppBrowser/InAppBrowser'
import { db } from '@/config/firebaseConfig'
import { quickItem } from '@/constants/utilContent'
import { useAcademicSchedule } from '@/hooks/useAcademicSchedule'
import { useInternetStatus } from '@/hooks/useInternetStatus'
import { Notice } from '@/types/notice.type'
import { getFormattedDate } from '@/utils/dateUtils'
import { calculateDDay } from '@/utils/dDay'

export const UtilContent = () => {
  const [popularPosts, setPopularPosts] = useState<Notice[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(true)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null)
  const { isOnline } = useInternetStatus()

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

  // useFocusEffect를 사용하여 화면이 포커스될 때마다 인기 공지사항을 로드합니다.
  useFocusEffect(
    useCallback(() => {
      const fetchPopularPosts = async () => {
        setIsLoading(true)
        setError(null)
        if (isOnline === false) {
          // 오프라인: 네트워크 호출 건너뛰고 로딩 종료
          setIsLoading(false)
          return
        }
        try {
          const noticesRef = collection(db, 'notices')

          // 파이어스토어 쿼리
          const q = query(
            noticesRef,
            where('scrap_count', '>=', 10), // 스크랩 10개 이상
            orderBy('scrap_count', 'desc'), // 스크랩 많은 순
            orderBy('published_at', 'desc'), // (동점 시) 최신순
            limit(3) // 최대 3개
          )

          const querySnapshot = await getDocs(q)
          const posts = querySnapshot.docs.map((doc) => ({
            ...(doc.data() as Notice),
            id: doc.id,
          }))

          setPopularPosts(posts)
        } catch (err) {
          console.error('인기 게시글 로드 실패:', err)
          setError('게시글을 불러오는 데 실패했습니다.')
        } finally {
          setIsLoading(false)
        }
      }

      fetchPopularPosts()
    }, [isOnline])
  )
  return (
    <>
      <ScrollView>
        <View className="gap-6 bg-gray-50 px-4 py-4">
          {/* 인기 공지사항 */}
          <View className="rounded-xl border border-gray-100 bg-white px-4 py-4">
            <View className="mb-5 flex-row items-center gap-2">
              <MaterialIcons name="moving" size={24} color="black" />
              <Text className="text-lg font-semibold">인기 공지사항 Top 3</Text>
            </View>
            <View className="flex-col gap-4">
              {popularPosts.map((item) => (
                <TouchableOpacity
                  key={item.content_hash}
                  className="w-full rounded-xl border border-gray-100 bg-gray-50 p-4"
                  onPress={() => handleOpenLink(item.link)}
                  activeOpacity={0.7}
                >
                  <Text className="text-base font-medium" numberOfLines={2}>
                    {item.title}
                  </Text>
                  <View className="mt-2.5 flex-row items-center justify-between">
                    <View className="flex-1 flex-row items-center gap-1.5">
                      {/* 학과 */}
                      <Text className="text-xs font-medium text-deu-light-blue">
                        {item.department}
                      </Text>
                      <Text className="text-xs text-gray-400">|</Text>
                      {/* 날짜 */}
                      <Text className="text-xs text-gray-500">
                        {getFormattedDate(item.saved_at)}
                      </Text>
                    </View>
                    {/* 스크랩 수 */}
                    <View className="flex-row items-center gap-0.5">
                      <MaterialIcons
                        name="bookmark"
                        size={14}
                        color="#093a87"
                      />
                      <Text className="text-xs font-medium text-gray-600">
                        {item.scrap_count}
                      </Text>
                    </View>
                  </View>
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
              {academicSchedules
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
                ))}
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
