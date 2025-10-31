import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { TouchableOpacity, Text, View } from 'react-native'

interface SettingDetailHeaderProps {
  title: string
}

export default function SettingDetailHeader({
  title,
}: SettingDetailHeaderProps) {
  const router = useRouter()

  return (
    <View className="flex-row items-center gap-4 bg-white px-4 pb-2">
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text className="text-2xl font-bold">{title}</Text>
    </View>
  )
}
