import { Ionicons } from '@expo/vector-icons'
import { DrawerActions } from '@react-navigation/native'
import { useNavigation, useRouter } from 'expo-router'
import { Platform, TouchableOpacity, Image } from 'react-native'

import { TabScreenHeader } from '@/components/layout/TabScreenHeader'
import { COLORS } from '@/constants/colors'
import { scrollToTop } from '@/utils/scrollRefs'

export function HomeHeader() {
  const router = useRouter()
  const navigation = useNavigation()

  const openMenu = () => {
    navigation.dispatch(DrawerActions.openDrawer())
  }

  const goToSearch = () => {
    router.push('/homepage-search')
  }

  return (
    <TabScreenHeader
      className="flex-row items-center justify-between px-2 pb-1"
      style={Platform.OS === 'android' ? { paddingTop: 4 } : undefined}
    >
      <TouchableOpacity onPress={openMenu} style={{ padding: 6 }}>
        <Ionicons name="menu" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>
      <TouchableOpacity onPress={scrollToTop} style={{ padding: 8 }}>
        <Image
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          source={require('@/assets/images/donglimi-logo.png')}
          style={{ width: 40, height: 40, resizeMode: 'contain' }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={goToSearch} style={{ padding: 6 }}>
        <Ionicons name="search" size={22} color={COLORS.textPrimary} />
      </TouchableOpacity>
    </TabScreenHeader>
  )
}
