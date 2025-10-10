import React from 'react'

import { Platform, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function ScrapHeader() {
  const { top } = useSafeAreaInsets()

  return (
    <View
      className="flex-row items-center bg-white px-4 pb-2"
      style={{
        paddingTop: Platform.OS === 'android' ? top + 10 : top,
      }}
    >
      <Text className="flex-1 text-center text-2xl font-semibold">스크랩</Text>
    </View>
  )
}
