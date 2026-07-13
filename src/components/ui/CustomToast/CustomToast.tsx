import { MaterialIcons } from '@expo/vector-icons'
import { View, ViewStyle, TextStyle } from 'react-native'
import { BaseToast, BaseToastProps } from 'react-native-toast-message'

import { COLORS } from '@/constants/colors'

// 공통 토스트 스타일 (밝은 카드 + 부드러운 그림자)
const toastStyle: ViewStyle = {
  borderLeftWidth: 0,
  backgroundColor: COLORS.surface,
  height: 64,
  borderRadius: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.08,
  shadowRadius: 16,
  elevation: 6,
  marginHorizontal: 16,
  padding: 8,
}

const contentContainerStyle: ViewStyle = {
  paddingHorizontal: 14,
  paddingVertical: 12,
  justifyContent: 'center',
}

const text1Style: TextStyle = {
  fontSize: 15,
  fontWeight: '600',
  color: COLORS.textPrimary,
  letterSpacing: -0.3,
}

const text2Style: TextStyle = {
  fontSize: 13,
  fontWeight: '400',
  color: COLORS.textTertiary,
  marginTop: 2,
}

const iconCircle = (backgroundColor: string): ViewStyle => ({
  width: 24,
  height: 24,
  borderRadius: 12,
  backgroundColor,
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: 12,
  alignSelf: 'center',
})

// 성공 토스트 커스텀 컴포넌트
export const SuccessToast = (props: BaseToastProps) => (
  <BaseToast
    {...props}
    style={toastStyle}
    contentContainerStyle={contentContainerStyle}
    text1Style={text1Style}
    text2Style={text2Style}
    renderLeadingIcon={() => (
      <View style={iconCircle(COLORS.success)}>
        <MaterialIcons name="check" size={14} color="#FFFFFF" />
      </View>
    )}
  />
)

// 정보 토스트 커스텀 컴포넌트
export const InfoToast = (props: BaseToastProps) => (
  <BaseToast
    {...props}
    style={toastStyle}
    contentContainerStyle={contentContainerStyle}
    text1Style={text1Style}
    text2Style={text2Style}
    renderLeadingIcon={() => (
      <View style={iconCircle(COLORS.primary)}>
        <MaterialIcons name="info-outline" size={14} color="#FFFFFF" />
      </View>
    )}
  />
)

// 토스트 설정 객체
export const toastConfig = {
  success: SuccessToast,
  info: InfoToast,
}
