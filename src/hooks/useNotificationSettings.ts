import { useMemo, useCallback, useEffect, useState } from 'react'

import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'

import { requireDb } from '@/config/firebaseConfig'
import {
  NOTIFICATION_KEYWORDS,
  type SelectedKeywords,
} from '@/constants/keyword'
import { usePushNotifications } from '@/hooks/usePushNotifications'
import { useNotificationStore } from '@/store/notificationStore'

/**
 * 알림 설정 관련 비즈니스 로직을 관리하는 커스텀 훅
 */
export function useNotificationSettings() {
  const { getPushToken, handleToggleNotification } = usePushNotifications()

  const {
    selectedKeywords: selectedKeywordsArray,
    selectedDepartment,
    notificationEnabled,
    toggleKeyword,
    setSelectedKeywords: setSelectedKeywordsArray,
    setSelectedDepartment,
    setNotificationEnabled,
  } = useNotificationStore()

  // 현재 기기의 Expo Push Token (Firestore 문서 ID로 사용)
  const [pushToken, setPushToken] = useState<string | null>(null)

  // 마운트 시 한 번 토큰 조회 (시뮬레이터 등에서는 null 가능)
  useEffect(() => {
    const fetchToken = async () => {
      const token = await getPushToken()
      setPushToken(token)
    }
    fetchToken()
  }, [getPushToken])

  // string[] 형태를 SelectedKeywords 객체로 변환
  const selectedKeywords: SelectedKeywords = useMemo(() => {
    return selectedKeywordsArray.reduce((acc, key) => {
      acc[key as keyof typeof NOTIFICATION_KEYWORDS] = true
      return acc
    }, {} as SelectedKeywords)
  }, [selectedKeywordsArray])

  // 선택된 학과를 배열로 변환 (기존 인터페이스 호환)
  const selectedDepartments = useMemo(() => {
    return selectedDepartment ? [selectedDepartment] : []
  }, [selectedDepartment])

  // Firestore 저장 함수 (알림 OFF 시 삭제, ON 시 upsert)
  const saveSettingsToFirestore = useCallback(async () => {
    if (!pushToken) return // 토큰 없으면 무시 (웹/시뮬레이터/권한 미허용 등)
    const firestoreDb = requireDb()
    const docRef = doc(firestoreDb, 'device_tokens', pushToken)

    if (!notificationEnabled) {
      try {
        await deleteDoc(docRef)
      } catch {
        // ignore: 개발용
      }
      return
    }

    // selectedKeywordsArray의 key를 title로 변환
    const keywordTopics = selectedKeywordsArray.map(
      (key) =>
        NOTIFICATION_KEYWORDS[key as keyof typeof NOTIFICATION_KEYWORDS].title
    )
    const departmentTopics = selectedDepartments
    const merged = Array.from(new Set([...departmentTopics, ...keywordTopics]))

    try {
      await setDoc(
        docRef,
        {
          token: pushToken,
          subscribed_topics: merged,
          notification_enabled: true,
          updated_at: serverTimestamp(),
          created_at: serverTimestamp(),
        },
        { merge: true }
      )
    } catch {
      // ignore
    }
  }, [
    pushToken,
    notificationEnabled,
    selectedKeywordsArray,
    selectedDepartments,
  ])

  // 변경 자동 저장 (debounce)
  useEffect(() => {
    if (pushToken === null) return
    const timer = setTimeout(() => {
      void saveSettingsToFirestore()
    }, 800)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pushToken,
    notificationEnabled,
    selectedKeywordsArray,
    selectedDepartments,
  ])

  // 키워드 업데이트 핸들러 (KeywordBottomSheet에서 호출)
  const handleKeywordUpdate = useCallback(
    (newSelectedKeywords: SelectedKeywords) => {
      // SelectedKeywords 객체에서 선택된 키워드들만 추출하여 배열로 변환
      const keywordsArray = Object.keys(newSelectedKeywords).filter(
        (key) => newSelectedKeywords[key as keyof typeof NOTIFICATION_KEYWORDS]
      )
      // 전역 상태 업데이트
      setSelectedKeywordsArray(keywordsArray)
    },
    [setSelectedKeywordsArray]
  )

  // 학과 업데이트 핸들러 (DepatmentBottomSheet에서 호출)
  const handleDepartmentUpdate = useCallback(
    (newSelectedDepartments: string[]) => {
      // 첫 번째 학과만 저장 (단일 선택)
      setSelectedDepartment(newSelectedDepartments[0] || null)
    },
    [setSelectedDepartment]
  )

  // 키워드 제거 핸들러
  const handleKeywordRemove = useCallback(
    (keywordKey: string) => {
      toggleKeyword(keywordKey)
    },
    [toggleKeyword]
  )

  // 학과 제거 핸들러
  const handleDepartmentRemove = useCallback(
    (departmentName: string) => {
      // 제거할 학과가 현재 선택된 학과와 일치하면 null로 설정
      if (selectedDepartment === departmentName) {
        setSelectedDepartment(null)
      }
    },
    [selectedDepartment, setSelectedDepartment]
  )

  // 알림 토글 핸들러 (푸시 권한 요청 포함)
  const handleNotificationToggle = useCallback(
    (value: boolean) => {
      handleToggleNotification(value, setNotificationEnabled)
    },
    [handleToggleNotification, setNotificationEnabled]
  )

  return {
    // 상태
    selectedKeywords,
    selectedKeywordsArray,
    selectedDepartment,
    selectedDepartments,
    notificationEnabled,

    // 액션
    handleNotificationToggle,
    handleKeywordUpdate,
    handleDepartmentUpdate,
    handleKeywordRemove,
    handleDepartmentRemove,
    // 내부에서 토큰을 관리하지만, 필요 시 외부 사용을 위해 노출
    pushToken,
    saveSettingsToFirestore,
  }
}
