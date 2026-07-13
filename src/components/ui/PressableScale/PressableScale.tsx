import { ReactNode } from 'react'

import {
  Pressable,
  View,
  ViewStyle,
  StyleProp,
  GestureResponderEvent,
} from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

interface PressableScaleProps {
  children: ReactNode
  className?: string
  style?: StyleProp<ViewStyle>
  onPress?: (e: GestureResponderEvent) => void
  disabled?: boolean
}

/**
 * 눌렀을 때 살짝 축소되는(0.97) 공용 터치 컴포넌트.
 * TouchableOpacity 대신 사용해 토스 스타일의 터치 피드백을 제공합니다.
 */
export default function PressableScale({
  children,
  className,
  style,
  onPress,
  disabled,
}: PressableScaleProps) {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => {
        scale.value = withTiming(0.97, { duration: 100 })
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 180 })
      }}
    >
      <Animated.View style={animatedStyle}>
        <View className={className} style={style}>
          {children}
        </View>
      </Animated.View>
    </Pressable>
  )
}
