import { MaterialIcons } from '@expo/vector-icons'
import { View } from 'react-native'
import { BaseToast, BaseToastProps } from 'react-native-toast-message'

// 성공 토스트 커스텀 컴포넌트
export const SuccessToast = (props: BaseToastProps) => (
  <BaseToast
    {...props}
    style={{
      borderLeftWidth: 0,
      backgroundColor: '#4e5968',
      height: 70,
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
      marginHorizontal: 16,
      padding: 10,
    }}
    contentContainerStyle={{
      paddingHorizontal: 16,
      paddingVertical: 12,
      alignItems: 'center',
    }}
    text1Style={{
      fontSize: 15,
      fontWeight: '400',
      color: '#FFFFFF',
      letterSpacing: -0.3,
    }}
    text2Style={{
      fontSize: 13,
      fontWeight: '400',
      color: '#FFFFFF',
      marginTop: 2,
    }}
    renderLeadingIcon={() => (
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 20,
          backgroundColor: '#10B981',
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 12,
          alignSelf: 'center',
        }}
      >
        <MaterialIcons name="check" size={12} color="#FFFFFF" />
      </View>
    )}
  />
)

// 정보 토스트 커스텀 컴포넌트
export const InfoToast = (props: BaseToastProps) => (
  <BaseToast
    {...props}
    style={{
      borderLeftWidth: 0,
      backgroundColor: '#4e5968',
      height: 70,
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
      marginHorizontal: 16,
      padding: 10,
    }}
    contentContainerStyle={{
      paddingHorizontal: 16,
      paddingVertical: 12,
      alignItems: 'center',
    }}
    text1Style={{
      fontSize: 15,
      fontWeight: '400',
      color: '#FFFFFF',
      letterSpacing: -0.3,
    }}
    text2Style={{
      fontSize: 13,
      fontWeight: '400',
      color: '#FFFFFF',
      marginTop: 2,
    }}
    renderLeadingIcon={() => (
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 20,
          backgroundColor: '#3B82F6',
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 12,
          alignSelf: 'center',
        }}
      >
        <MaterialIcons name="info" size={12} color="#ffc65b" />
      </View>
    )}
  />
)

// 토스트 설정 객체
export const toastConfig = {
  success: SuccessToast,
  info: InfoToast,
}
