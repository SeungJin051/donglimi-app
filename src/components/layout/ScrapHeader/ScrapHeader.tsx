import React from 'react'

import { Text } from 'react-native'

import { TabScreenHeader } from '@/components/layout/TabScreenHeader'

export function ScrapHeader() {
  return (
    <TabScreenHeader className="flex-row items-center justify-between px-4 pb-3">
      <Text className="text-2xl font-bold">스크랩</Text>
    </TabScreenHeader>
  )
}
