import Toast from 'react-native-toast-message'

// 성공 토스트 표시
export const showSuccessToast = (title: string, message?: string) => {
  Toast.show({
    type: 'success',
    text1: title,
    text2: message,
    visibilityTime: 3000,
    autoHide: true,
    position: 'bottom',
  })
}

// 정보 토스트 표시
export const showInfoToast = (title: string, message?: string) => {
  Toast.show({
    type: 'info',
    text1: title,
    text2: message,
    visibilityTime: 3000,
    autoHide: true,
    position: 'bottom',
  })
}
