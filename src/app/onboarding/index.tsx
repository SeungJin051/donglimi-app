import { useCallback, useState } from 'react'

import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { db } from '@/config/firebaseConfig'
import { DEPARTMENTS_BY_COLLEGE } from '@/constants/collge'
import { NOTIFICATION_KEYWORDS } from '@/constants/keyword'
import { usePushNotifications } from '@/hooks/usePushNotifications'
import { useNotificationStore } from '@/store/notificationStore'

const ONBOARDING_KEY = 'hasSeenOnboarding'
const TOTAL_PAGES = 5

export default function OnboardingScreen() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(0)

  // Zustand 스토어에서 상태와 액션 가져오기
  const {
    selectedCollege,
    selectedDepartment,
    selectedKeywords,
    notificationEnabled,
    setSelectedCollege,
    setSelectedDepartment,
    toggleKeyword,
    setNotificationEnabled,
  } = useNotificationStore()

  const { getPushToken, handleToggleNotification } = usePushNotifications()

  // 스위치 ON 시에만 권한 요청 (훅 사용)
  const onToggleNotification = useCallback(
    (value: boolean) => {
      // 훅의 시그니처에 맞춰 setNotificationEnabled 전달
      void handleToggleNotification(value, setNotificationEnabled)
    },
    [handleToggleNotification, setNotificationEnabled]
  )

  // 토큰 발급은 훅의 getPushToken 사용

  const handleComplete = async () => {
    try {
      // 알림이 꺼져있다면 Firestore 저장 없이 온보딩만 완료
      if (!notificationEnabled) {
        await AsyncStorage.setItem(ONBOARDING_KEY, 'true')
        router.replace('/(tabs)')
        return
      }

      // 알림이 켜져있다면 토큰 발급 시도
      const token = await getPushToken()
      if (!token) {
        Alert.alert(
          '알림 권한 필요',
          '푸시 토큰을 발급받을 수 없어요. 설정에서 권한을 허용해주세요.'
        )
        return
      }

      // 구독 토픽 조합: 학과 + 키워드
      const subscribedTopics = [
        ...(selectedDepartment ? [selectedDepartment] : []),
        ...selectedKeywords,
      ]

      // Firestore 저장 (문서 ID를 토큰으로 고정)
      await setDoc(
        doc(db, 'device_tokens', token),
        {
          token,
          subscribed_topics: subscribedTopics,
          notification_enabled: true,
          updated_at: serverTimestamp(),
          created_at: serverTimestamp(),
        },
        { merge: true }
      )

      // 온보딩 완료 표시 후 이동
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true')
      router.replace('/(tabs)')
    } catch (error) {
      console.error('온보딩 완료 처리 실패:', error)
      Alert.alert(
        '오류',
        '온보딩 완료 처리 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.'
      )
    }
  }

  const handleNext = () => {
    if (currentPage < TOTAL_PAGES - 1) {
      setCurrentPage(currentPage + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 0:
        // 환영 페이지
        return (
          <View className="flex-1 items-center justify-center px-8">
            <Text className="mb-4 text-center text-3xl font-bold text-gray-900">
              반가워요 👋
            </Text>
            <Text className="text-center text-lg leading-7 text-gray-600">
              동의대 공지를 한눈에 확인할 수 있어요
            </Text>
          </View>
        )

      case 1:
        // 단과대 선택 페이지
        return (
          <View className="flex-1 px-6">
            <View className="mb-6 mt-4">
              <Text className="mb-2 text-center text-3xl font-bold text-gray-900">
                어떤 단과대 소속이신가요?
              </Text>
              <Text className="text-center text-base text-gray-600">
                단과대를 먼저 골라야 학과를 선택할 수 있어요
              </Text>
            </View>

            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerClassName="pb-8"
            >
              <View className="gap-3">
                {Object.entries(DEPARTMENTS_BY_COLLEGE).map(
                  ([key, college]) => (
                    <TouchableOpacity
                      key={key}
                      onPress={() => setSelectedCollege(key)}
                      className={`rounded-xl border-2 p-4 ${
                        selectedCollege === key
                          ? 'border-[#093a87] bg-blue-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <View className="flex-row items-center justify-between">
                        <Text
                          className={`text-lg font-semibold ${
                            selectedCollege === key
                              ? 'text-[#093a87]'
                              : 'text-gray-900'
                          }`}
                        >
                          {college.title}
                        </Text>
                        {selectedCollege === key && (
                          <Ionicons
                            name="checkmark-circle"
                            size={24}
                            color="#093a87"
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </ScrollView>
          </View>
        )

      case 2:
        // 학과 선택 페이지
        return (
          <View className="flex-1 px-6">
            <View className="mb-6 mt-4">
              <Text className="mb-2 text-center text-3xl font-bold text-gray-900">
                어떤 학과에 다니시나요?
              </Text>
              <Text className="text-center text-base text-gray-600">
                {selectedCollege
                  ? DEPARTMENTS_BY_COLLEGE[
                      selectedCollege as keyof typeof DEPARTMENTS_BY_COLLEGE
                    ].title
                  : '먼저 단과대학을 선택해주세요'}
              </Text>
            </View>

            {selectedCollege ? (
              <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerClassName="pb-8"
              >
                <View className="gap-3">
                  {DEPARTMENTS_BY_COLLEGE[
                    selectedCollege as keyof typeof DEPARTMENTS_BY_COLLEGE
                  ].departments.map((dept) => (
                    <TouchableOpacity
                      key={dept.id}
                      onPress={() => setSelectedDepartment(dept.name)}
                      className={`rounded-xl border-2 p-4 ${
                        selectedDepartment === dept.name
                          ? 'border-[#093a87] bg-blue-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <View className="flex-row items-center justify-between">
                        <Text
                          className={`text-base font-medium ${
                            selectedDepartment === dept.name
                              ? 'text-[#093a87]'
                              : 'text-gray-900'
                          }`}
                        >
                          {dept.name}
                        </Text>
                        {selectedDepartment === dept.name && (
                          <Ionicons
                            name="checkmark-circle"
                            size={24}
                            color="#093a87"
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <View className="flex-1 items-center justify-center">
                <Text className="text-gray-400">
                  이전 단계에서 단과대학을 선택해주세요
                </Text>
              </View>
            )}
          </View>
        )

      case 3:
        // 관심 키워드 선택 페이지
        return (
          <View className="flex-1 px-6">
            <View className="mb-6 mt-4">
              <Text className="mb-2 text-center text-3xl font-bold text-gray-900">
                어떤 주제의 알림을{'\n'}받아 보고 싶으신가요?
              </Text>
              <Text className="text-center text-base text-gray-600">
                선택한 주제의 새 공지를 먼저 알려드릴게요
              </Text>
            </View>

            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerClassName="pb-8"
            >
              <View className="gap-3">
                {Object.entries(NOTIFICATION_KEYWORDS).map(([key, keyword]) => {
                  const isSelected = selectedKeywords.includes(key)
                  return (
                    <TouchableOpacity
                      key={key}
                      onPress={() => toggleKeyword(key)}
                      className={`rounded-xl border-2 p-4 ${
                        isSelected
                          ? 'border-[#093a87] bg-blue-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                          <Text
                            className={`mb-1 text-lg font-semibold ${
                              isSelected ? 'text-[#093a87]' : 'text-gray-900'
                            }`}
                          >
                            {keyword.title}
                          </Text>
                          <Text className="text-sm text-gray-600">
                            {keyword.description}
                          </Text>
                        </View>
                        {isSelected && (
                          <Ionicons
                            name="checkmark-circle"
                            size={24}
                            color="#093a87"
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </ScrollView>
          </View>
        )

      case 4:
        // 알림 설정 및 완료 페이지
        return (
          <View className="flex-1 px-6">
            <View className="mb-8 mt-4">
              <Text className="mb-2 text-center text-3xl font-bold text-gray-900">
                새 공지를 알림으로 받아볼까요?
              </Text>
              <Text className="text-center text-base text-gray-600">
                놓치지 않도록 바로 알려드릴게요
              </Text>
            </View>

            <View className="gap-4">
              {/* 알림 토글 */}
              <View className="rounded-xl border border-gray-200 bg-white p-5">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="mb-1 text-lg font-semibold text-gray-900">
                      🔔 푸시 알림 받기
                    </Text>
                    <Text className="text-sm text-gray-600">
                      새로운 공지사항을 실시간으로 알려드려요
                    </Text>
                  </View>
                  <Switch
                    value={notificationEnabled}
                    onValueChange={onToggleNotification}
                    trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                    thumbColor={notificationEnabled ? '#093a87' : '#F3F4F6'}
                  />
                </View>
              </View>

              {/* 선택한 정보 요약 */}
              <View className="gap-3 rounded-xl border border-gray-200 bg-gray-50 p-5">
                {selectedDepartment && (
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="school" size={18} color="#6B7280" />
                    <Text className="text-sm text-gray-700">
                      {selectedDepartment}
                    </Text>
                  </View>
                )}

                {selectedKeywords.length > 0 && (
                  <View className="flex-row items-start gap-2">
                    <Ionicons
                      name="pricetag"
                      size={18}
                      color="#6B7280"
                      style={{ marginTop: 2 }}
                    />
                    <View className="flex-1 flex-row flex-wrap gap-2">
                      {selectedKeywords.map((key) => (
                        <View
                          key={key}
                          className="rounded-full bg-blue-100 px-3 py-1"
                        >
                          <Text className="text-xs text-blue-700">
                            {
                              NOTIFICATION_KEYWORDS[
                                key as keyof typeof NOTIFICATION_KEYWORDS
                              ].title
                            }
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>
        )

      default:
        return null
    }
  }

  const canProceed = () => {
    if (currentPage === 1) return selectedCollege !== null
    if (currentPage === 2) return selectedDepartment !== null
    return true
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* 헤더 - 뒤로가기/건너뛰기 버튼 */}
        <View className="flex-row items-center justify-between px-6">
          {currentPage > 0 ? (
            <TouchableOpacity onPress={handleBack} className="p-2">
              <Ionicons name="arrow-back" size={24} color="#6B7280" />
            </TouchableOpacity>
          ) : (
            <View className="w-10" />
          )}
        </View>

        {/* 콘텐츠 영역 */}
        {renderPage()}

        {/* 페이지 인디케이터 */}
        <View className="mb-6 flex-row justify-center">
          {Array.from({ length: TOTAL_PAGES }).map((_, index) => (
            <View
              key={index}
              className={`mx-1 h-2 rounded-full ${
                index === currentPage ? 'w-8 bg-[#093a87]' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </View>

        {/* 다음/시작하기 버튼 */}
        <View className="px-6 pb-8">
          <TouchableOpacity
            onPress={handleNext}
            disabled={!canProceed()}
            className={`rounded-xl py-4 ${
              canProceed() ? 'bg-[#093a87]' : 'bg-gray-300'
            }`}
          >
            <Text className="text-center text-lg font-semibold text-white">
              {currentPage === TOTAL_PAGES - 1 ? '시작하기' : '다음'}
            </Text>
          </TouchableOpacity>

          {!canProceed() && currentPage > 0 && (
            <Text className="mt-2 text-center text-sm text-gray-500">
              위에서 선택해주세요
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}
