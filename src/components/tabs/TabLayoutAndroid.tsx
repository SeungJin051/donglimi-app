import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Tabs } from 'expo-router'
import { Platform, StyleSheet } from 'react-native'

import { TAB_ACTIVE_COLOR } from '@/constants/tabTheme'

const isIos = Platform.OS === 'ios'

/** Android 및 iOS 25 이하 */
export function TabLayoutAndroid() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: TAB_ACTIVE_COLOR,
        tabBarInactiveTintColor: isIos ? '#8E8E93' : '#8B95A1',
        tabBarShowLabel: isIos,
        tabBarLabelStyle: isIos
          ? { fontSize: 10, fontWeight: '500', marginBottom: 2 }
          : undefined,
        tabBarStyle: isIos
          ? {
              backgroundColor: '#F9F9F9',
              borderTopWidth: StyleSheet.hairlineWidth,
              borderTopColor: '#C6C6C8',
            }
          : {
              backgroundColor: '#FFFFFF',
              borderTopWidth: 0,
              elevation: 0,
              height: 75,
              paddingBottom: 20,
            },
        tabBarIconStyle: isIos ? undefined : { marginTop: 10 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              color={color}
              size={isIos ? 26 : 28}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          focus: () => {
            navigation.getParent()?.setOptions({ swipeEnabled: true })
          },
          blur: () => {
            navigation.getParent()?.setOptions({ swipeEnabled: false })
          },
        })}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: '알림',
          tabBarIcon: ({ color, size }) =>
            isIos ? (
              <Ionicons name="notifications-outline" color={color} size={26} />
            ) : (
              <MaterialIcons name="notifications" color={color} size={size} />
            ),
        }}
      />
      <Tabs.Screen
        name="util"
        options={{
          title: '유틸',
          tabBarIcon: ({ color, size }) =>
            isIos ? (
              <Ionicons name="grid-outline" color={color} size={26} />
            ) : (
              <MaterialIcons name="apps" color={color} size={size} />
            ),
        }}
      />
      <Tabs.Screen
        name="scrap"
        options={{
          title: '스크랩',
          tabBarIcon: ({ color, focused, size }) =>
            isIos ? (
              <Ionicons
                name={focused ? 'bookmark' : 'bookmark-outline'}
                color={color}
                size={26}
              />
            ) : (
              <MaterialIcons name="bookmark" color={color} size={size} />
            ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: '설정',
          tabBarIcon: ({ color, size }) =>
            isIos ? (
              <Ionicons name="settings-outline" color={color} size={26} />
            ) : (
              <MaterialIcons name="settings" color={color} size={size} />
            ),
        }}
      />
    </Tabs>
  )
}
