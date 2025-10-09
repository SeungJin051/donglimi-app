import React from 'react'

import { View } from 'react-native'

import { useScrapStore } from '@/store/scrapStore'

import { ScrapItem } from '../ScrapItem/ScrapItem'

// 스크랩 리스트 컴포넌트
export const ScrapList = () => {
  const { scraps } = useScrapStore()

  return (
    <View className="px-4">
      {scraps.map((scrap) => (
        <ScrapItem key={scrap.notice.content_hash} scrap={scrap} />
      ))}
    </View>
  )
}
