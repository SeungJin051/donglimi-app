import { useCallback, useEffect, useRef, useState } from 'react'

import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { NoticeContent } from '@/components/notice/NoticeContent/NoticeContent'
import { useAlgoliaSearch } from '@/hooks/useAlgoliaSearch'
import { useSearchStore } from '@/store/searchStore'
import { Notice } from '@/types/notice.type'

export default function HomepageSearch() {
  const router = useRouter()
  const inputRef = useRef<TextInput>(null)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 화면 진입 시 키보드 자동으로 올리기
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 200)
    return () => clearTimeout(timer)
  }, [])

  const [searchTerm, setSearchTerm] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [hasSearched, setHasSearched] = useState(false) // 검색을 시도했는지 여부

  const { searchHistory, addHistory, removeHistory, clearHistory } =
    useSearchStore()

  // Algolia 검색 훅 사용
  const { searchResults, isLoading, error, search, clearResults } =
    useAlgoliaSearch()

  // 디바운스된 검색 함수
  const debouncedSearch = useCallback(
    (term: string) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
        debounceTimer.current = null
      }

      debounceTimer.current = setTimeout(() => {
        search(term)
      }, 300)
    },
    [search]
  )

  // 검색어 변경 핸들러 (실시간 검색 포함)
  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term)

    // 검색어가 비워지면 검색 시도 상태를 초기화하여 '최근 검색' 화면으로 돌아감
    if (term.trim() === '') {
      setHasSearched(false)
      clearResults()
      return
    }

    // 실시간 검색 (2글자 이상부터)
    const trimmedTerm = term.trim()
    if (trimmedTerm.length >= 2) {
      setHasSearched(true)
      debouncedSearch(trimmedTerm)
    } else {
      setHasSearched(false)
      clearResults()
    }
  }

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
        debounceTimer.current = null
      }
    }
  }, [])

  // 검색 실행 함수 (Algolia 사용)
  const executeSearch = async (term: string) => {
    const trimmedTerm = term.trim()
    if (!trimmedTerm) {
      setHasSearched(false)
      return
    }

    addHistory(trimmedTerm) // 검색 기록 추가
    setHasSearched(true) // 검색 시도 상태로 변경

    // Algolia 검색 실행
    await search(trimmedTerm)
  }

  // 검색 기록 클릭 핸들러 (즉시 검색)
  const handleHistoryPress = async (historyTerm: string) => {
    setSearchTerm(historyTerm)
    addHistory(historyTerm)
    setHasSearched(true)
    await search(historyTerm)
  }

  // 뒤로가기 핸들러
  const handleBack = () => {
    setSearchTerm('')
    setHasSearched(false)
    clearResults()
    router.back()
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView className="flex-1 bg-white">
        {/* 헤더 부분 */}
        <View className="flex-row items-center gap-4 px-4">
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold">공지 검색</Text>
        </View>

        {/* 검색 입력 부분 */}
        <View className="relative justify-center px-4 py-6">
          <TextInput
            ref={inputRef}
            className="h-12 rounded-xl bg-gray-100 py-0 pl-11 text-base"
            placeholderTextColor="#B0B0B0"
            placeholder="어떤 공지사항을 찾으세요?"
            returnKeyType="search"
            value={searchTerm}
            onChangeText={handleSearchTermChange}
            onSubmitEditing={() => executeSearch(searchTerm)}
            style={{ textAlignVertical: 'center' }}
          />
          <View className="absolute bottom-0 left-7 top-0 justify-center">
            <Ionicons name="search" size={20} color="#999999" />
          </View>
        </View>

        {/* 컨텐츠 영역 */}
        <View className="flex-1">
          {hasSearched ? (
            isLoading ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#007AFF" />
              </View>
            ) : error ? (
              <View className="flex-1 items-center px-8 pt-16">
                <Text className="text-xl font-bold text-gray-900">
                  결과를 불러올 수 없어요
                </Text>
                <Text className="mt-2 text-center text-base text-gray-500">
                  네트워크 상태를 확인한 뒤 다시 시도해주세요.
                </Text>
              </View>
            ) : searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                renderItem={({ item }) => <NoticeContent item={item} />}
                keyExtractor={(item) =>
                  (item as Notice & { objectID?: string }).objectID ||
                  item.content_hash
                }
                showsVerticalScrollIndicator={false}
                onScrollBeginDrag={Keyboard.dismiss}
              />
            ) : (
              <View className="flex-1 items-center px-8 pt-16">
                <Text className="text-xl font-bold text-gray-900">
                  검색 결과가 없어요
                </Text>
                <Text className="mt-2 text-center text-base text-gray-500">
                  단어를 줄이거나 다른 키워드로 다시 검색해보세요.
                </Text>
              </View>
            )
          ) : searchHistory.length > 0 ? (
            <View className="px-4">
              <View className="mb-4 flex-row items-center justify-between">
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
                    <Text
                      className={`text-base ${
                        editMode ? 'font-semibold' : 'font-normal text-gray-400'
                      }`}
                    >
                      {editMode ? '완료' : '수정'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View className="flex flex-row flex-wrap gap-2">
                {searchHistory.map((history, index) => (
                  <View
                    key={`${history}-${index}`}
                    className="flex flex-row items-center justify-center gap-1 rounded-full bg-gray-100 px-4 py-2 text-sm"
                  >
                    <TouchableOpacity
                      onPress={() => !editMode && handleHistoryPress(history)}
                      disabled={editMode}
                    >
                      <Text className="text-sm">{history}</Text>
                    </TouchableOpacity>
                    {editMode && (
                      <TouchableOpacity onPress={() => removeHistory(history)}>
                        <Ionicons
                          name="close-outline"
                          size={16}
                          color="#999999"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View className="flex-1 items-center px-8 pt-16">
              <Text className="text-xl font-bold text-gray-900">
                검색 기록이 없어요
              </Text>
              <Text className="mt-2 text-center text-base text-gray-500">
                최근 검색어가 여기에 표시됩니다.
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}
