import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function NotificationScreen() {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <Text className="text-red-500">NotificationScreen</Text>
    </SafeAreaView>
  )
}
