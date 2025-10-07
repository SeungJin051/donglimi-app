import React from 'react'

import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Platform, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function ScrapHeader() {
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
          <Text className="text-3xl font-semibold">스크랩</Text>
        </View>
        <MaterialIcons name="edit-note" size={24} color="black" />
      </View>
    </View>
  )
}
