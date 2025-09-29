import { useState } from 'react'

import { Ionicons } from '@expo/vector-icons'
import { View, Text, TouchableOpacity } from 'react-native'
import DraggableFlatList from 'react-native-draggable-flatlist'

import { useCategoryStore } from '@/store/categoryStore'
import { Subscription } from '@/types/category.type'

interface EditingProps {
  handleClosePress: () => void
}

export default function EditingNotificationSubscriptions({
  handleClosePress,
}: EditingProps) {
  // 스토어에서 전역 상태와 상태 변경 함수를 가져옵니다.
  const { subscribedCategories, setSubscribedCategories } = useCategoryStore()

  // 전역 상태를 기반으로 사용할 임시 상태를 생성합니다.
  const [localCategories, setLocalCategories] = useState(subscribedCategories)

  // 완료 버튼을 눌렀을 때 실행될 함수
  const handleComplete = () => {
    // 임시 상태(localCategories)를 전역 상태에 반영합니다.
    setSubscribedCategories(localCategories)
    // 모달을 닫습니다.
    handleClosePress()
  }

  // renderItem 함수를 DraggableFlatList 외부에 정의합니다.
  const renderItem = ({
    item,
    drag,
    isActive,
    getIndex,
  }: {
    item: Subscription
    drag: () => void
    isActive: boolean
    getIndex: () => number | undefined
  }) => {
    const index = getIndex()
    return (
      <View
        className="flex-row items-center bg-white px-5"
        style={{ backgroundColor: isActive ? '#f7f7f7' : 'white' }}
      >
        {/* 메뉴 아이콘을 길게 눌러서 드래그 앤 드랍 */}
        <TouchableOpacity onLongPress={drag} className="p-2">
          <Ionicons name="menu" size={20} color="#dbdbdb" />
        </TouchableOpacity>

        <View className="ml-4 flex-1 flex-row">
          <Text
            className={`w-full py-5 text-base font-semibold ${
              index !== undefined && index === subscribedCategories.length - 1
                ? 'border-b-0'
                : 'border-b border-[#dbdbdb]'
            }`}
          >
            {item.name}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View className="flex-1">
      {/* 헤더 부분  */}
      <View className="w-100 flex-row justify-between border-b border-gray-100 p-4">
        <TouchableOpacity onPress={handleClosePress}>
          <Text className="text-lg font-normal">취소</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold">공지 피드 수정</Text>
        <TouchableOpacity onPress={handleComplete}>
          <Text className="text-lg font-normal">완료</Text>
        </TouchableOpacity>
      </View>

      {/* 안내 문구 */}
      <View className="px-4 py-6">
        <View className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <View className="flex-row gap-1">
            <Text className="font-semibold text-blue-400">사용</Text>
            <Text className="text-blue-400">·</Text>
            <Text className="text-blue-400">
              메뉴 아이콘을 길게 누르고 끌어서 순서를 변경하세요.
            </Text>
          </View>
        </View>
      </View>

      {/* 구독 항목 리스트 */}
      {localCategories.length > 0 && (
        <View className="flex-1 px-4">
          <DraggableFlatList
            data={subscribedCategories}
            // 드래그가 끝나면 재정렬된 data로 임시 상태를 업데이트합니다.
            onDragEnd={({ data }) => setLocalCategories(data)}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            activationDistance={0.1}
            // 아이템들을 감싸는 컨테이너에 스타일을 적용합니다.
            containerStyle={{
              overflow: 'hidden',
              borderRadius: 16,
              borderWidth: 1,
              borderColor: '#dbdbdb',
            }}
          />
        </View>
      )}
      {localCategories.length === 0 && (
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg font-extralight">구독 항목이 없습니다.</Text>
        </View>
      )}
    </View>
  )
}
