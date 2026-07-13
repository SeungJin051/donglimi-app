import { Platform } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { OfflineToastBridge } from '@/components/network/OfflineToastBridge'
import { TabLayoutAndroid } from '@/components/tabs/TabLayoutAndroid'
import { TabLayoutIos } from '@/components/tabs/TabLayoutIos'
import { isIos26OrLater } from '@/utils/iosVersion'

function TabNavigator() {
  if (Platform.OS === 'ios' && isIos26OrLater()) {
    return <TabLayoutIos />
  }
  return <TabLayoutAndroid />
}

export default function TabLayout() {
  return (
    <SafeAreaProvider>
      <OfflineToastBridge />
      <TabNavigator />
    </SafeAreaProvider>
  )
}
