import React, { useCallback, useMemo, useRef } from 'react'

import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer'
import { DrawerActions } from '@react-navigation/native'
import { useRouter } from 'expo-router'
import { View, Text, TouchableOpacity } from 'react-native'

import EditingNotificationSubscriptions from '@/app/editing-notification-subscriptions'
import { useBottomSheetBackdrop } from '@/components/ui/BottomSheetBackdropComponent/BottomSheetBackdropComponent'
import { COLORS } from '@/constants/colors'
import { useCategoryFilterStore } from '@/store/categoryFilterStore'
import { useCategoryStore } from '@/store/categoryStore'
import { Subscription } from '@/types/category.type'

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

  // 바텀 시트를 닫는 함수
  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close()
  }, [])

  // 공지 추가 버튼 클릭 시 공지 구독 관리 페이지로 이동
  const handleManageNoticePress = () => {
    navigation.dispatch(DrawerActions.closeDrawer())
    router.push('/managing-notification-subscriptions')
  }

  // 백드랍 렌더
  const renderBackdrop = useBottomSheetBackdrop()

  const { subscribedCategories } = useCategoryStore()
  const { selectedCategory, setSelectedCategory, clearCategory } =
    useCategoryFilterStore()

  // 카테고리 클릭 핸들러
  const handleCategoryPress = useCallback(
    (categoryName: string) => {
      if (selectedCategory === categoryName) {
        // 이미 선택된 카테고리를 다시 클릭하면 그냥 해당 카테고리 유지
      } else {
        // 새로운 카테고리를 선택
        setSelectedCategory(categoryName)
      }
      // 드로어 닫기
      navigation.dispatch(DrawerActions.closeDrawer())
    },
    [selectedCategory, setSelectedCategory, navigation]
  )

  // 구독 아이템 렌더링 함수
  const renderSubscriptionItem = useCallback(
    (item: Subscription, index: number) => (
      <View key={item.id}>
        {index > 0 && <View className="mx-3.5 h-[1px] bg-stroke" />}
        <TouchableOpacity
          className={`w-full flex-row items-center justify-between rounded-[10px] px-3.5 py-3 ${
            selectedCategory === item.name ? 'bg-surface' : ''
          }`}
          onPress={() => handleCategoryPress(item.name)}
          activeOpacity={0.7}
        >
          <Text
            className={`text-[15px] ${
              selectedCategory === item.name
                ? 'font-semibold text-primary'
                : 'font-medium text-text-secondary'
            }`}
          >
            {item.name}
          </Text>
          {selectedCategory === item.name && (
            <MaterialCommunityIcons
              name="check"
              size={18}
              color={COLORS.primary}
            />
          )}
        </TouchableOpacity>
      </View>
    ),
    [selectedCategory, handleCategoryPress]
  )

  return (
    <View className="flex-1 bg-surface">
      <DrawerContentScrollView>
        {/* === 상단 컨트롤 === */}
        <View className="mt-[-10px] w-full flex-row items-center justify-between px-4 py-2 pb-4">
          <Text className="text-[22px] font-bold text-text-primary">
            공지 피드
          </Text>
          <View className="flex-row items-center gap-6">
            <TouchableOpacity onPress={handleManageNoticePress}>
              <AntDesign
                name="plus-circle"
                size={22}
                color={COLORS.textPrimary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleOpenPress}>
              <MaterialCommunityIcons
                name="pencil-outline"
                size={22}
                color={COLORS.textPrimary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* 헤더 구분선 */}
        <View className="h-[1px] w-full bg-stroke" />

        {/* === 추천 섹션 === */}
        <View className="w-full px-3 pt-4">
          <TouchableOpacity
            className={`w-full flex-row items-center justify-between rounded-control px-3.5 py-3.5 ${
              !selectedCategory ? 'bg-primary-soft' : ''
            }`}
            onPress={() => {
              clearCategory()
              navigation.dispatch(DrawerActions.closeDrawer())
            }}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-2.5">
              <MaterialCommunityIcons
                name="star-four-points"
                size={16}
                color={!selectedCategory ? COLORS.primary : COLORS.textTertiary}
              />
              <Text
                className={`text-[15px] ${
                  !selectedCategory
                    ? 'font-semibold text-primary'
                    : 'font-medium text-text-primary'
                }`}
              >
                추천
              </Text>
            </View>
            {!selectedCategory && (
              <MaterialCommunityIcons
                name="check"
                size={18}
                color={COLORS.primary}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* === 구독 섹션 (그룹 카드) === */}
        <View className="w-full px-3 pt-3">
          <View className="w-full rounded-card bg-bg p-1.5">
            {subscribedCategories.length > 0 ? (
              subscribedCategories.map((item, index) =>
                renderSubscriptionItem(item, index)
              )
            ) : (
              <View className="px-3.5 py-3">
                <Text className="text-[13px] text-text-tertiary">
                  오른쪽 위 + 버튼으로 공지를 구독해보세요
                </Text>
              </View>
            )}
          </View>
        </View>
      </DrawerContentScrollView>

      {/* 화면에 보일 BottomSheet */}
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={1}
        enablePanDownToClose={true}
        enableContentPanningGesture={false}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView className="flex-1">
          <EditingNotificationSubscriptions
            handleClosePress={handleClosePress}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  )
}
