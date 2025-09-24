import { DrawerContentScrollView } from '@react-navigation/drawer';
import { View } from 'react-native';

export default function HomeDrawer() {
  return (
    <View className='flex-1'>
      <DrawerContentScrollView>
        {/* === 상단 컨트롤 === */}
        <View className='flex-row items-center justify-between border-b border-gray-200 px-5 py-4'>
          Hello World
        </View>
      </DrawerContentScrollView>
    </View>
  );
}
