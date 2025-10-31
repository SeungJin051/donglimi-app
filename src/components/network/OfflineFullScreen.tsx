import { ReactNode } from 'react'

import { Ionicons } from '@expo/vector-icons'
import { Linking, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = {
  onRetry: () => void
  title?: string
  description?: string
  footer?: ReactNode
}

export function OfflineFullScreen({
  onRetry,
  title = '인터넷 연결이 필요해요',
  description = '연결 확인 후 다시 시도해 주세요.',
  footer,
}: Props) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-8">
        <Ionicons name="cloud-offline" size={64} color="#9CA3AF" />
        <Text className="mt-6 text-2xl font-bold text-gray-900">{title}</Text>
        <Text className="mt-2 text-center text-base text-gray-600">
          {description}
        </Text>

        <TouchableOpacity
          className="mt-8 rounded-lg bg-blue-600 px-6 py-3"
          onPress={onRetry}
          activeOpacity={0.8}
        >
          <Text className="text-base font-semibold text-white">재시도</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-3"
          onPress={() => Linking.openSettings()}
          activeOpacity={0.7}
        >
          <Text className="text-sm text-blue-600">설정 열기</Text>
        </TouchableOpacity>

        {footer ? <View className="mt-6">{footer}</View> : null}
      </View>
    </SafeAreaView>
  )
}
