import { View } from 'react-native'

import { NotificationContent } from '@/components/notification/NotificationContent/NotificationContent'

export default function NotificationScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <NotificationContent />
    </View>
  )
}
