import type { ReactNode } from 'react'

import { Platform, View, type StyleProp, type ViewStyle } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = {
  children: ReactNode
  /** 내부 행/블록용 className (NativeWind) */
  className?: string
  style?: StyleProp<ViewStyle>
}

/**
 * 탭 Stack 커스텀 헤더용 — status bar / 노치 inset 적용.
 * (Native Tabs·JS Tabs 모두 Stack custom header는 top inset을 직접 처리해야 함)
 */
export function TabScreenHeader({ children, className, style }: Props) {
  return (
    <SafeAreaView edges={['top']} className="bg-surface">
      <View
        className={className}
        style={[Platform.OS === 'android' && { paddingTop: 10 }, style]}
      >
        {children}
      </View>
    </SafeAreaView>
  )
}
