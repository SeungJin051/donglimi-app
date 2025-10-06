import { View } from 'react-native'

import { NotificaitonItem } from '@/components/notification/NotificaitonItem/NotificaitonItem'

export default function NotificationScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <NotificaitonItem />
    </View>
  )
}
