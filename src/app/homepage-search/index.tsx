import { useEffect, useRef, useState } from 'react'

import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useSearchStore } from '@/store/searchStore'

export default function HomepageSearch() {
  const router = useRouter()
  const inputRef = useRef<TextInput>(null)

  // ref의 focus() 메서드를 호출하여 키패드를 올립니다.
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 200)

    // 컴포넌트가 언마운트될 때 타이머를 정리해줍니다. (메모리 누수 방지)
    return () => clearTimeout(timer)
  }, [])

  // 초기 검색 값
  const [searchTerm, setSearchTerm] = useState('')
  const [editMode, setEditMode] = useState(false)

  const { searchHistory, addHistory, removeHistory, clearHistory } =
    useSearchStore()

  const handleSearch = () => {
    addHistory(searchTerm) // 검색 기록 추가
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView className="flex-1 bg-white px-4">
        {/* 헤더 부분  */}
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold">공지 검색</Text>
        </View>

        {/* 검색 입력 부분 */}
        <View className="text- relative justify-center py-6">
          <TextInput
            className="rounded-xl bg-gray-100 py-3 pl-11 text-base"
            placeholder="검색"
            returnKeyType="search"
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearch}
            ref={inputRef}
          />

          <View className="absolute bottom-0 left-3 top-0 justify-center">
            <Ionicons name="search" size={20} color="#999999" />
          </View>
        </View>

        {/* 검색 기록 헤더 부분 */}
        {searchHistory.length === 0 ? (
          <View className="flex flex-1 items-center">
            <Text className="text-lg font-extralight">
              검색 기록이 없습니다.
            </Text>
          </View>
        ) : (
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-semibold">최근 검색</Text>
            <View className="flex flex-row items-center justify-center gap-4">
              {editMode && (
                <TouchableOpacity onPress={() => clearHistory()}>
                  <Text className="text-base font-normal text-gray-400">
                    모두 지우기
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => setEditMode(!editMode)}>
                {!editMode ? (
                  <Text className="text-base font-normal text-gray-400">
                    수정
                  </Text>
                ) : (
                  <Text className="text-base font-semibold">완료</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 검색 기록 리스트 부분 */}
        <View className="py-6">
          <View className="flex flex-row gap-2">
            {searchHistory.map((history) => (
              <View
                key={history}
                className="flex flex-row items-center justify-center gap-1 rounded-full bg-gray-100 px-4 py-2 text-sm"
              >
                <TouchableOpacity
                  onPress={() => {
                    if (!editMode) {
                      console.log(history)
                    }
                  }}
                  disabled={editMode}
                >
                  <Text className="text-sm">{history}</Text>
                </TouchableOpacity>
                {editMode && (
                  <TouchableOpacity onPress={() => removeHistory(history)}>
                    <Ionicons name="close-outline" size={16} color="#999999" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}
