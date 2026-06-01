import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs'
import { DynamicColorIOS, useColorScheme } from 'react-native'

import { TAB_ACTIVE_COLOR } from '@/constants/tabTheme'
import { isIos26OrLater } from '@/utils/iosVersion'

const TAB_LABELS = {
  index: '홈',
  notification: '알림',
  util: '유틸',
  scrap: '스크랩',
  setting: '설정',
} as const

/** iOS 26+ — Native Tabs (Liquid Glass) */
export function TabLayoutIos() {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme

  const tintColor = DynamicColorIOS({
    light: TAB_ACTIVE_COLOR,
    dark: '#7EB3FF',
  })

  const labelColor = DynamicColorIOS({
    light: '#8E8E93',
    dark: '#98989D',
  })

  return (
    <ThemeProvider value={theme}>
      <NativeTabs
        tintColor={tintColor}
        labelStyle={{ color: labelColor, fontSize: 10, fontWeight: '500' }}
        backgroundColor={null}
        {...(isIos26OrLater() && { minimizeBehavior: 'onScrollDown' })}
      >
        <NativeTabs.Trigger name="index">
          <Icon sf={{ default: 'house', selected: 'house.fill' }} />
          <Label>{TAB_LABELS.index}</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="notification">
          <Icon sf={{ default: 'bell', selected: 'bell.fill' }} />
          <Label>{TAB_LABELS.notification}</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="util">
          <Icon
            sf={{
              default: 'square.grid.2x2',
              selected: 'square.grid.2x2.fill',
            }}
          />
          <Label>{TAB_LABELS.util}</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="scrap">
          <Icon sf={{ default: 'bookmark', selected: 'bookmark.fill' }} />
          <Label>{TAB_LABELS.scrap}</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="setting">
          <Icon sf={{ default: 'gearshape', selected: 'gearshape.fill' }} />
          <Label>{TAB_LABELS.setting}</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </ThemeProvider>
  )
}
