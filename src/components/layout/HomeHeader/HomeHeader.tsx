import { Ionicons } from '@expo/vector-icons'
import { DrawerActions } from '@react-navigation/native'
import { useNavigation, useRouter } from 'expo-router'
import { TouchableOpacity, View, Image } from 'react-native'

import { TabScreenHeader } from '@/components/layout/TabScreenHeader'
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
    <TabScreenHeader className="flex-row items-center justify-between px-2 pb-2">
      <TouchableOpacity onPress={openMenu} style={{ padding: 8 }}>
        <Ionicons name="menu" size={28} color="#999999" />
      </TouchableOpacity>
      <TouchableOpacity onPress={scrollToTop} style={{ padding: 8 }}>
        <Image
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          source={require('@/assets/images/donglimi-logo.png')}
          style={{ width: 45, height: 45, resizeMode: 'contain' }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={goToSearch} style={{ padding: 8 }}>
        <Ionicons name="search" size={24} color="#999999" />
      </TouchableOpacity>
    </TabScreenHeader>
  )
}
