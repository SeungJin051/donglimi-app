import { useState } from 'react'

import { View, Text, TouchableOpacity } from 'react-native'

import {
  NOTIFICATION_KEYWORDS,
  KEYWORD_CATEGORIES,
  type SelectedKeywords,
} from '@/constants/keyword'
import { showSuccessToast } from '@/utils/toastUtils'

interface KeywordBottomSheetProps {
  selectedKeywords?: SelectedKeywords
  onKeywordsUpdate?: (keywords: SelectedKeywords) => void
  onComplete?: () => void
}

export const KeywordBottomSheet = ({
  selectedKeywords: initialSelectedKeywords = {},
  onKeywordsUpdate,
  onComplete,
}: KeywordBottomSheetProps) => {
  const [selectedKeywords, setSelectedKeywords] = useState<SelectedKeywords>(
    initialSelectedKeywords
  )

  const handleKeywordToggle = (
    categoryKey: keyof typeof NOTIFICATION_KEYWORDS
  ) => {
    const isCurrentlySelected = selectedKeywords[categoryKey] || false

    let newSelectedKeywords: SelectedKeywords
    if (isCurrentlySelected) {
      // 선택 해제 시 키를 완전히 제거
      const tempKeywords = { ...selectedKeywords }
      delete (tempKeywords as Record<string, boolean>)[categoryKey]
      newSelectedKeywords = tempKeywords
    } else {
      // 선택 시 키 추가
      newSelectedKeywords = {
        ...selectedKeywords,
        [categoryKey]: true,
      }
    }

    setSelectedKeywords(newSelectedKeywords)
    onKeywordsUpdate?.(newSelectedKeywords)
  }

  const handleComplete = () => {
    // 선택 완료 처리 로직
    console.log('선택된 키워드들:', selectedKeywords)
    // 상위 컴포넌트에 선택된 키워드 전달
    onKeywordsUpdate?.(selectedKeywords)
    showSuccessToast('키워드가 업데이트되었어요')
    onComplete?.()
  }

  const renderKeywordSelection = () => (
    <>
      {/* 헤더 부분 */}
      <View className="mb-6">
        <Text className="mb-2 text-center text-lg font-semibold">
          키워드 선택
        </Text>
        <Text className="text-center text-sm text-gray-600">
          관심 있는 키워드를 선택하세요 (복수 선택 가능)
        </Text>
      </View>

      {/* 키워드 카테고리 목록 */}
      <View className="mb-4 flex-1">
        {KEYWORD_CATEGORIES.map((categoryKey) => {
          const category = NOTIFICATION_KEYWORDS[categoryKey]
          const isSelected = selectedKeywords[categoryKey] || false

          return (
            <TouchableOpacity
              key={categoryKey}
              className={`mb-3 rounded-lg border p-4 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white'
              }`}
              onPress={() => handleKeywordToggle(categoryKey)}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text
                    className={`mb-1 text-base font-medium ${
                      isSelected ? 'text-blue-700' : 'text-gray-900'
                    }`}
                  >
                    {category.title}
                  </Text>
                  <Text
                    className={`text-sm ${
                      isSelected ? 'text-blue-600' : 'text-gray-500'
                    }`}
                  >
                    {category.description}
                  </Text>
                </View>
                <View
                  className={`ml-4 h-6 w-6 items-center justify-center rounded-full border-2 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}
                >
                  {isSelected && (
                    <Text className="text-sm font-bold text-white">✓</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )
        })}
      </View>

      {/* 완료 버튼 */}
      {Object.keys(selectedKeywords).length > 0 && (
        <TouchableOpacity
          className="mb-2 rounded-lg bg-blue-500 p-4"
          onPress={handleComplete}
        >
          <Text className="text-center text-lg font-semibold text-white">
            선택 완료 ({Object.keys(selectedKeywords).length}개 선택)
          </Text>
        </TouchableOpacity>
      )}
    </>
  )

  return (
    <View className="bg-white" style={{ flex: 1, padding: 16 }}>
      {renderKeywordSelection()}
    </View>
  )
}
