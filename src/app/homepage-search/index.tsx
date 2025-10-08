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
  FlatList,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { NoticeItem } from '@/components/notice/NoticeItem/NoticeItem'
import { useFetchNotices } from '@/hooks/useFetchNotices'
import { useSearchStore } from '@/store/searchStore'
import { Notice } from '@/types/notice.type'

export default function HomepageSearch() {
  const router = useRouter()
  const inputRef = useRef<TextInput>(null)

  // 화면 진입 시 키보드 자동으로 올리기
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 200)
    return () => clearTimeout(timer)
  }, [])

  const [searchTerm, setSearchTerm] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [searchResults, setSearchResults] = useState<Notice[]>([])
  const [hasSearched, setHasSearched] = useState(false) // 검색을 시도했는지 여부

  const { searchHistory, addHistory, removeHistory, clearHistory } =
    useSearchStore()

  // 임시 공지사항 데이터
  const { data: notices = [] } = useFetchNotices(100)

  // 검색어 변경 핸들러
  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term)
    // 검색어가 비워지면 검색 시도 상태를 초기화하여 '최근 검색' 화면으로 돌아감
    if (term.trim() === '') {
      setHasSearched(false)
      setSearchResults([])
    }
  }

  // 검색 실행 함수
  const executeSearch = (term: string) => {
    const trimmedTerm = term.trim()
    if (!trimmedTerm) {
      setHasSearched(false)
      return
    }

    addHistory(trimmedTerm) // 검색 기록 추가
    setHasSearched(true) // 검색 시도 상태로 변경

    const results = notices.filter(
      (notice: Notice) =>
        notice.title.toLowerCase().includes(trimmedTerm.toLowerCase()) ||
        notice.department.toLowerCase().includes(trimmedTerm.toLowerCase()) ||
        notice.tags.some((tag: string) =>
          tag.toLowerCase().includes(trimmedTerm.toLowerCase())
        )
    )
    setSearchResults(results)
  }

  // 검색 기록 클릭 핸들러
  const handleHistoryPress = (historyTerm: string) => {
    setSearchTerm(historyTerm)
    executeSearch(historyTerm)
  }

  // 뒤로가기 핸들러
  const handleBack = () => {
    setSearchTerm('')
    setHasSearched(false)
    router.back()
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView className="flex-1 bg-white px-4">
        {/* 헤더 부분 */}
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold">공지 검색</Text>
        </View>

        {/* 검색 입력 부분 */}
        <View className="relative justify-center py-6">
          <TextInput
            ref={inputRef}
            className="h-12 rounded-xl bg-gray-100 py-0 pl-11 text-base"
            placeholderTextColor="#B0B0B0"
            placeholder="검색"
            returnKeyType="search"
            value={searchTerm}
            onChangeText={handleSearchTermChange}
            onSubmitEditing={() => executeSearch(searchTerm)}
            style={{ textAlignVertical: 'center' }}
          />
          <View className="absolute bottom-0 left-3 top-0 justify-center">
            <Ionicons name="search" size={20} color="#999999" />
          </View>
        </View>

        {/* 컨텐츠 영역 */}
        <View className="flex-1">
          {hasSearched ? (
            searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                renderItem={({ item }) => <NoticeItem item={item} />}
                keyExtractor={(item) => item.content_hash}
                showsVerticalScrollIndicator={false}
                onScrollBeginDrag={Keyboard.dismiss}
              />
            ) : (
              <View className="flex-1 items-center">
                <Text className="text-lg text-gray-400">
                  검색 결과가 없습니다.
                </Text>
              </View>
            )
          ) : searchHistory.length > 0 ? (
            <View>
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
            <View className="flex-1 items-center">
              <Text className="text-lg text-gray-400">
                검색 기록이 없습니다.
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}
