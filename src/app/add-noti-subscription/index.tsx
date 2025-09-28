import { useState } from 'react'

import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { View, Text, TouchableOpacity } from 'react-native'

import { SUBSCRIPTION_LIST } from '@/constants/departments'
import { useCategoryStore } from '@/store/categoryStore'
import {
  SUBSCRIPTION_TAB,
  SUBSCRIPTION_TAB_DEPARTMENT,
} from '@/types/category.type'

export default function CreateNotice() {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState(SUBSCRIPTION_TAB[0])
  const [departmentTab, setDepartmentTab] = useState(
    SUBSCRIPTION_TAB_DEPARTMENT[0]
  )
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const { setSubscribedCategories } = useCategoryStore()

  return (
    <View>
      <View className="flex-row items-center gap-4 px-4 pt-20">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold">공지 구독 추가</Text>
      </View>

      <View className="mt-4 flex-row px-4">
        {SUBSCRIPTION_TAB.map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text
              className={`px-5 py-4 ${
                activeTab === tab
                  ? 'border-b-2 border-blue-700 font-medium text-[#1E3A5F]'
                  : 'font-medium text-gray-700'
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
            <Text className="mb-4 text-lg font-semibold">📢 정보광장</Text>

            <View className="flex-row flex-wrap">
              {SUBSCRIPTION_LIST.map(
                (item) =>
                  item.category === '정보광장' && (
                    <TouchableOpacity
                      key={item.name}
                      className="mb-2 mr-2"
                      onPress={() => {
                        if (selectedItems.includes(item.name)) {
                          setSelectedItems(
                            selectedItems.filter(
                              (selected) => selected !== item.name
                            )
                          )
                        } else {
                          setSelectedItems([...selectedItems, item.name])
                        }
                      }}
                    >
                      <Text
                        className={`rounded-lg px-3 py-3 ${
                          selectedItems.includes(item.name)
                            ? 'bg-[#dbeafe] font-medium text-[#1E3A5F]'
                            : 'bg-gray-100 text-gray-700'
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
          <>
            <View>
              <Text className="mb-4 text-lg font-semibold">
                🏫 단과대학/학과
              </Text>
              <View className="flex-row flex-wrap">
                {SUBSCRIPTION_TAB_DEPARTMENT.map((tab) => (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setDepartmentTab(tab)}
                  >
                    <Text
                      className={`px-3 py-3 ${
                        departmentTab === tab
                          ? 'rounded-lg bg-[#dbeafe] font-medium text-[#1E3A5F]'
                          : 'font-medium text-gray-700'
                      }`}
                    >
                      {tab}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            {departmentTab && (
              <View className="mt-4">
                <Text className="mb-2 text-lg font-semibold">
                  {departmentTab}
                </Text>
                <View className="flex-row flex-wrap">
                  {SUBSCRIPTION_LIST.filter(
                    (item) => item.category === departmentTab
                  ).map((item) => (
                    <TouchableOpacity
                      key={item.name}
                      className="mb-2 mr-2"
                      onPress={() => {
                        if (selectedItems.includes(item.name)) {
                          setSelectedItems(
                            selectedItems.filter(
                              (selected) => selected !== item.name
                            )
                          )
                        } else {
                          setSelectedItems([...selectedItems, item.name])
                        }
                      }}
                    >
                      <Text
                        className={`rounded-lg px-2 py-3 ${
                          selectedItems.includes(item.name)
                            ? 'bg-[#bfdbfe] text-[#1E40AF]'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </>
        )}
      </View>

      <View className="mt-4 px-4">
        <TouchableOpacity
          className="rounded-lg border border-[#60a5fa] py-4"
          onPress={() => {
            setSubscribedCategories(
              selectedItems.map((item) => ({ id: item, name: item }))
            )
          }}
        >
          <Text className="text-center font-semibold text-[#60a5fa]">
            구독 추가 ({selectedItems.length})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
