import 'react-native-gesture-handler'

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { Drawer } from 'expo-router/drawer'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import '../../global.css'
import HomeDrawer from '@/components/layout/HomeDrawer/HomeDrawer'

// _를 붙이면 일반 페이지가 아니라 레이아웃(layout), 슬롯(slot), API 라우트 등 특별한 기능을 하는 파일로 취급됩니다.
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Drawer drawerContent={() => <HomeDrawer />}>
          <Drawer.Screen
            name="(tabs)"
            options={{ drawerLabel: '홈', title: '홈', headerShown: false }}
          />
        </Drawer>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}
