import React from 'react'

import { Text, View } from 'react-native'

import { TabScreenHeader } from '@/components/layout/TabScreenHeader'

export function UtilHeader() {
  return (
    <TabScreenHeader className="flex-row items-center justify-between px-4 pb-3">
      <Text className="text-2xl font-bold">편의 기능</Text>
    </TabScreenHeader>
  )
}
