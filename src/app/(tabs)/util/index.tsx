import { View } from 'react-native'

import { UtilContent } from '@/components/util/UtilContent/UtilContent'

export default function UtilScreen() {
  return (
    <View className="flex-1 bg-bg" collapsable={false}>
      <UtilContent />
    </View>
  )
}
