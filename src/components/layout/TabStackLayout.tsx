import type { ReactElement } from 'react'

import { Stack } from 'expo-router'

import { TAB_SCREEN_BACKGROUND } from '@/constants/tabTheme'

type Props = {
  header: () => ReactElement
}

export function TabStackLayout({ header }: Props) {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#FFFFFF' },
        contentStyle: { backgroundColor: TAB_SCREEN_BACKGROUND },
      }}
    >
      <Stack.Screen name="index" options={{ header }} />
    </Stack>
  )
}
