import { useState } from 'react'

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

import SettingDetailHeader from '@/components/layout/SettingDetailHeader/SettingDetailHeader'
import { db } from '@/config/firebaseConfig'
import { showSuccessToast } from '@/utils/toastUtils'

const suggestionTypes = [
  {
    id: 'bug',
    label: '🐛 버그 신고',
    description: '앱에서 발생한 오류나 버그',
  },
  {
    id: 'feature',
    label: '💡 기능 제안',
    description: '새로운 기능이나 개선사항',
  },
  { id: 'ui', label: '🎨 UI/UX 개선', description: '디자인이나 사용성 개선' },
  { id: 'etc', label: '📝 기타 문의', description: '기타 문의사항이나 건의' },
]

export default function SuggestionScreen() {
  const [selectedType, setSelectedType] = useState<string>('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 건의사항 전송
  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      await addDoc(collection(db, 'suggestions'), {
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
    <View className="flex-1 bg-gray-50">
      <SettingDetailHeader title="건의하기" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-4 pt-4"
          showsVerticalScrollIndicator={false}
        >
          {/* 문의 유형 선택 */}
          <View className="mb-6">
            <Text className="mb-3 text-lg font-semibold text-gray-900">
              문의 유형
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {suggestionTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  className={`rounded-xl border p-3 ${
                    selectedType === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white'
                  }`}
                  onPress={() => setSelectedType(type.id)}
                  style={{ width: '23%' }}
                >
                  <Text className="text-center text-2xl">
                    {type.label.split(' ')[0]}
                  </Text>
                  <Text
                    className={`mt-1 text-center text-xs font-medium ${
                      selectedType === type.id
                        ? 'text-blue-700'
                        : 'text-gray-900'
                    }`}
                  >
                    {type.label.split(' ')[1]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 제목 입력 */}
          <View className="mb-6">
            <Text className="mb-3 text-lg font-semibold text-gray-900">
              제목
            </Text>
            <TextInput
              className="rounded-xl border border-gray-200 bg-white p-4 text-base"
              placeholder="제목을 입력해주세요 (최소 5자)"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>

          {/* 내용 입력 */}
          <View className="mb-6">
            <Text className="mb-3 text-lg font-semibold text-gray-900">
              내용
            </Text>
            <TextInput
              className="rounded-xl border border-gray-200 bg-white p-4 text-base"
              placeholder="자세한 내용을 입력해주세요 (최소 5자)"
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              style={{ height: 150 }}
              maxLength={1000}
            />
            <Text className="mt-2 text-right text-sm text-gray-500">
              {content.length}/1000
            </Text>
          </View>

          {/* 전송 버튼 */}
          <TouchableOpacity
            className={`mb-8 rounded-xl p-4 ${
              isSubmitting ||
              !selectedType ||
              title.trim().length < 5 ||
              content.trim().length < 5
                ? 'bg-gray-300'
                : 'bg-deu-light-blue'
            }`}
            onPress={handleSubmit}
            disabled={
              isSubmitting ||
              !selectedType ||
              title.trim().length < 5 ||
              content.trim().length < 5
            }
          >
            <Text className="text-center text-lg font-semibold text-white">
              {isSubmitting ? '전송 중...' : '건의사항 전송'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}
