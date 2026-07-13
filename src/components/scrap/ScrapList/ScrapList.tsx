import React from 'react'

import { Ionicons } from '@expo/vector-icons'
import { View, Text, FlatList } from 'react-native'

import { COLORS } from '@/constants/colors'
import { ScrapListProps } from '@/types/scrapList.types'

import { ScrapItem } from '../ScrapItem/ScrapItem'

// 스크랩 리스트 컴포넌트
export const ScrapList: React.FC<ScrapListProps> = ({ scraps }) => {
  if (scraps.length === 0) {
    return (
      <View className="mx-4 mt-2 items-center justify-center rounded-card bg-surface px-6 py-12">
        <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-bg">
          <Ionicons
            name="bookmark-outline"
            size={26}
            color={COLORS.textTertiary}
          />
        </View>
        <Text className="text-[17px] font-bold text-text-primary">
          다시 볼 공지, 여기에 모아두세요
        </Text>
        <Text className="mt-2 text-center text-[14px] leading-5 text-text-tertiary">
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
      contentContainerStyle={{ paddingTop: 12 }}
      style={{ flex: 1 }}
    />
  )
}
