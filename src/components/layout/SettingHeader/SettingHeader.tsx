import { Text } from 'react-native'
import { Platform, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function SettingHeader() {
  const { top } = useSafeAreaInsets()

  return (
    <View
      className="flex-row items-center justify-between bg-white px-4 pb-2"
      style={{
        paddingTop: Platform.OS === 'android' ? top + 10 : top,
      }}
    >
      <Text className="text-2xl font-semibold">설정</Text>
    </View>
  )
}
