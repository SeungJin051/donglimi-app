import { SafeAreaView } from 'react-native-safe-area-context'

import SettingContent from '@/components/setting/SettingContent/SettingContent'

export default function ProfileScreen() {
  return (
    <SafeAreaView className="mt-[-50px] flex-1 bg-gray-50">
      <SettingContent />
    </SafeAreaView>
  )
}
