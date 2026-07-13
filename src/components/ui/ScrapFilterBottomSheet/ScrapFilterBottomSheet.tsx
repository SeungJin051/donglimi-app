import { useMemo, useState } from 'react'

import { Ionicons } from '@expo/vector-icons'
import { View, Text, TouchableOpacity } from 'react-native'

import { COLORS } from '@/constants/colors'
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
        <Text className="mb-3 text-[15px] font-bold text-text-primary">
          정렬 기준
        </Text>
        <View className="flex-row rounded-control bg-bg p-1">
          <TouchableOpacity
            className={`flex-1 rounded-[9px] py-2.5 ${
              localSortBy === 'latest' ? 'bg-surface' : 'bg-transparent'
            }`}
            onPress={() => setLocalSortBy('latest')}
            activeOpacity={0.8}
          >
            <Text
              className={`text-center text-[14px] font-semibold ${
                localSortBy === 'latest'
                  ? 'text-text-primary'
                  : 'text-text-tertiary'
              }`}
            >
              최신순
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 rounded-[9px] py-2.5 ${
              localSortBy === 'oldest' ? 'bg-surface' : 'bg-transparent'
            }`}
            onPress={() => setLocalSortBy('oldest')}
            activeOpacity={0.8}
          >
            <Text
              className={`text-center text-[14px] font-semibold ${
                localSortBy === 'oldest'
                  ? 'text-text-primary'
                  : 'text-text-tertiary'
              }`}
            >
              오래된순
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 구분선 */}
      <View className="mb-6 h-px bg-divider" />

      {/* 키워드 필터 - 칩 UI */}
      <View className="mb-6">
        <Text className="mb-3 text-[15px] font-bold text-text-primary">
          키워드 필터
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {Object.entries(NOTIFICATION_KEYWORDS).map(([key, value]) => {
            const isSelected = localSelectedKeywords.has(key)
            return (
              <TouchableOpacity
                key={key}
                className={`flex-row items-center gap-1.5 rounded-full px-4 py-2.5 ${
                  isSelected ? 'bg-primary-soft' : 'bg-bg'
                }`}
                onPress={() => toggleKeyword(key)}
                activeOpacity={0.8}
              >
                {isSelected && (
                  <Ionicons name="checkmark" size={14} color={COLORS.primary} />
                )}
                <Text
                  className={`text-[14px] font-semibold ${
                    isSelected ? 'text-primary' : 'text-text-secondary'
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
      <View className="mt-auto pb-2 pt-4">
        <View className="flex-row gap-3">
          <TouchableOpacity
            className="flex-1 rounded-control bg-bg py-4"
            onPress={handleReset}
            activeOpacity={0.8}
          >
            <Text className="text-center text-[15px] font-semibold text-text-secondary">
              초기화
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 rounded-control py-4 ${
              hasChanges ? 'bg-primary' : 'bg-text-disabled'
            }`}
            onPress={handleApply}
            disabled={!hasChanges}
            activeOpacity={0.8}
          >
            <Text className="text-center text-[15px] font-semibold text-white">
              적용하기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
