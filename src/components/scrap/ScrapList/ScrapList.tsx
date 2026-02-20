import React from 'react'

import { View, Text, FlatList } from 'react-native'

import { ScrapListProps } from '@/types/scrapList.types'

import { ScrapItem } from '../ScrapItem/ScrapItem'

// 스크랩 리스트 컴포넌트
export const ScrapList: React.FC<ScrapListProps> = ({ scraps }) => {
  if (scraps.length === 0) {
    return (
      <View className="mx-4 mt-4 items-center justify-center rounded-lg border border-gray-100 bg-white p-6">
        <Text className="text-xl font-semibold text-gray-900">
          다시 볼 공지, 여기에 모아두세요
        </Text>
        <Text className="mt-2 text-center text-base text-gray-500">
          중요한 공지를 스크랩하면, {'\n'} 필요할 때마다 이곳에서 바로 찾아볼 수
          있어요.
        </Text>
      </View>
    )
  }

  return (
    <FlatList
      data={scraps}
      keyExtractor={(item) => item.notice.content_hash}
      renderItem={({ item }) => <ScrapItem scrap={item} />}
      showsVerticalScrollIndicator={true}
      style={{ flex: 1 }}
    />
  )
}
