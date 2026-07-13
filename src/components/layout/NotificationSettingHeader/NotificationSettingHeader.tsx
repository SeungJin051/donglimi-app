import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { View, Platform, TouchableOpacity, Text } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { COLORS } from '@/constants/colors'

export default function NotificationSettingHeader() {
  const { top } = useSafeAreaInsets()

  return (
    <View
      style={{
        paddingTop: (Platform.OS === 'android' ? top + 10 : top) || top,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.surface,
        paddingHorizontal: 16,
        paddingBottom: 8,
      }}
    >
      <View className="flex-1">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text className="text-[22px] font-bold text-text-primary">
            알림 설정
          </Text>
        </View>
      </View>
    </View>
  )
}
