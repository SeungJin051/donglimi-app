import { View } from 'react-native'

import SettingContent from '@/components/setting/SettingContent/SettingContent'

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-surface" collapsable={false}>
      <SettingContent />
    </View>
  )
}
