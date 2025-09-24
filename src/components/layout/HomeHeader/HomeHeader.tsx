import React from 'react';

import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation, useRouter } from 'expo-router';
import { Platform, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function HomeHeader() {
  const router = useRouter();
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();

  const openMenu = () => {
    // TODO: 모달이나 다른 UI로 메뉴 구현 예정
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const goToSearch = () => {
    // router.push('/search');
    console.log('검색 버튼 클릭');
  };

  return (
    <View
      style={{
        paddingTop: (Platform.OS === 'android' ? top + 10 : top) || top,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingBottom: 12,
      }}
    >
      <TouchableOpacity onPress={openMenu} style={{ padding: 8 }}>
        <Ionicons name='menu' size={28} color='black' />
      </TouchableOpacity>
      <TouchableOpacity onPress={goToSearch} style={{ padding: 8 }}>
        <AntDesign name='ant-design' size={24} color='black' />
      </TouchableOpacity>
      <TouchableOpacity onPress={goToSearch} style={{ padding: 8 }}>
        <Ionicons name='search' size={24} color='black' />
      </TouchableOpacity>
    </View>
  );
}
