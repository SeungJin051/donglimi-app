import { Feather } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { View, Text, TouchableOpacity, Alert } from 'react-native'

import { useCategoryFilterStore } from '@/store/categoryFilterStore'
import { useNotificationStore } from '@/store/notificationStore'
import { useScrapStore } from '@/store/scrapStore'
import { useSearchStore } from '@/store/searchStore'
import { queryClient } from '@/utils/queryClient'

const appSupportMenus = [
  { id: 'notifications', title: '알림 설정' },
  { id: 'help', title: '건의하기' },
] as const

const appInfoMenus = [
  { id: 'terms', title: '이용 약관' },
  { id: 'privacy', title: '개인정보 처리방침' },
  { id: 'license', title: '오픈소스 라이선스' },
] as const

export default function SettingContent() {
  const router = useRouter()
  const { resetSettings } = useNotificationStore()
  const { clearCategory } = useCategoryFilterStore()
  const { scraps, setSortPreference } = useScrapStore()
  const { clearHistory } = useSearchStore()

  const handleMenuPress = (menuId: string) => {
    switch (menuId) {
      case 'notifications':
        router.push('/notification-setting')
        break
      case 'help':
        router.push('/suggestion')
        break
      case 'terms':
        router.push('/terms-of-service')
        break
      case 'privacy':
        router.push('/privacy-policy')
        break
      case 'license':
        router.push('/open-source-licenses')
        break
      default:
    }
  }

  const handleDevReset = () => {
    Alert.alert(
      '개발자 도구',
      '앱의 모든 영속성 데이터를 초기화하시겠습니까?\n\n- AsyncStorage\n- Zustand 스토어\n- React Query 캐시',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '초기화',
          style: 'destructive',
          onPress: async () => {
            try {
              // AsyncStorage 전체 초기화
              await AsyncStorage.clear()
              // Zustand 스토어 초기화
              resetSettings()
              clearCategory()
              // 스크랩 초기화 (직접 상태 리셋)
              scraps.length = 0
              setSortPreference('latest')
              clearHistory()
              // React Query 캐시 초기화
              queryClient.clear()
              Alert.alert('완료', '모든 데이터가 초기화되었습니다.')
            } catch {
              Alert.alert('오류', '초기화 중 문제가 발생했습니다.')
            }
          },
        },
      ]
    )
  }
  return (
    <View className="gap-6 p-4">
      {/* 앱 지원 */}
      <View className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <View className="border-b border-gray-200 px-4 py-3">
          <Text className="text-base font-semibold text-gray-900">앱 지원</Text>
        </View>
        {appSupportMenus.map((menu, index) => (
          <TouchableOpacity
            key={menu.id}
            className={`flex-row items-center justify-between border-b border-gray-200 px-4 py-3.5 ${
              index === appSupportMenus.length - 1 ? 'border-b-0' : ''
            }`}
            onPress={() => handleMenuPress(menu.id)}
          >
            <Text className="text-base text-gray-800">{menu.title}</Text>
            <Feather name="chevron-right" size={22} color="#A0A0A0" />
          </TouchableOpacity>
        ))}
      </View>

      {/* 앱 정보 */}
      <View className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <View className="border-b border-gray-200 px-4 py-3">
          <Text className="text-base font-semibold text-gray-900">앱 정보</Text>
        </View>
        {appInfoMenus.map((menu, index) => (
          <TouchableOpacity
            key={menu.id}
            className={`flex-row items-center justify-between border-b border-gray-200 px-4 py-3.5 ${
              index === appInfoMenus.length - 1 ? 'border-b-0' : ''
            }`}
            onPress={() => handleMenuPress(menu.id)}
          >
            <Text className="text-base text-gray-800">{menu.title}</Text>
            <Feather name="chevron-right" size={22} color="#A0A0A0" />
          </TouchableOpacity>
        ))}
      </View>

      {/* 개발자 도구 (개발 환경에서만 표시) */}
      {__DEV__ && (
        <View className="overflow-hidden rounded-xl border border-red-200 bg-red-50 shadow-sm">
          <View className="border-b border-red-200 px-4 py-3">
            <Text className="text-base font-semibold text-red-900">
              개발자 도구
            </Text>
          </View>
          <TouchableOpacity
            className="flex-row items-center justify-between px-4 py-3.5"
            onPress={handleDevReset}
          >
            <Text className="text-base text-red-800">앱 영속성 초기화</Text>
            <Feather name="trash-2" size={22} color="#DC2626" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
