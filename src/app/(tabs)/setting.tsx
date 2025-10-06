import { SafeAreaView } from 'react-native-safe-area-context'

import SettingItem from '@/components/setting/SettingItem/SettingItem'

export default function ProfileScreen() {
  return (
    <SafeAreaView className="mt-[-50px] flex-1 bg-gray-50">
      <SettingItem />
    </SafeAreaView>
  )
}
