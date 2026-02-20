import { useEffect } from 'react'

import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Tabs, usePathname } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { HomeHeader } from '@/components/layout/HomeHeader'
import { NotificationHeader } from '@/components/layout/NotificationHeader'
import { ScrapHeader } from '@/components/layout/ScrapHeader/ScrapHeader'
import { SettingHeader } from '@/components/layout/SettingHeader/SettingHeader'
import { UtilHeader } from '@/components/layout/UtilHeader/UtilHeader'
import { OfflineToastBridge } from '@/components/network/OfflineToastBridge'
import { useInterstitialAd } from '@/hooks/useInterstitialAd'
import { useAdStore } from '@/store/adStore'
import { canShowTabSwitchAd } from '@/utils/adManager'

export default function TabLayout() {
  const pathname = usePathname()
  const { showAd } = useInterstitialAd()
  const {
    tabSwitchCount,
    todayAdCount,
    incrementTabSwitchCount,
    increaseCount,
  } = useAdStore()

  // 탭 전환 감지
  useEffect(() => {
    // 초기 로드는 무시
    if (!pathname) return

    // 탭 전환 카운트 증가
    incrementTabSwitchCount()

    // 광고 표시 판단
    const shouldShow = canShowTabSwitchAd({
      tabSwitchCount: tabSwitchCount + 1,
      todayCount: todayAdCount,
    })

    if (shouldShow) {
      setTimeout(() => {
        showAd()
        increaseCount()
      }, 800)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    // 안전 영역
    <SafeAreaProvider>
      <OfflineToastBridge />
      {/* 공통 레이아웃 안에서 페이지 내용이 표시될 위치 */}
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#093a87',
          tabBarInactiveTintColor: '#999999',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 0, // 탭 바 상단 보더 제거
            elevation: 0, // 안드로이드 그림자 제거
            height: 75,
            paddingBottom: 20, // iOS 하단 패딩 조정
          },
          tabBarIconStyle: {
            marginTop: 10, // 아이콘을 아래로 5px 내립니다.
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerShown: true, // 헤더 표시
            title: '홈',
            tabBarIcon: ({ color }: { color: string }) => (
              <Ionicons name="home" color={color} size={28} />
            ),
            header: () => <HomeHeader />,
            tabBarShowLabel: false,
          }}
          // 홈 탭에서만 스와이프 활성화/비활성화
          listeners={({ navigation }) => ({
            focus: () => {
              navigation.getParent()?.setOptions({
                swipeEnabled: true,
              })
            },
            blur: () => {
              navigation.getParent()?.setOptions({
                swipeEnabled: false,
              })
            },
          })}
        />
        <Tabs.Screen
          name="notification"
          options={{
            title: '알림',
            tabBarIcon: ({ color }: { color: string }) => (
              <MaterialIcons name="notifications" color={color} size={28} />
            ),
            header: () => <NotificationHeader />,
            tabBarShowLabel: false,
          }}
        />
        <Tabs.Screen
          name="util"
          options={{
            title: '유틸',
            tabBarIcon: ({ color }: { color: string }) => (
              <MaterialIcons name="apps" color={color} size={28} />
            ),
            header: () => <UtilHeader />,
            tabBarShowLabel: false,
          }}
        />
        <Tabs.Screen
          name="scrap"
          options={{
            title: '스크랩',
            tabBarIcon: ({ color }: { color: string }) => (
              <MaterialIcons name="bookmark" color={color} size={28} />
            ),
            header: () => <ScrapHeader />,
            tabBarShowLabel: false,
          }}
        />
        <Tabs.Screen
          name="setting"
          options={{
            title: '셋팅',
            tabBarIcon: ({ color }: { color: string }) => (
              <MaterialIcons name="settings" color={color} size={28} />
            ),
            header: () => <SettingHeader />,
            tabBarShowLabel: false,
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  )
}
