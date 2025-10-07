import { useEffect, useRef } from 'react'

import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import Feather from '@expo/vector-icons/Feather'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'

export const ScrapItem = () => {
  const inputRef = useRef<TextInput>(null)

  // 화면 진입 시 키보드 자동으로 올리기
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 200)
    return () => clearTimeout(timer)
  }, [])

  // 임시 데이터
  const scraps = [
    {
      id: '1',
      title: '2025학년도 2학기 자격 시험 결과 발표 예정일 안내',
      department: '컴퓨터공학과',
      tag: ['#학사'],
      date: '2025.10.06',
    },
    {
      id: '2',
      title: '다른 스크랩입니다',
      department: '컴퓨터공학과',
      tag: ['#공지'],
      date: '2025.10.06',
    },
  ]

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="gap-5">
        <View>
          {/* 검색 */}
          <View className="border-b border-t border-gray-200 bg-white px-4 py-3">
            <View className="relative">
              <TextInput
                ref={inputRef}
                className="h-11 rounded-2xl bg-gray-100 pl-11 pr-4 text-base"
                placeholderTextColor="#9CA3AF"
                placeholder="스크랩한 공지 검색"
              />
              <View className="absolute left-4 top-0 h-full justify-center">
                <Ionicons name="search" size={20} color="#6B7280" />
              </View>
            </View>
          </View>

          {/* 정렬/필터 */}
          <View className="flex-row items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
            <TouchableOpacity className="flex-row items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2">
              <Feather name="filter" size={14} color="black" />
              <Text className="text-sm font-medium">정렬/필터</Text>
            </TouchableOpacity>
            <Text className="text-sm text-gray-500">{scraps.length}개</Text>
          </View>
        </View>

        {/* 스크랩 목록 */}
        <View className="px-4">
          {scraps.map((scrap) => (
            <View
              key={scrap.id}
              className="mb-3 min-h-[100px] rounded-lg border border-gray-100 bg-white p-4"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1 gap-2">
                  <Text className="font-medium">{scrap.title}</Text>
                  <View className="flex-row items-center gap-2">
                    <Text className="ml-[-4px] rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-gray-700">
                      {scrap.department}
                    </Text>
                    <Text className="text-xs text-gray-700">{scrap.tag}</Text>
                  </View>
                  <Text className="text-sm text-gray-500">{scrap.date}</Text>
                </View>
                <TouchableOpacity>
                  <MaterialIcons
                    name="delete-outline"
                    size={20}
                    color="#999999"
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}
