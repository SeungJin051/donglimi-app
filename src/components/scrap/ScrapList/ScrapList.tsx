import React from 'react'

import { View, Text, FlatList } from 'react-native'

import { ScrapListProps } from '@/types/scrapList.types'

import { ScrapItem } from '../ScrapItem/ScrapItem'

// 스크랩 리스트 컴포넌트
export const ScrapList: React.FC<ScrapListProps> = ({ scraps }) => {
  if (scraps.length === 0) {
    return (
      <View className="mx-4 mt-4 items-center justify-center rounded-lg border border-gray-100 bg-white p-6">
        <Text className="text-base font-semibold text-gray-800">
          아직 저장된 스크랩이 없어요
        </Text>
        <Text className="mt-1 text-sm text-gray-500">
          공지사항을 스크랩하면 여기에서 확인할 수 있어요.
        </Text>
      </View>
    )
  }

  return (
    <FlatList
      data={scraps}
      keyExtractor={(item) => item.notice.content_hash}
      renderItem={({ item }) => <ScrapItem scrap={item} />}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20 }}
      showsVerticalScrollIndicator={true}
      style={{ flex: 1 }}
    />
  )
}
