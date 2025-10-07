import React from 'react'

import { Platform, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function UtilHeader() {
  const { top } = useSafeAreaInsets()

  return (
    <View
      style={{
        paddingTop: (Platform.OS === 'android' ? top + 10 : top) || top,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingBottom: 5,
      }}
    >
      <View className="flex-1 flex-row items-center justify-between">
        <View>
          <Text className="text-3xl font-semibold">편의 기능</Text>
        </View>
      </View>
    </View>
  )
}
