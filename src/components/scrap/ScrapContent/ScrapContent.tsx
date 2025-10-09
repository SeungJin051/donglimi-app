import { Ionicons } from '@expo/vector-icons'
import Feather from '@expo/vector-icons/Feather'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'

import { useScrapStore } from '@/store/scrapStore'

import { ScrapList } from '../ScrapList/ScrapList'

export const ScrapContent = () => {
  const { scraps } = useScrapStore()

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="gap-5">
        <View>
          {/* 검색 */}
          <View className="border-b border-t border-gray-200 bg-white px-4 py-3">
            <View className="relative">
              <TextInput
                className="h-11 rounded-2xl bg-gray-100 pl-11 pr-4 text-base"
                placeholderTextColor="#9CA3AF"
                placeholder="스크랩한 공지 검색"
              />
              <View className="absolute left-4 top-0 h-full justify-center">
                <Ionicons name="search" size={20} color="#6B7280" />
              </View>
            </View>
          </View>

          {/* 정렬/필터 */}
          <View className="flex-row items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
            <TouchableOpacity className="flex-row items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2">
              <Feather name="filter" size={14} color="black" />
              <Text className="text-sm font-medium">정렬/필터</Text>
            </TouchableOpacity>
            <Text className="text-sm text-gray-500">{scraps.length}개</Text>
          </View>
        </View>

        {/* 스크랩 목록 */}
        <ScrapList />
      </View>
    </TouchableWithoutFeedback>
  )
}
