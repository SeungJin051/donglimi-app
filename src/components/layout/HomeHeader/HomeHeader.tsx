import { Ionicons } from '@expo/vector-icons'
import { DrawerActions } from '@react-navigation/native'
import { useNavigation, useRouter } from 'expo-router'
import { Platform, TouchableOpacity, View, Image } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function HomeHeader() {
  const router = useRouter()
  const navigation = useNavigation()
  const { top } = useSafeAreaInsets()

  // 사이드바 메뉴 열기
  const openMenu = () => {
    navigation.dispatch(DrawerActions.openDrawer())
  }

  // 검색 페이지로 이동
  const goToSearch = () => {
    router.push('/homepage-search')
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
      <TouchableOpacity
        onPress={() => {
          console.log('게시글 상단으로 이동하기')
        }}
        style={{ padding: 8 }}
      >
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
