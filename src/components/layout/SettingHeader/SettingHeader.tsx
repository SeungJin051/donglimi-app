import { Text } from 'react-native'

import { TabScreenHeader } from '@/components/layout/TabScreenHeader'

export function SettingHeader() {
  return (
    <TabScreenHeader className="flex-row items-center justify-between px-4 pb-3">
      <Text className="text-2xl font-bold">설정</Text>
    </TabScreenHeader>
  )
}
