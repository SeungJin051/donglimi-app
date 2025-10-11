import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { View, Platform, TouchableOpacity, Text } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function NotificationSettingHeader() {
  const { top } = useSafeAreaInsets()

  return (
    <View
      style={{
        paddingTop: (Platform.OS === 'android' ? top + 10 : top) || top,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingBottom: 5,
      }}
    >
      <View className="flex-1">
        <View className="flex-row items-center gap-4 bg-white">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-2xl font-semibold">알림 설정</Text>
        </View>
      </View>
    </View>
  )
}
