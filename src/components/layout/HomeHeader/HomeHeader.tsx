import { Ionicons } from '@expo/vector-icons'
import { DrawerActions } from '@react-navigation/native'
import { useNavigation } from 'expo-router'
import { Platform, TouchableOpacity, View, Image } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function HomeHeader() {
  const navigation = useNavigation()
  const { top } = useSafeAreaInsets()

  const openMenu = () => {
    navigation.dispatch(DrawerActions.openDrawer())
  }

  const goToSearch = () => {
    console.log('검색 버튼 클릭')
  }

  return (
    <View
      className="mt-[-10px] flex-row items-center justify-between bg-white px-2"
      style={{
        paddingTop: (Platform.OS === 'android' ? top + 10 : top) || top,
      }}
    >
      <TouchableOpacity onPress={openMenu} style={{ padding: 8 }}>
        <Ionicons name="menu" size={28} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={goToSearch} style={{ padding: 8 }}>
        <Image
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          source={require('@/assets/images/donglimi-logo.png')}
          style={{ width: 45, height: 45, resizeMode: 'contain' }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={goToSearch} style={{ padding: 8 }}>
        <Ionicons name="search" size={24} color="black" />
      </TouchableOpacity>
    </View>
  )
}
