import { useMemo, useCallback } from 'react'

import {
  NOTIFICATION_KEYWORDS,
  type SelectedKeywords,
} from '@/constants/keyword'
import { useNotificationStore } from '@/store/notificationStore'

/**
 * 알림 설정 관련 비즈니스 로직을 관리하는 커스텀 훅
 */
export function useNotificationSettings() {
  const {
    selectedKeywords: selectedKeywordsArray,
    selectedDepartment,
    notificationEnabled,
    toggleKeyword,
    setSelectedKeywords: setSelectedKeywordsArray,
    setSelectedDepartment,
    setNotificationEnabled,
  } = useNotificationStore()

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
  const handleDepartmentRemove = useCallback(() => {
    setSelectedDepartment(null)
  }, [setSelectedDepartment])

  return {
    // 상태
    selectedKeywords,
    selectedKeywordsArray,
    selectedDepartment,
    selectedDepartments,
    notificationEnabled,

    // 액션
    setNotificationEnabled,
    handleKeywordUpdate,
    handleDepartmentUpdate,
    handleKeywordRemove,
    handleDepartmentRemove,
  }
}
