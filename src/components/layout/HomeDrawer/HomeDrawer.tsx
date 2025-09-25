import React, { useCallback, useMemo, useRef } from 'react'

import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { DrawerContentScrollView } from '@react-navigation/drawer'
import { View, Text, TouchableOpacity } from 'react-native'

// 구독 아이템 타입 정의
interface Subscription {
  id: string
  name: string
}

// 초기 구독 목록 데이터
const MOCK_DATA: Subscription[] = [
  { id: '1', name: '컴퓨터공학과' },
  { id: '2', name: '경영정보학과' },
  { id: '3', name: '건축학과' },
]

export default function HomeDrawer() {
  // BottomSheet를 제어하기 위한 ref 생성
  const bottomSheetRef = useRef<BottomSheetModal>(null)

  //  바텀 시트가 펼쳐질 높이(snap points) 설정
  const snapPoints = useMemo(() => ['90%'], [])

  // 바텀 시트를 펼치는 함수
  const handleOpenPress = useCallback(() => {
    bottomSheetRef.current?.present()
  }, [])

  // 백드랍 렌더
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    []
  )

  // 구독 아이템 렌더링 함수
  const renderSubscriptionItem = (item: Subscription, index: number) => (
    <TouchableOpacity
      key={item.id}
      className={`ml-5 w-full flex-row border-b border-gray-300 py-6 ${
        index === MOCK_DATA.length - 1 ? 'border-b-0' : ''
      }`}
    >
      <Text className="text-base font-semibold">{item.name}</Text>
    </TouchableOpacity>
  )

  return (
    <View className="flex-1 bg-gray-200">
      <DrawerContentScrollView>
        {/* === 상단 컨트롤 === */}
        <View className="mb-3 w-full flex-row items-center justify-between px-4 py-4">
          <Text className="text-2xl font-bold">공지</Text>
          <View className="flex-row items-center gap-7">
            <TouchableOpacity onPress={() => {}}>
              <AntDesign name="plus-circle" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleOpenPress}>
              <MaterialCommunityIcons
                name="pencil-outline"
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* === 추천 섹션 === */}
        <View className="w-full">
          <View className="flex-col items-center overflow-hidden rounded-3xl border border-gray-300 bg-white">
            <View className="w-full">
              <TouchableOpacity onPress={() => {}}>
                <Text className="ml-5 w-full border-b border-gray-300 py-6 text-base font-semibold">
                  추천
                </Text>
              </TouchableOpacity>
            </View>
            <View className="w-full flex-col">
              {MOCK_DATA.map((item, index) =>
                renderSubscriptionItem(item, index)
              )}
            </View>
          </View>
        </View>
      </DrawerContentScrollView>

      {/* 화면에 보일 BottomSheet */}
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={1}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView className="flex-1 p-6">
          <Text className="text-lg font-semibold mb-4">공지 수정</Text>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  )
}
