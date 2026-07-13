import { useEffect, useState, useMemo, useCallback } from 'react'

import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { View, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { COLORS } from '@/constants/colors'
import { DEPARTMENT_LIST } from '@/constants/departments'
import { useCategoryStore } from '@/store/categoryStore'
import {
  SUBSCRIPTION_TAB,
  SUBSCRIPTION_TAB_DEPARTMENT,
} from '@/types/category.type'
import { showSuccessToast } from '@/utils/toastUtils'

export default function ManagingNotificationSubscriptions() {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState(SUBSCRIPTION_TAB[0])
  const [departmentTab, setDepartmentTab] = useState(
    SUBSCRIPTION_TAB_DEPARTMENT[0]
  )
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const { subscribedCategories, setSubscribedCategories } = useCategoryStore()

  // 초기 구독 목록을 문자열 배열로 변환
  const initialSubscribedItems = useMemo(
    () => subscribedCategories.map((category) => category.name),
    [subscribedCategories]
  )

  // 변경사항이 있는지 확인
  const hasChanges = useMemo(() => {
    if (selectedItems.length !== initialSubscribedItems.length) {
      return true
    }
    return !selectedItems.every((item) => initialSubscribedItems.includes(item))
  }, [selectedItems, initialSubscribedItems])

  // selectedItems 초기화 (컴포넌트 마운트 시 초기 구독 목록으로 설정)
  useEffect(() => {
    setSelectedItems(initialSubscribedItems)
  }, [initialSubscribedItems])

  // 아이템 선택 토글 핸들러
  const handleItemToggle = useCallback((itemName: string) => {
    setSelectedItems((prevItems) => {
      if (prevItems.includes(itemName)) {
        return prevItems.filter((selected) => selected !== itemName)
      } else {
        return [...prevItems, itemName]
      }
    })
  }, [])

  // 변경사항 저장 핸들러
  const handleSaveChanges = useCallback(() => {
    if (hasChanges) {
      setSubscribedCategories(
        selectedItems.map((item) => ({ id: item, name: item }))
      )
      showSuccessToast('공지 피드 설정을 저장했어요')
      router.back()
    }
  }, [hasChanges, selectedItems, setSubscribedCategories, router])

  return (
    <SafeAreaView className="bg-surface">
      <View className="flex-row items-center gap-3 px-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text className="text-[22px] font-bold text-text-primary">
          공지 피드 관리
        </Text>
      </View>

      <View className="mt-4 flex-row px-4">
        {SUBSCRIPTION_TAB.map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text
              className={`px-5 py-4 text-[15px] ${
                activeTab === tab
                  ? 'border-b-2 border-text-primary font-semibold text-text-primary'
                  : 'font-medium text-text-tertiary'
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="mt-4 px-4">
        {activeTab === '정보광장' && (
          <View>
            <View className="mb-4 flex-row items-center gap-2">
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={COLORS.textPrimary}
              />
              <Text className="text-[17px] font-bold text-text-primary">
                정보광장
              </Text>
            </View>

            <View className="flex-row flex-wrap">
              {DEPARTMENT_LIST.map(
                (item) =>
                  item.category === '정보광장' && (
                    <TouchableOpacity
                      key={item.name}
                      className="mb-2 mr-2"
                      onPress={() => handleItemToggle(item.name)}
                    >
                      <Text
                        className={`rounded-full px-4 py-2.5 text-[14px] ${
                          selectedItems.includes(item.name)
                            ? 'bg-primary-soft font-semibold text-primary'
                            : 'bg-bg text-text-secondary'
                        }`}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  )
              )}
            </View>
          </View>
        )}
        {activeTab === '단과대학/학과' && (
          <View>
            <View>
              <View className="mb-4 flex-row items-center gap-2">
                <Ionicons
                  name="school-outline"
                  size={22}
                  color={COLORS.textPrimary}
                />
                <Text className="text-[17px] font-bold text-text-primary">
                  단과대학/학과
                </Text>
              </View>
              <View className="flex-row flex-wrap gap-y-2">
                {SUBSCRIPTION_TAB_DEPARTMENT.map((tab) => (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setDepartmentTab(tab)}
                  >
                    <Text
                      className={`rounded-full px-3 py-2.5 text-[14px] ${
                        departmentTab === tab
                          ? 'bg-primary-soft font-semibold text-primary'
                          : 'font-medium text-text-tertiary'
                      }`}
                    >
                      {tab}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <Text className="mb-1 border-b border-divider" />
            {departmentTab && (
              <View className="mt-4">
                <Text className="mb-2 text-[15px] font-semibold text-text-primary">
                  {departmentTab}
                </Text>
                <View className="flex-row flex-wrap">
                  {DEPARTMENT_LIST.filter(
                    (item) => item.category === departmentTab
                  ).map((item) => (
                    <TouchableOpacity
                      key={item.name}
                      className="mb-2 mr-2"
                      onPress={() => handleItemToggle(item.name)}
                    >
                      <Text
                        className={`rounded-full px-4 py-2.5 text-[14px] ${
                          selectedItems.includes(item.name)
                            ? 'bg-primary-soft font-semibold text-primary'
                            : 'bg-bg text-text-secondary'
                        }`}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </View>

      <View className="mt-4 px-4">
        <TouchableOpacity
          className={`rounded-control py-4 ${
            hasChanges ? 'bg-primary' : 'bg-bg'
          }`}
          onPress={handleSaveChanges}
          disabled={!hasChanges}
          activeOpacity={0.8}
        >
          <Text
            className={`text-center text-[16px] font-semibold ${
              hasChanges ? 'text-white' : 'text-text-tertiary'
            }`}
          >
            {hasChanges
              ? `공지 피드 설정 저장하기 (${selectedItems.length})`
              : '변경사항이 없어요'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
