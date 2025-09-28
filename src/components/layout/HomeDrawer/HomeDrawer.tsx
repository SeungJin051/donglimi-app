import React, { useCallback, useMemo, useRef } from 'react'

import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer'
import { DrawerActions } from '@react-navigation/native'
import { useRouter } from 'expo-router'
import { View, Text, TouchableOpacity } from 'react-native'

import { useCategoryStore } from '@/store/categoryStore'

// 구독 아이템 타입 정의
interface Subscription {
  id: string
  name: string
}

export default function HomeDrawer({
  navigation,
}: DrawerContentComponentProps) {
  const router = useRouter()

  // BottomSheet를 제어하기 위한 ref 생성
  const bottomSheetRef = useRef<BottomSheetModal>(null)

  //  바텀 시트가 펼쳐질 높이(snap points) 설정
  const snapPoints = useMemo(() => ['90%'], [])

  // 바텀 시트를 펼치는 함수
  const handleOpenPress = useCallback(() => {
    bottomSheetRef.current?.present()
  }, [])

  // 공지 추가 버튼 클릭 시 공지 구독 관리 페이지로 이동
  const handleManageNoticePress = () => {
    navigation.dispatch(DrawerActions.closeDrawer())
    router.push('/managing-notification-subscriptions')
  }

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

  const { subscribedCategories } = useCategoryStore()

  // 구독 아이템 렌더링 함수
  const renderSubscriptionItem = (item: Subscription, index: number) => (
    <TouchableOpacity
      key={item.id}
      className={`ml-5 w-full flex-row border-b border-gray-300 py-6 ${
        index === subscribedCategories.length - 1 ? 'border-b-0' : ''
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
          <Text className="text-2xl font-bold">공지 피드</Text>
          <View className="flex-row items-center gap-7">
            <TouchableOpacity onPress={handleManageNoticePress}>
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
              {subscribedCategories.map((item, index) =>
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
          <Text className="mb-4 text-lg font-semibold">공지 수정</Text>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  )
}
