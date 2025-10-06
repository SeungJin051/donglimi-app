import { View, Text, TouchableOpacity } from 'react-native'

import { AppleLogoWhite } from '@/components/icon/AppleLogoWhite'
import GoogleLogo from '@/components/icon/GoogleLogo'

export default function AuthBottomSheet() {
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="font-pretendard text-left text-xl font-normal text-gray-900">
        쉽게 가입하고 간편하게 로그인하세요.
      </Text>
      <Text className="text-sm text-gray-500">동의대학교 모든 알림 솔루션</Text>
      <TouchableOpacity className="mt-4 flex-row items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-black px-5 py-3">
        <View>
          <AppleLogoWhite width="24" height="24" />
        </View>
        <Text className="text-sm font-medium text-white">
          애플 계정으로 계속하기
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="mt-4 flex-row items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3">
        <View>
          <GoogleLogo width="20" height="20" />
        </View>
        <Text className="text-sm font-medium text-gray-700">
          구글 계정으로 계속하기
        </Text>
      </TouchableOpacity>
    </View>
  )
}
