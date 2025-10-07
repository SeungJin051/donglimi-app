import { View } from 'react-native'

import { ScrapItem } from '@/components/scrap/ScrapItem/ScrapItem'

export default function ScrapScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <ScrapItem />
    </View>
  )
}
