import { Feather } from '@expo/vector-icons'
import { View, Text, TouchableOpacity } from 'react-native'

const appInfoMenus = [
  { id: 'notice', title: '공지사항' },
  { id: 'help', title: '도움말 및 문의하기' },
  { id: 'service', title: '서비스 정보' },
] as const

export default function SettingItem() {
  return (
    <View className="gap-6 p-4">
      {/* 앱 정보 및 지원 */}
      <View className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <View className="border-b border-gray-200 px-4 py-3">
          <Text className="text-base font-semibold text-gray-900">
            앱 정보 및 지원
          </Text>
        </View>
        {appInfoMenus.map((menu, index) => (
          <TouchableOpacity
            key={menu.id}
            className={`flex-row items-center justify-between border-b border-gray-200 px-4 py-3.5 ${
              index === appInfoMenus.length - 1 ? 'border-b-0' : ''
            }`}
            onPress={() => console.log(`${menu.title} 클릭`)}
          >
            <Text className="text-base text-gray-800">{menu.title}</Text>
            <Feather name="chevron-right" size={22} color="#A0A0A0" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}
