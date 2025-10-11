import React from 'react'

import { View, Text, FlatList } from 'react-native'

import { ScrapListProps } from '@/types/scrapList.types'

import { ScrapItem } from '../ScrapItem/ScrapItem'

// 스크랩 리스트 컴포넌트
export const ScrapList: React.FC<ScrapListProps> = ({ scraps }) => {
  if (scraps.length === 0) {
    return (
      <View className="items-center justify-center py-20">
        <Text className="text-base text-gray-500">
          스크랩한 공지가 없습니다
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
