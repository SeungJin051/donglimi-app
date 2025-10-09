import React from 'react'

import { Platform, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function UtilHeader() {
  const { top } = useSafeAreaInsets()

  return (
    <View
      className="flex-row items-center justify-between bg-white px-4 pb-2"
      style={{
        paddingTop: Platform.OS === 'android' ? top + 10 : top,
      }}
    >
      <View className="flex-1 flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-semibold">편의 기능</Text>
        </View>
      </View>
    </View>
  )
}
