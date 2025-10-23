import { useRef, useMemo, useCallback } from 'react'

import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { View, Text, Switch } from 'react-native'

import NotificationSettingHeader from '@/components/layout/NotificationSettingHeader/NotificationSettingHeader'
import { useBottomSheetBackdrop } from '@/components/ui/BottomSheetBackdropComponent/BottomSheetBackdropComponent'
import { DepatmentBottomSheet } from '@/components/ui/DepatmentBottomSheet/DepatmentBottomSheet'
import { KeywordBottomSheet } from '@/components/ui/KeywordBottomSheet/KeyWordBottomSheet'
import { TagList } from '@/components/ui/TagList/TagList'
import { NOTIFICATION_KEYWORDS } from '@/constants/keyword'
import { useNotificationSettings } from '@/hooks/useNotificationSettings'

export default function NotificationSetting() {
  // 알림 설정 관련 비즈니스 로직
  const {
    selectedKeywords,
    selectedDepartments,
    notificationEnabled,
    handleNotificationToggle,
    handleKeywordUpdate,
    handleDepartmentUpdate,
    handleKeywordRemove,
    handleDepartmentRemove,
  } = useNotificationSettings()

  // 백드랍 렌더
  const renderBackdrop = useBottomSheetBackdrop()

  // BottomSheet를 제어하기 위한 ref 생성
  const keywordBottomSheetRef = useRef<BottomSheetModal>(null)
  const departmentBottomSheetRef = useRef<BottomSheetModal>(null)

  //  바텀 시트가 펼쳐질 높이(snap points) 설정
  const snapPoints = useMemo(() => ['90%'], [])

  // 바텀 시트를 펼치는 함수
  const handleKeywordOpenPress = useCallback(() => {
    keywordBottomSheetRef.current?.present()
  }, [])

  const handleDepartmentOpenPress = useCallback(() => {
    departmentBottomSheetRef.current?.present()
  }, [])

  // 키워드 태그 데이터 변환
  const keywordTags = useMemo(() => {
    return Object.entries(selectedKeywords)
      .filter(([_, isSelected]) => isSelected)
      .map(([categoryKey, _]) => {
        const category =
          NOTIFICATION_KEYWORDS[
            categoryKey as keyof typeof NOTIFICATION_KEYWORDS
          ]
        return {
          id: categoryKey,
          title: category.title,
        }
      })
  }, [selectedKeywords])

  // 학과 태그 데이터 변환
  const departmentTags = useMemo(() => {
    return selectedDepartments.map((departmentName) => ({
      id: departmentName,
      title: departmentName,
    }))
  }, [selectedDepartments])

  const handleCloseKeywords = useCallback(() => {
    keywordBottomSheetRef.current?.dismiss()
  }, [])

  const handleCloseDepartments = useCallback(() => {
    departmentBottomSheetRef.current?.dismiss()
  }, [])

  return (
    <View className="flex-1 gap-5 bg-gray-50">
      {/* 헤더 섹션 */}
      <NotificationSettingHeader />

      <View className="gap-5 px-4">
        {/* 푸시 알림 설정 섹션 */}
        <View className="rounded-xl border border-gray-200 bg-white px-4 py-4">
          <View className="flex-row items-center justify-between">
            <Text className="font-semibold">🔔 푸시 알림 받기</Text>

            <Switch
              value={notificationEnabled}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
              thumbColor={notificationEnabled ? '#093a87' : '#F3F4F6'}
            />
          </View>
          {/* 푸시 알림 설정 설명 - OFF 상태일 때만 표시 */}
          {!notificationEnabled && (
            <Text className="text-sm text-gray-500">
              푸시 알림이 꺼져 있습니다. 알림을 받고 싶다면 켜주세요.
            </Text>
          )}
        </View>

        {/* 키워드 알림 설정 섹션 */}
        <View className="gap-7 rounded-xl border border-gray-200 bg-white px-4 py-4">
          <View>
            <Text className="font-semibold">키워드 알림</Text>
          </View>

          <TagList
            items={keywordTags}
            onRemove={handleKeywordRemove}
            onAdd={handleKeywordOpenPress}
            emptyText="키워드를 선택하세요"
            addButtonText="키워드"
          />
        </View>

        {/* 학과 공지 알림 설정 섹션 */}
        <View className="gap-7 rounded-xl border border-gray-200 bg-white px-4 py-4">
          <View>
            <Text className="font-semibold">학과 공지 알림</Text>
          </View>

          <TagList
            items={departmentTags}
            onRemove={handleDepartmentRemove}
            onAdd={handleDepartmentOpenPress}
            emptyText="학과를 선택하세요"
            addButtonText="학과"
          />
        </View>
      </View>
      {/* 화면에 보일 BottomSheet */}
      <BottomSheetModal
        ref={keywordBottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableContentPanningGesture={false}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <KeywordBottomSheet
            selectedKeywords={selectedKeywords}
            onKeywordsUpdate={handleKeywordUpdate}
            onComplete={handleCloseKeywords}
          />
        </BottomSheetView>
      </BottomSheetModal>

      {/* 화면에 보일 BottomSheet */}
      <BottomSheetModal
        ref={departmentBottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableContentPanningGesture={false}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <DepatmentBottomSheet
            selectedDepartments={selectedDepartments}
            onDepartmentsUpdate={handleDepartmentUpdate}
            onComplete={handleCloseDepartments}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  )
}
