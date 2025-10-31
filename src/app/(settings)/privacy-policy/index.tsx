import { useRouter } from 'expo-router'
import { ScrollView, View, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import SettingDetailHeader from '@/components/layout/SettingDetailHeader/SettingDetailHeader'

export default function PrivacyPolicyScreen() {
  const router = useRouter()

  const handleTermsPress = () => {
    router.push('/terms-of-service')
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <SettingDetailHeader title="개인정보 처리방침" />

      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-xl border border-gray-200 bg-white p-6">
          <Text className="mb-6 text-center text-lg font-semibold text-gray-900">
            동리미 개인정보 처리방침
          </Text>

          <View className="mb-6">
            <Text className="text-base leading-6 text-gray-700">
              동리미(이하 "개발자")는 이용자의 개인정보 보호를 중요하게
              생각하며, 관련 법령을 준수합니다. 이 방침은 앱 사용 시 수집되는
              개인정보의 종류와 이용 목적, 보관 방법 및 이용자의 권리를
              안내합니다.
            </Text>
          </View>

          <View className="mb-6">
            <Text className="mb-2 text-base font-semibold text-gray-900">
              1. 수집하는 개인정보
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • 디바이스 토큰: 푸시 알림 발송을 위해 수집됩니다.
            </Text>
          </View>

          <View className="mb-6">
            <Text className="mb-2 text-base font-semibold text-gray-900">
              2. 개인정보 수집 및 이용 목적
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • 푸시 알림 제공 및 서비스 개선
            </Text>
          </View>

          <View className="mb-6">
            <Text className="mb-2 text-base font-semibold text-gray-900">
              3. 개인정보 보관 기간
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • 디바이스 토큰은 푸시 알림 사용 목적 달성 후 또는 이용자가 앱을
              삭제하면 자동으로 파기됩니다.
            </Text>
          </View>

          <View className="mb-6">
            <Text className="mb-2 text-base font-semibold text-gray-900">
              4. 이용자의 권리
            </Text>
            <Text className="mb-3 text-base leading-6 text-gray-700">
              • 이용자는 언제든지 알림 수신 동의를 철회할 수 있습니다.
            </Text>
            <TouchableOpacity onPress={handleTermsPress}>
              <Text className="text-base font-medium text-blue-600 underline">
                서비스 이용약관 자세히 보기
              </Text>
            </TouchableOpacity>
          </View>

          <View className="border-t border-gray-200 pt-4">
            <Text className="text-center text-sm text-gray-500">
              본 방침은 2025년 11월 1일부터 시행됩니다.{'\n'}
              최종 수정일: 2025년 11월 1일
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
