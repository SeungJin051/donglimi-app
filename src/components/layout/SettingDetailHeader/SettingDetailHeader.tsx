import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { TouchableOpacity, Text, View } from 'react-native'

import { COLORS } from '@/constants/colors'

interface SettingDetailHeaderProps {
  title: string
}

export default function SettingDetailHeader({
  title,
}: SettingDetailHeaderProps) {
  const router = useRouter()

  return (
    <View className="flex-row items-center gap-3 bg-surface px-4 pb-3">
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>
      <Text className="text-[22px] font-bold text-text-primary">{title}</Text>
    </View>
  )
}
