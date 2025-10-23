import { useRouter } from 'expo-router'
import { ScrollView, View, Text, TouchableOpacity } from 'react-native'

import SettingDetailHeader from '@/components/layout/SettingDetailHeader/SettingDetailHeader'

export default function TermsOfServiceScreen() {
  const router = useRouter()

  const handlePrivacyPolicyPress = () => {
    router.push('/privacy-policy')
  }

  return (
    <View className="flex-1 bg-gray-50">
      <SettingDetailHeader title="이용 약관" />

      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-xl border border-gray-200 bg-white p-6">
          <Text className="mb-6 text-center text-lg font-semibold text-gray-900">
            동림이 서비스 이용 약관
          </Text>

          <View className="mb-6">
            <Text className="mb-2 text-base font-semibold text-gray-900">
              제1조 (목적)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              이 약관은 동림이(이하 "개발자")가 제공하는 서비스의 이용 조건과
              절차, 개발자와 이용자의 권리·의무를 규정하는 것을 목적으로 합니다.
            </Text>
          </View>

          <View className="mb-6">
            <Text className="mb-2 text-base font-semibold text-gray-900">
              제2조 (용어의 정의)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • "서비스"란 개발자가 제공하는 모든 기능과 콘텐츠를 의미합니다.
              {'\n'}• "이용자"란 서비스 이용을 위해 동림이에 접속하거나 사용하는
              사람을 의미합니다.{'\n'}• "콘텐츠"란 서비스에서 제공되는 텍스트,
              이미지, 영상, 기타 자료를 의미합니다.
            </Text>
          </View>

          <View className="mb-6">
            <Text className="mb-2 text-base font-semibold text-gray-900">
              제3조 (약관의 게시 및 개정)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              1. 개발자는 약관을 앱 내에 게시하거나 공지합니다.{'\n'}
              2. 개발자는 필요 시 약관을 변경할 수 있으며, 변경 사항은 공지한
              날로부터 7일 후 효력을 가집니다.
            </Text>
          </View>

          <View className="mb-6">
            <Text className="mb-2 text-base font-semibold text-gray-900">
              제4조 (서비스 제공 및 변경)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              1. 개발자는 다음과 같은 서비스를 제공합니다:{'\n'}
              {'  '}• 학사 공지사항 확인{'\n'}
              {'  '}• 알림 서비스{'\n'}
              {'  '}• 기타 부가 기능{'\n'}
              2. 개발자는 서비스 내용, 이용 방법, 이용 시간을 변경할 수 있으며,
              변경 시 사전에 공지합니다.
            </Text>
          </View>

          <View className="mb-6">
            <Text className="mb-2 text-base font-semibold text-gray-900">
              제5조 (이용자의 의무)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              1. 이용자는 약관과 서비스 이용 안내를 준수해야 합니다.{'\n'}
              2. 이용자는 다음 행위를 해서는 안 됩니다:{'\n'}
              {'  '}• 타인의 정보 도용{'\n'}
              {'  '}• 서비스 안정성을 방해하는 행위{'\n'}
              {'  '}• 허위 정보 등록{'\n'}
              {'  '}• 법령 또는 공서양속에 위반되는 행위
            </Text>
          </View>

          <View className="mb-6">
            <Text className="mb-2 text-base font-semibold text-gray-900">
              제6조 (개인정보 보호)
            </Text>
            <Text className="mb-3 text-base leading-6 text-gray-700">
              개발자는 이용자의 개인정보를 보호하며, 개인정보 처리방침에 따라
              관리합니다.{' '}
            </Text>
            <TouchableOpacity onPress={handlePrivacyPolicyPress}>
              <Text className="text-base font-medium text-blue-600 underline">
                개인정보 처리방침은 앱 내에서 확인하실 수 있습니다.
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mb-6">
            <Text className="mb-2 text-base font-semibold text-gray-900">
              제7조 (서비스 중단)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              1. 개발자는 시스템 점검, 서비스 장애, 외부 요인 등으로 서비스를
              일시 중단할 수 있습니다.{'\n'}
              2. 서비스 중단으로 발생하는 이용자 피해에 대해서는 책임을 지지
              않습니다.
            </Text>
          </View>

          <View className="mb-6">
            <Text className="mb-2 text-base font-semibold text-gray-900">
              제8조 (면책 사항)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              1. 개발자는 천재지변 등 불가항력적 상황으로 인한 서비스 중단에
              대해 책임을 지지 않습니다.{'\n'}
              2. 개발자는 이용자가 서비스를 사용하여 얻는 결과나 이익에 대해
              보장하지 않습니다.
            </Text>
          </View>

          <View className="border-t border-gray-200 pt-4">
            <Text className="text-center text-sm text-gray-500">
              본 약관은 2025년 10월 23일부터 시행됩니다.{'\n'}
              최종 수정일: 2025년 10월 23일
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
