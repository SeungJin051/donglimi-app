import { useCallback, useMemo, useRef, useState } from 'react'

import Feather from '@expo/vector-icons/Feather'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { View, Text, TouchableOpacity } from 'react-native'

import { useBottomSheetBackdrop } from '@/components/ui/BottomSheetBackdropComponent/BottomSheetBackdropComponent'
import ScrapFilterBottomSheet from '@/components/ui/ScrapFilterBottomSheet/ScrapFilterBottomSheet'
import { useFilteredAndSortedScraps } from '@/hooks/useFilteredAndSortedScraps'
import { useScrapStore } from '@/store/scrapStore'

import { ScrapList } from '../ScrapList/ScrapList'

export const ScrapContent = () => {
  // 스크랩 스토어 호출
  const { scraps, sortPreference, setSortPreference } = useScrapStore()

  // 키워드 필터 (세션 상태)
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(
    new Set()
  )

  // 스크랩 필터 바텀 시트 참조
  const scrapFilterBottomSheetRef = useRef<BottomSheetModal>(null)

  //  바텀 시트가 펼쳐질 높이(snap points) 설정
  const snapPoints = useMemo(() => ['70%'], [])

  // 필터링 및 정렬된 스크랩 목록
  const filteredAndSortedScraps = useFilteredAndSortedScraps({
    scraps,
    sortBy: sortPreference,
    selectedKeywords,
  })

  // 백드랍 렌더
  const renderBackdrop = useBottomSheetBackdrop()

  // 스크랩 필터 바텀 시트 열기
  const handleScrapFilterOpenPress = useCallback(() => {
    scrapFilterBottomSheetRef.current?.present()
  }, [])

  // 필터 적용 및 바텀시트 닫기
  const handleApplyFilter = useCallback(() => {
    scrapFilterBottomSheetRef.current?.dismiss()
  }, [])

  return (
    <View className="flex-1">
      {/* 정렬/필터 */}
      <View className="flex-row items-center justify-between border-b border-t border-gray-200 bg-white px-4 py-2">
        <TouchableOpacity
          className="flex-row items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2"
          onPress={handleScrapFilterOpenPress}
        >
          <Feather name="filter" size={14} color="black" />
          <Text className="text-sm font-medium">정렬/필터</Text>
        </TouchableOpacity>
        <Text className="text-sm text-gray-500">
          {filteredAndSortedScraps.length}개
        </Text>
      </View>

      {/* 스크랩 목록 */}
      <View className="flex-1">
        <ScrapList scraps={filteredAndSortedScraps} />
      </View>

      {/* 화면에 보일 BottomSheet */}
      <BottomSheetModal
        ref={scrapFilterBottomSheetRef}
        snapPoints={snapPoints}
        index={1}
        enablePanDownToClose={true}
        enableContentPanningGesture={false}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <ScrapFilterBottomSheet
            sortBy={sortPreference}
            setSortBy={setSortPreference}
            selectedKeywords={selectedKeywords}
            setSelectedKeywords={setSelectedKeywords}
            onApply={handleApplyFilter}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  )
}
