import { useCallback, useState, useEffect, useRef, type ReactNode } from 'react'

import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { View, Text, ScrollView, Switch, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import PressableScale from '@/components/ui/PressableScale/PressableScale'
import { requireDb } from '@/config/firebaseConfig'
import { DEPARTMENTS_BY_COLLEGE } from '@/constants/collge'
import { COLORS } from '@/constants/colors'
import { NOTIFICATION_KEYWORDS } from '@/constants/keyword'
import { setJustCompletedOnboarding } from '@/hooks/useOnboarding'
import { usePushNotifications } from '@/hooks/usePushNotifications'
import { useNotificationStore } from '@/store/notificationStore'

const ONBOARDING_KEY = 'hasSeenOnboarding'
const TOTAL_PAGES = 5

type OnboardingPageHeaderProps = {
  step?: number
  title: string
  description: string
}

function OnboardingPageHeader({
  step,
  title,
  description,
}: OnboardingPageHeaderProps) {
  return (
    <View className="mb-6 mt-4">
      {step != null ? (
        <Text className="mb-2 text-center text-[14px] font-semibold text-primary">
          STEP {step}
        </Text>
      ) : null}
      <Text className="mb-2 text-center text-[24px] font-bold text-text-primary">
        {title}
      </Text>
      <Text className="text-center text-[15px] leading-6 text-text-tertiary">
        {description}
      </Text>
    </View>
  )
}

type OnboardingSelectCardProps = {
  selected: boolean
  onPress: () => void
  children: ReactNode
}

function OnboardingSelectCard({
  selected,
  onPress,
  children,
}: OnboardingSelectCardProps) {
  return (
    <PressableScale
      onPress={onPress}
      className={`rounded-card border p-4 ${
        selected ? 'border-primary bg-primary-soft' : 'border-stroke bg-surface'
      }`}
    >
      {children}
    </PressableScale>
  )
}

export default function OnboardingScreen() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(0)
  const hasTriggeredNotification = useRef(false)

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

  useEffect(() => {
    if (
      currentPage === 4 &&
      !notificationEnabled &&
      !hasTriggeredNotification.current
    ) {
      hasTriggeredNotification.current = true
      void handleToggleNotification(true, setNotificationEnabled)
    }
  }, [
    currentPage,
    notificationEnabled,
    handleToggleNotification,
    setNotificationEnabled,
  ])

  const onToggleNotification = useCallback(
    (value: boolean) => {
      void handleToggleNotification(value, setNotificationEnabled)
    },
    [handleToggleNotification, setNotificationEnabled]
  )

  const handleComplete = async () => {
    try {
      if (!notificationEnabled) {
        await AsyncStorage.setItem(ONBOARDING_KEY, 'true')
        setJustCompletedOnboarding()
        router.replace('/(tabs)/index')
        return
      }

      const token = await getPushToken()
      if (!token) {
        Alert.alert(
          '알림 권한 필요',
          '푸시 토큰을 발급받을 수 없어요. 설정에서 권한을 허용해주세요.'
        )
        return
      }

      const keywordTitles = selectedKeywords.map(
        (key) =>
          NOTIFICATION_KEYWORDS[key as keyof typeof NOTIFICATION_KEYWORDS].title
      )

      const subscribedTopics = [
        ...(selectedDepartment ? [selectedDepartment] : []),
        ...keywordTitles,
      ]

      const firestoreDb = requireDb()
      await setDoc(
        doc(firestoreDb, 'device_tokens', token),
        {
          token,
          subscribed_topics: subscribedTopics,
          user_department: selectedDepartment || null,
          notification_enabled: true,
          updated_at: serverTimestamp(),
          created_at: serverTimestamp(),
        },
        { merge: true }
      )

      await AsyncStorage.setItem(ONBOARDING_KEY, 'true')
      setJustCompletedOnboarding()
      router.replace('/(tabs)/index')
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
      void handleComplete()
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
        return (
          <View className="flex-1 items-center justify-center px-8">
            <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-primary-soft">
              <Ionicons name="notifications" size={36} color={COLORS.primary} />
            </View>
            <Text className="mb-4 text-center text-[24px] font-bold text-text-primary">
              반가워요 👋
            </Text>
            <Text className="text-center text-[16px] leading-7 text-text-secondary">
              동의대 공지를 한눈에 확인할 수 있어요
            </Text>
          </View>
        )

      case 1:
        return (
          <View className="flex-1 px-6">
            <OnboardingPageHeader
              step={1}
              title="어떤 단과대 소속이신가요?"
              description="단과대를 먼저 골라야 학과를 선택할 수 있어요"
            />

            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerClassName="pb-8"
            >
              <View className="gap-3">
                {Object.entries(DEPARTMENTS_BY_COLLEGE).map(
                  ([key, college]) => (
                    <OnboardingSelectCard
                      key={key}
                      selected={selectedCollege === key}
                      onPress={() => setSelectedCollege(key)}
                    >
                      <View className="flex-row items-center justify-between">
                        <Text
                          className={`text-[16px] font-semibold ${
                            selectedCollege === key
                              ? 'text-primary'
                              : 'text-text-primary'
                          }`}
                        >
                          {college.title}
                        </Text>
                        {selectedCollege === key ? (
                          <Ionicons
                            name="checkmark-circle"
                            size={24}
                            color={COLORS.primary}
                          />
                        ) : null}
                      </View>
                    </OnboardingSelectCard>
                  )
                )}
              </View>
            </ScrollView>
          </View>
        )

      case 2:
        return (
          <View className="flex-1 px-6">
            <OnboardingPageHeader
              step={2}
              title="어떤 학과에 다니시나요?"
              description={
                selectedCollege
                  ? DEPARTMENTS_BY_COLLEGE[
                      selectedCollege as keyof typeof DEPARTMENTS_BY_COLLEGE
                    ].title
                  : '먼저 단과대학을 선택해주세요'
              }
            />

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
                    <OnboardingSelectCard
                      key={dept.id}
                      selected={selectedDepartment === dept.name}
                      onPress={() => setSelectedDepartment(dept.name)}
                    >
                      <View className="flex-row items-center justify-between">
                        <Text
                          className={`text-[15px] font-medium ${
                            selectedDepartment === dept.name
                              ? 'text-primary'
                              : 'text-text-primary'
                          }`}
                        >
                          {dept.name}
                        </Text>
                        {selectedDepartment === dept.name ? (
                          <Ionicons
                            name="checkmark-circle"
                            size={24}
                            color={COLORS.primary}
                          />
                        ) : null}
                      </View>
                    </OnboardingSelectCard>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <View className="flex-1 items-center justify-center">
                <Text className="text-[14px] text-text-tertiary">
                  이전 단계에서 단과대학을 선택해주세요
                </Text>
              </View>
            )}
          </View>
        )

      case 3:
        return (
          <View className="flex-1 px-6">
            <OnboardingPageHeader
              step={3}
              title={`어떤 주제의 알림을\n받아 보고 싶으신가요?`}
              description="선택한 주제의 새 공지를 먼저 알려드릴게요"
            />

            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerClassName="pb-8"
            >
              <View className="gap-3">
                {Object.entries(NOTIFICATION_KEYWORDS).map(([key, keyword]) => {
                  const isSelected = selectedKeywords.includes(key)
                  return (
                    <OnboardingSelectCard
                      key={key}
                      selected={isSelected}
                      onPress={() => toggleKeyword(key)}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1 pr-3">
                          <Text
                            className={`mb-1 text-[16px] font-semibold ${
                              isSelected ? 'text-primary' : 'text-text-primary'
                            }`}
                          >
                            {keyword.title}
                          </Text>
                          <Text className="text-[13px] text-text-tertiary">
                            {keyword.description}
                          </Text>
                        </View>
                        {isSelected ? (
                          <Ionicons
                            name="checkmark-circle"
                            size={24}
                            color={COLORS.primary}
                          />
                        ) : null}
                      </View>
                    </OnboardingSelectCard>
                  )
                })}
              </View>
            </ScrollView>
          </View>
        )

      case 4:
        return (
          <View className="flex-1 px-6">
            <OnboardingPageHeader
              step={4}
              title="새 공지를 알림으로 받아볼까요?"
              description="놓치지 않도록 바로 알려드릴게요"
            />

            <View className="gap-4">
              <View className="rounded-card border border-stroke bg-surface p-5">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 pr-4">
                    <View className="mb-1 flex-row items-center gap-2">
                      <Ionicons
                        name="notifications"
                        size={20}
                        color={COLORS.primary}
                      />
                      <Text className="text-[16px] font-semibold text-text-primary">
                        새 공지, 놓치지 마세요
                      </Text>
                    </View>
                    <Text className="text-[13px] leading-5 text-text-tertiary">
                      장학금, 학사일정 등 중요 소식을 실시간으로 알려드려요.
                    </Text>
                  </View>
                  <Switch
                    value={notificationEnabled}
                    onValueChange={onToggleNotification}
                    trackColor={{
                      false: COLORS.textDisabled,
                      true: COLORS.primary,
                    }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </View>

              <View className="gap-3 rounded-card border border-stroke bg-surface p-5">
                <Text className="text-[15px] font-bold text-text-primary">
                  내 선택
                </Text>

                {selectedDepartment ? (
                  <View className="flex-row items-center gap-2">
                    <Ionicons
                      name="school"
                      size={18}
                      color={COLORS.textTertiary}
                    />
                    <Text className="text-[14px] text-text-secondary">
                      {selectedDepartment}
                    </Text>
                  </View>
                ) : null}

                {selectedKeywords.length > 0 ? (
                  <View className="flex-row items-start gap-2">
                    <Ionicons
                      name="pricetag"
                      size={18}
                      color={COLORS.textTertiary}
                      style={{ marginTop: 2 }}
                    />
                    <View className="flex-1 flex-row flex-wrap gap-2">
                      {selectedKeywords.map((key) => (
                        <View
                          key={key}
                          className="rounded-full bg-primary-soft px-3 py-1"
                        >
                          <Text className="text-xs font-medium text-primary">
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
                ) : null}
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
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1">
        <View className="flex-row items-center justify-between px-6">
          {currentPage > 0 ? (
            <PressableScale onPress={handleBack} className="p-2">
              <Ionicons
                name="arrow-back"
                size={24}
                color={COLORS.textPrimary}
              />
            </PressableScale>
          ) : (
            <View className="w-10" />
          )}
        </View>

        {renderPage()}

        <View className="mb-6 flex-row justify-center">
          {Array.from({ length: TOTAL_PAGES }).map((_, index) => (
            <View
              key={index}
              className={`mx-1 h-2 rounded-full ${
                index === currentPage ? 'w-8 bg-primary' : 'w-2 bg-stroke'
              }`}
            />
          ))}
        </View>

        <View className="px-6 pb-8">
          <PressableScale
            onPress={handleNext}
            disabled={!canProceed()}
            className={`rounded-control p-4 ${
              canProceed() ? 'bg-primary' : 'bg-text-disabled'
            }`}
          >
            <Text className="text-center text-[16px] font-semibold text-white">
              {currentPage === TOTAL_PAGES - 1 ? '시작하기' : '다음'}
            </Text>
          </PressableScale>

          {!canProceed() && currentPage > 0 ? (
            <Text className="mt-2 text-center text-[13px] text-text-tertiary">
              위에서 선택해주세요
            </Text>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  )
}
