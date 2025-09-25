import React from 'react';

import { AntDesign } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity } from 'react-native';

// 구독 아이템 타입 정의
interface Subscription {
  id: string;
  name: string;
}

// 초기 구독 목록 데이터
const MOCK_DATA: Subscription[] = [
  { id: '1', name: '컴퓨터공학과' },
  { id: '2', name: '경영정보학과' },
  { id: '3', name: '건축학과' },
];

export default function HomeDrawer() {
  // 구독 아이템 렌더링 함수
  const renderSubscriptionItem = (item: Subscription, index: number) => (
    <TouchableOpacity
      key={item.id}
      className={`ml-5 w-full flex-row border-b border-gray-300 py-6 ${
        index === MOCK_DATA.length - 1 ? 'border-b-0' : ''
      }`}
    >
      <Text className='text-base font-semibold'>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View className='flex-1 bg-gray-200'>
      <DrawerContentScrollView>
        {/* === 상단 컨트롤 === */}
        <View className='mb-3 w-full flex-row items-center justify-between px-4 py-4'>
          <Text className='text-2xl font-bold'>공지</Text>
          <View className='flex-row items-center gap-7'>
            <TouchableOpacity onPress={() => {}}>
              <AntDesign name='plus-circle' size={24} color='black' />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <MaterialCommunityIcons
                name='pencil-outline'
                size={24}
                color='black'
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* === 추천 섹션 === */}
        <View className='w-full'>
          <View className='flex-col items-center overflow-hidden rounded-3xl border border-gray-300 bg-white'>
            <View className='w-full'>
              <TouchableOpacity onPress={() => {}}>
                <Text className='ml-5 w-full border-b border-gray-300 py-6 text-base font-semibold'>
                  추천
                </Text>
              </TouchableOpacity>
            </View>

            {/* === 구독 목록 (하단에 쌓이는 구조) === */}
            <View className='w-full flex-col'>
              {MOCK_DATA.map((item, index) =>
                renderSubscriptionItem(item, index)
              )}
            </View>
          </View>
        </View>
      </DrawerContentScrollView>
    </View>
  );
}

// Todo: 백그라운드 색상, 아이콘 색상 조정
