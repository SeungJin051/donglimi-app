import { useRef, useMemo, useCallback, useState } from 'react'

import { Ionicons } from '@expo/vector-icons'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { View, Text, Switch, TouchableOpacity } from 'react-native'

import NotificationSettingHeader from '@/components/layout/NotificationSettingHeader/NotificationSettingHeader'
import { DepatmentBottomSheet } from '@/components/ui/DepatmentBottomSheet/DepatmentBottomSheet'
import { KeywordBottomSheet } from '@/components/ui/KeywordBottomSheet/KeyWordBottomSheet'
import {
  NOTIFICATION_KEYWORDS,
  type SelectedKeywords,
} from '@/constants/keyword'

export default function NotificationSetting() {
  // 선택된 키워드 상태 관리
  const [selectedKeywords, setSelectedKeywords] = useState<SelectedKeywords>({})
  // 선택된 학과 상태 관리 (학과 이름 저장)
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])

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

  // 키워드 업데이트 핸들러 (KeywordBottomSheet에서 호출)
  const handleKeywordUpdate = useCallback(
    (newSelectedKeywords: SelectedKeywords) => {
      setSelectedKeywords(newSelectedKeywords)
    },
    []
  )

  // 학과 업데이트 핸들러 (DepatmentBottomSheet에서 호출)
  const handleDepartmentUpdate = useCallback(
    (newSelectedDepartments: string[]) => {
      setSelectedDepartments(newSelectedDepartments)
    },
    []
  )

  return (
    <View className="flex-1 gap-5">
      {/* 헤더 섹션 */}
      <NotificationSettingHeader />

      <View className="gap-5 px-4">
        {/* 전체 푸시 알림 설정 섹션 */}
        <View className="rounded-xl border border-gray-200 bg-white px-4 py-4">
          <View className="flex-row items-center justify-between">
            <Text className="font-semibold">🔔 전체 푸시 알림 받기</Text>

            <Switch />
          </View>
        </View>

        {/* 키워드 알림 설정 섹션 */}
        <View className="gap-7 rounded-xl border border-gray-200 bg-white px-4 py-4">
          <View>
            <Text className="font-semibold">키워드 알림</Text>
          </View>

          {/* 키워드 태그 목록 */}
          <View className="flex flex-row flex-wrap gap-2">
            {Object.keys(selectedKeywords).length > 0 ? (
              Object.entries(selectedKeywords)
                .filter(([_, isSelected]) => isSelected)
                .map(([categoryKey, _]) => {
                  const category =
                    NOTIFICATION_KEYWORDS[
                      categoryKey as keyof typeof NOTIFICATION_KEYWORDS
                    ]
                  return (
                    <View
                      key={categoryKey}
                      className="flex flex-row items-center justify-center gap-1 rounded-full bg-blue-100 px-4 py-2 text-sm"
                    >
                      <TouchableOpacity>
                        <Text className="text-sm text-blue-700">
                          {category.title}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          const newKeywords = { ...selectedKeywords }
                          delete (newKeywords as Record<string, boolean>)[
                            categoryKey
                          ]
                          handleKeywordUpdate(newKeywords)
                        }}
                      >
                        <Ionicons
                          name="close-outline"
                          size={16}
                          color="#3B82F6"
                        />
                      </TouchableOpacity>
                    </View>
                  )
                })
            ) : (
              <View className="flex flex-row items-center justify-center gap-1 rounded-full bg-gray-100 px-4 py-2 text-sm">
                <TouchableOpacity>
                  <Text className="text-sm text-gray-500">
                    키워드를 선택하세요
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* 키워드 추가 버튼 */}
          <View>
            <TouchableOpacity
              className="flex-row items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-2"
              onPress={handleKeywordOpenPress}
            >
              <Ionicons name="add" size={20} color="black" />

              <Text>
                {Object.keys(selectedKeywords).length > 0
                  ? '키워드 수정'
                  : '키워드 추가'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 학과 공지 알림 설정 섹션 */}
        <View className="gap-7 rounded-xl border border-gray-200 bg-white px-4 py-4">
          <View>
            <Text className="font-semibold">학과 공지 알림</Text>
          </View>

          {/* 학과 태그 목록 */}
          <View className="flex flex-row flex-wrap gap-2">
            {selectedDepartments.length > 0 ? (
              selectedDepartments.map((departmentName) => (
                <View
                  key={departmentName}
                  className="flex flex-row items-center justify-center gap-1 rounded-full bg-blue-100 px-4 py-2 text-sm"
                >
                  <TouchableOpacity>
                    <Text className="text-sm text-blue-700">
                      {departmentName}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      handleDepartmentUpdate(
                        selectedDepartments.filter(
                          (name) => name !== departmentName
                        )
                      )
                    }
                  >
                    <Ionicons name="close-outline" size={16} color="#3B82F6" />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View className="flex flex-row items-center justify-center gap-1 rounded-full bg-gray-100 px-4 py-2 text-sm">
                <TouchableOpacity>
                  <Text className="text-sm text-gray-500">
                    학과를 선택하세요
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* 학과 추가 버튼 */}
          <View>
            <TouchableOpacity
              className="flex-row items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-2"
              onPress={handleDepartmentOpenPress}
            >
              <Ionicons name="add" size={20} color="black" />

              <Text>
                {selectedDepartments.length > 0 ? `학과 수정 ` : '학과 추가'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* 화면에 보일 BottomSheet */}
      <BottomSheetModal
        ref={keywordBottomSheetRef}
        snapPoints={snapPoints}
        index={1}
        enablePanDownToClose={true}
        enableContentPanningGesture={false}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <KeywordBottomSheet
            selectedKeywords={selectedKeywords}
            onKeywordsUpdate={handleKeywordUpdate}
          />
        </BottomSheetView>
      </BottomSheetModal>

      {/* 화면에 보일 BottomSheet */}
      <BottomSheetModal
        ref={departmentBottomSheetRef}
        snapPoints={snapPoints}
        index={1}
        enablePanDownToClose={true}
        enableContentPanningGesture={false}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <DepatmentBottomSheet
            selectedDepartments={selectedDepartments}
            onDepartmentsUpdate={handleDepartmentUpdate}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  )
}
