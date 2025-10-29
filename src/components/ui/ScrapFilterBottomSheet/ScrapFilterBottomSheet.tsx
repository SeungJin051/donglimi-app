import { useMemo, useState } from 'react'

import { Ionicons } from '@expo/vector-icons'
import { View, Text, TouchableOpacity } from 'react-native'

import { NOTIFICATION_KEYWORDS } from '@/constants/keyword'
import { showSuccessToast } from '@/utils/toastUtils'

type SortOption = 'latest' | 'oldest'

interface ScrapFilterBottomSheetProps {
  sortBy: SortOption
  setSortBy: (sort: SortOption) => void
  selectedKeywords: Set<string>
  setSelectedKeywords: (keywords: Set<string>) => void
  onApply: () => void
}

export default function ScrapFilterBottomSheet({
  sortBy,
  setSortBy,
  selectedKeywords,
  setSelectedKeywords,
  onApply,
}: ScrapFilterBottomSheetProps) {
  // 로컬 임시 상태 (적용하기 전까지는 여기에만 저장)
  const [localSortBy, setLocalSortBy] = useState<SortOption>(sortBy)
  const [localSelectedKeywords, setLocalSelectedKeywords] = useState<
    Set<string>
  >(new Set(selectedKeywords))

  // 키워드 토글
  const toggleKeyword = (keyword: string) => {
    const next = new Set(localSelectedKeywords)
    if (next.has(keyword)) {
      next.delete(keyword)
    } else {
      next.add(keyword)
    }
    setLocalSelectedKeywords(next)
  }

  // 초기화
  const handleReset = () => {
    setLocalSortBy('latest')
    setLocalSelectedKeywords(new Set())
  }

  // 적용
  const handleApply = () => {
    // 적용하기 버튼을 눌렀을 때만 실제 상태 업데이트
    setSortBy(localSortBy)
    setSelectedKeywords(localSelectedKeywords)
    showSuccessToast('정렬/필터가 적용되었어요')
    onApply()
  }

  // 변경 여부 확인
  const hasChanges = useMemo(() => {
    // 정렬이 변경되었는지 확인
    const sortChanged = localSortBy !== sortBy

    // 키워드가 변경되었는지 확인
    const keywordsChanged =
      localSelectedKeywords.size !== selectedKeywords.size ||
      Array.from(localSelectedKeywords).some((k) => !selectedKeywords.has(k))

    return sortChanged || keywordsChanged
  }, [localSortBy, sortBy, localSelectedKeywords, selectedKeywords])

  return (
    <View className="flex-1 bg-white px-4">
      {/* 정렬 기준 - Segmented Control */}
      <View className="mb-6">
        <Text className="mb-3 text-base font-semibold text-gray-700">
          정렬 기준
        </Text>
        <View className="flex-row rounded-lg bg-gray-100 p-1">
          <TouchableOpacity
            className={`flex-1 rounded-md py-2.5 ${
              localSortBy === 'latest' ? 'bg-deu-light-blue' : 'bg-transparent'
            }`}
            onPress={() => setLocalSortBy('latest')}
          >
            <Text
              className={`text-center text-sm font-semibold ${
                localSortBy === 'latest' ? 'text-white' : 'text-gray-600'
              }`}
            >
              최신순
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 rounded-md py-2.5 ${
              localSortBy === 'oldest' ? 'bg-deu-light-blue' : 'bg-transparent'
            }`}
            onPress={() => setLocalSortBy('oldest')}
          >
            <Text
              className={`text-center text-sm font-semibold ${
                localSortBy === 'oldest' ? 'text-white' : 'text-gray-600'
              }`}
            >
              오래된순
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 구분선 */}
      <View className="mb-6 h-px bg-gray-200" />

      {/* 키워드 필터 - 칩 UI */}
      <View className="mb-6">
        <Text className="mb-3 text-base font-semibold text-gray-700">
          키워드 필터
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {Object.entries(NOTIFICATION_KEYWORDS).map(([key, value]) => {
            const isSelected = localSelectedKeywords.has(key)
            return (
              <TouchableOpacity
                key={key}
                className={`flex-row items-center gap-1.5 rounded-full px-4 py-2.5 ${
                  isSelected
                    ? 'bg-deu-light-blue'
                    : 'border border-gray-300 bg-white'
                }`}
                onPress={() => toggleKeyword(key)}
              >
                {isSelected && (
                  <Ionicons name="checkmark" size={14} color="white" />
                )}
                <Text
                  className={`text-sm font-medium ${
                    isSelected ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {value.title}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>

      {/* 푸터 - 고정 버튼 */}
      <View className="mt-auto border-t border-gray-200 bg-white pt-4">
        <View className="flex-row gap-3">
          <TouchableOpacity
            className="flex-1 rounded-lg border border-gray-300 bg-white py-4"
            onPress={handleReset}
          >
            <Text className="text-center text-sm font-semibold text-gray-700">
              초기화
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 rounded-lg py-4 ${
              hasChanges ? 'bg-deu-strong-blue' : 'bg-gray-300'
            }`}
            onPress={handleApply}
            disabled={!hasChanges}
          >
            <Text className="text-center text-sm font-semibold text-white">
              적용하기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
