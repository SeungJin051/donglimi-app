import React from 'react'

import Feather from '@expo/vector-icons/Feather'
import { Platform, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function NotiHeader() {
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
        paddingBottom: 4,
      }}
    >
      <View className="flex-1 flex-row items-center justify-between">
        <View>
          <Text className="text-3xl font-semibold">알림</Text>
        </View>
        <View className="flex-row items-center gap-9">
          <Feather name="filter" size={24} color="black" />
          <Feather name="settings" size={24} color="black" />
        </View>
      </View>
    </View>
  )
}
