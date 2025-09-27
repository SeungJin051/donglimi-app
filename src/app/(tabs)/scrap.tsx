import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ScrapScreen() {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <Text className="text-red-500">ScrapScreen</Text>
    </SafeAreaView>
  )
}
