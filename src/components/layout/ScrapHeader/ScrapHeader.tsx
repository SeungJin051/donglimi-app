import React from 'react'

import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Platform, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function ScrapHeader() {
  const { top } = useSafeAreaInsets()

  return (
    <View
      className="flex-row items-center justify-between bg-white px-4 pb-2"
      style={{
        paddingTop: Platform.OS === 'android' ? top + 10 : top,
      }}
    >
      <View style={{ width: 24 }} />
      <Text className="flex-1 text-center text-2xl font-semibold">스크랩</Text>
      <MaterialIcons name="edit-note" size={24} color="black" />
    </View>
  )
}
