import { Ionicons } from '@expo/vector-icons'
import { View, Text, Switch, TouchableOpacity } from 'react-native'

import NotificationSettingHeader from '@/components/layout/NotificationSettingHeader/NotificationSettingHeader'

export default function NotificationSetting() {
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
            <View className="flex flex-row items-center justify-center gap-1 rounded-full bg-gray-100 px-4 py-2 text-sm">
              <TouchableOpacity>
                <Text className="text-sm">keyword</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Ionicons name="close-outline" size={16} color="#999999" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 키워드 추가 버튼 */}
          <View>
            <TouchableOpacity className="flex-row items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-2">
              <Ionicons name="add" size={20} color="black" />

              <Text>키워드 추가</Text>
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
            <View className="flex flex-row items-center justify-center gap-1 rounded-full bg-gray-100 px-4 py-2 text-sm">
              <TouchableOpacity>
                <Text className="text-sm">keyword</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Ionicons name="close-outline" size={16} color="#999999" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 학과 추가 버튼 */}
          <View>
            <TouchableOpacity className="flex-row items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-2">
              <Ionicons name="add" size={20} color="black" />

              <Text>학과 추가</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}
