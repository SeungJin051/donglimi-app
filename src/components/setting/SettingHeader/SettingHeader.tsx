import { Feather } from '@expo/vector-icons'
import { DrawerActions } from '@react-navigation/native'
import { useNavigation, useRouter } from 'expo-router'
import { Text } from 'react-native'
import { Platform, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function SettingHeader() {
  const router = useRouter()
  const navigation = useNavigation()
  const { top } = useSafeAreaInsets()

  // 사이드바 메뉴 열기
  const openMenu = () => {
    navigation.dispatch(DrawerActions.openDrawer())
  }

  // 마이페이지 설정 페이지로 이동
  const goToSearch = () => {
    // router.push('/mypage-settings')
  }

  return (
    <View
      className="mt-[-10px] flex-row items-center justify-between bg-white px-2"
      style={{
        paddingTop: (Platform.OS === 'android' ? top + 10 : top) || top,
      }}
    >
      <TouchableOpacity onPress={openMenu} style={{ padding: 8 }}>
        <Text className="text-2xl font-semibold">마이페이지</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToSearch} style={{ padding: 8 }}>
        <Feather name="settings" size={24} color="#999999" />
      </TouchableOpacity>
    </View>
  )
}
