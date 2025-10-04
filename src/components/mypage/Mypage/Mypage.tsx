import { useCallback, useMemo, useRef, useState } from 'react'

import { Feather } from '@expo/vector-icons'
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { View, Text, TouchableOpacity } from 'react-native'

import AuthBottomSheet from '@/components/ui/AuthBottomSheet/AuthBottomSheet'

// 1. appInfoMenus에서 icon 속성을 제거합니다.
const appInfoMenus = [
  { id: 'notice', title: '공지사항' },
  { id: 'help', title: '도움말 및 문의하기' },
  { id: 'service', title: '서비스 정보' },
]

// myActivityMenus는 그대로 icon 속성을 유지합니다.
const myActivityMenus = [
  { id: 'scrap', title: '내가 스크랩한 공지', icon: 'bookmark' },
  { id: 'comment', title: '내가 작성한 댓글', icon: 'message-square' },
  { id: 'notification', title: '알림 설정', icon: 'bell' },
] as const

// 타입을 명확하게 정의해줍니다.
type Menu = {
  id: string
  title: string
  icon?: React.ComponentProps<typeof Feather>['name'] // icon은 선택적(optional) 속성
}

export default function Mypage() {
  // BottomSheet를 제어하기 위한 ref 생성
  const bottomSheetRef = useRef<BottomSheetModal>(null)

  //  바텀 시트가 펼쳐질 높이(snap points) 설정
  const snapPoints = useMemo(() => ['50%'], [])

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

  // 2. renderMenuList 함수가 icon이 없는 경우도 처리하도록 수정합니다.
  const renderMenuList = (menus: readonly Menu[]) => {
    return menus.map((menu, index) => (
      <TouchableOpacity
        key={menu.id}
        className={`flex-row items-center justify-between border-b border-gray-200 px-4 py-3.5 ${
          index === menus.length - 1 ? 'border-b-0' : ''
        }`}
        onPress={() => console.log(`${menu.title} 클릭`)}
      >
        <View className="flex-row items-center">
          {/* menu 객체에 icon 속성이 있을 때만 아이콘을 렌더링합니다. */}
          {menu.icon && (
            <Feather
              name={menu.icon}
              size={20}
              color="#6B7280"
              style={{ marginRight: 12 }} // 아이콘과 텍스트 사이 간격
            />
          )}
          <Text className="text-base text-gray-800">{menu.title}</Text>
        </View>
        <Feather name="chevron-right" size={22} color="#A0A0A0" />
      </TouchableOpacity>
    ))
  }

  return (
    <>
      <View className="gap-6 p-4">
        {/* 로그인 전 */}
        {/* {!isLogin && ( */}
        <View className="items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <Text className="text-4xl">👤</Text>
          <Text className="text-lg font-bold text-gray-800">
            로그인이 필요합니다.
          </Text>
          <Text className="text-sm text-gray-600">
            더 많은 기능을 이용하려면 로그인해주세요.
          </Text>
          <TouchableOpacity
            className="mt-2 rounded-lg bg-black px-5 py-2.5 active:opacity-80"
            onPress={handleOpenPress}
          >
            <Text className="text-sm font-semibold text-white">로그인하기</Text>
          </TouchableOpacity>
        </View>
        {/* )} */}

        {/* 로그인 후 */}
        {/* {isLogin && (
          <View className="gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <View className="flex-row items-center gap-4">
              <View className="h-20 w-20 items-center justify-center rounded-full bg-gray-100"></View>
              <View className="flex-col gap-1">
                <Text className="text-lg font-semibold text-gray-900">
                  Name
                </Text>
                <Text className="text-sm text-gray-500">Provider 계정</Text>
              </View>
            </View>
            <View className="mt-2 flex-row items-center justify-around rounded-lg p-3">
              <Text className="font-semibold text-blue-700">스크랩 12개</Text>
              <Text className="font-semibold text-blue-700">댓글 5개</Text>
            </View>
          </View>
        )} */}

        {/* 나의 활동 (로그인 시 보임) */}
        {/* {isLogin && (
          <View className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <View className="border-b border-gray-200 px-4 py-3">
              <Text className="text-base font-semibold text-gray-900">
                나의 활동
              </Text>
            </View>
            {renderMenuList(myActivityMenus)}
          </View>
        )} */}

        {/* 앱 정보 및 지원 */}
        <View className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <View className="border-b border-gray-200 px-4 py-3">
            <Text className="text-base font-semibold text-gray-900">
              앱 정보 및 지원
            </Text>
          </View>
          {renderMenuList(appInfoMenus)}
        </View>
      </View>

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
          <AuthBottomSheet />
        </BottomSheetView>
      </BottomSheetModal>
    </>
  )
}
