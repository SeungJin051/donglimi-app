import { SafeAreaView } from 'react-native-safe-area-context'

import Mypage from '@/components/mypage/Mypage/Mypage'

export default function ProfileScreen() {
  return (
    <SafeAreaView className="mt-[-50px] flex-1 bg-gray-50">
      <Mypage />
    </SafeAreaView>
  )
}
