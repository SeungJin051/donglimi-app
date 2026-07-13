import { useState, useCallback } from 'react'

import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import { router } from 'expo-router'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import SettingDetailHeader from '@/components/layout/SettingDetailHeader/SettingDetailHeader'
import { requireDb } from '@/config/firebaseConfig'
import { COLORS } from '@/constants/colors'
import { useInternetStatus } from '@/hooks/useInternetStatus'
import { showInfoToast, showSuccessToast } from '@/utils/toastUtils'

const suggestionTypes = [
  {
    id: 'bug',
    label: '버그 신고',
    renderIcon: (active: boolean) => (
      <MaterialCommunityIcons
        name="bug-outline"
        size={32}
        color={active ? COLORS.primary : COLORS.textSecondary}
      />
    ),
  },
  {
    id: 'feature',
    label: '기능 제안',
    renderIcon: (active: boolean) => (
      <Ionicons
        name="bulb-outline"
        size={32}
        color={active ? COLORS.primary : COLORS.textSecondary}
      />
    ),
  },
  {
    id: 'ui',
    label: 'UI/UX',
    renderIcon: (active: boolean) => (
      <Ionicons
        name="color-palette-outline"
        size={32}
        color={active ? COLORS.primary : COLORS.textSecondary}
      />
    ),
  },
  {
    id: 'etc',
    label: '기타 문의',
    renderIcon: (active: boolean) => (
      <Ionicons
        name="document-text-outline"
        size={32}
        color={active ? COLORS.primary : COLORS.textSecondary}
      />
    ),
  },
]

export default function SuggestionScreen() {
  const [selectedType, setSelectedType] = useState<string>('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const { isOnline } = useInternetStatus()

  // 화면 재진입 시 항상 STEP 1부터 시작
  useFocusEffect(
    useCallback(() => {
      setStep(1)
      return undefined
    }, [])
  )

  // 건의사항 전송
  const handleSubmit = async () => {
    // 오프라인이면 전송 차단 + 토스트
    if (isOnline === false) {
      showInfoToast(
        '오프라인 상태입니다',
        '네트워크 연결 후 다시 시도해 주세요.'
      )
      return
    }

    setIsSubmitting(true)

    try {
      const firestoreDb = requireDb()
      await addDoc(collection(firestoreDb, 'suggestions'), {
        type: selectedType,
        title: title.trim(),
        content: content.trim(),
        timestamp: serverTimestamp(), // 서버 기준 시간
      })

      showSuccessToast('소중한 의견 감사합니다!')
      router.back()
    } catch (error) {
      console.error('건의사항 전송 실패:', error)
      Alert.alert('전송 실패', '잠시 후 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <SettingDetailHeader title="건의하기" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-4 pt-4"
          showsVerticalScrollIndicator={false}
        >
          {step === 1 ? (
            <>
              <View className="mb-6">
                <Text className="text-[14px] font-semibold text-primary">
                  STEP 1
                </Text>
                <Text className="mt-1 text-[22px] font-bold text-text-primary">
                  어떤 불편함을 겪으셨나요?
                </Text>
              </View>

              {/* 문의 유형 선택 (2x2, 큰 카드, Expo 아이콘) */}
              <View className="mb-8">
                <View className="flex-row flex-wrap justify-between gap-y-3">
                  {suggestionTypes.map((type) => {
                    const active = selectedType === type.id
                    return (
                      <TouchableOpacity
                        key={type.id}
                        onPress={() => setSelectedType(type.id)}
                        activeOpacity={0.8}
                        className={`h-32 w-[48%] items-center justify-center rounded-card ${
                          active ? 'bg-primary-soft' : 'bg-bg'
                        }`}
                      >
                        {type.renderIcon(active)}
                        <Text
                          className={`mt-2 text-[15px] font-semibold ${
                            active ? 'text-primary' : 'text-text-primary'
                          }`}
                        >
                          {type.label}
                        </Text>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </View>

              {/* 다음 버튼 */}
              <TouchableOpacity
                className={`mb-8 rounded-control p-4 ${!selectedType ? 'bg-text-disabled' : 'bg-primary'}`}
                disabled={!selectedType}
                onPress={() => setStep(2)}
                activeOpacity={0.8}
              >
                <Text className="text-center text-[16px] font-semibold text-white">
                  다음
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View className="mb-6">
                <Text className="text-[14px] font-semibold text-primary">
                  STEP 2
                </Text>
                <Text className="mt-1 text-[22px] font-bold text-text-primary">
                  자세한 내용을 입력해주세요.
                </Text>
              </View>

              {/* 제목 입력 */}
              <View className="mb-6">
                <Text className="mb-3 text-[15px] font-semibold text-text-primary">
                  제목
                </Text>
                <TextInput
                  className="rounded-control bg-bg p-4 text-base text-text-primary"
                  placeholder="제목을 입력해주세요 (최소 5자)"
                  placeholderTextColor={COLORS.textTertiary}
                  value={title}
                  onChangeText={setTitle}
                  maxLength={100}
                />
              </View>

              {/* 내용 입력 */}
              <View className="mb-6">
                <Text className="mb-3 text-[15px] font-semibold text-text-primary">
                  내용
                </Text>
                <TextInput
                  className="rounded-control bg-bg p-4 text-base text-text-primary"
                  placeholder="자세한 내용을 입력해주세요 (최소 5자)"
                  placeholderTextColor={COLORS.textTertiary}
                  value={content}
                  onChangeText={setContent}
                  multiline
                  textAlignVertical="top"
                  style={{ height: 150 }}
                  maxLength={1000}
                />
                <Text className="mt-2 text-right text-[13px] text-text-tertiary">
                  {content.length}/1000
                </Text>
              </View>

              {/* 전송 버튼 */}
              <TouchableOpacity
                className={`mb-8 rounded-control p-4 ${
                  isSubmitting ||
                  !selectedType ||
                  title.trim().length < 5 ||
                  content.trim().length < 5
                    ? 'bg-text-disabled'
                    : 'bg-primary'
                }`}
                onPress={handleSubmit}
                disabled={
                  isSubmitting ||
                  !selectedType ||
                  title.trim().length < 5 ||
                  content.trim().length < 5
                }
                activeOpacity={0.8}
              >
                <Text className="text-center text-[16px] font-semibold text-white">
                  {isSubmitting ? '전송 중...' : '건의사항 전송'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
