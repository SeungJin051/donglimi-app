/**
 * 알림 설정 관련 타입 정의
 */

// 알림 설정 정보
export interface NotificationSettings {
  // 선택한 단과대학 키
  selectedCollege: string | null
  // 선택한 학과 이름
  selectedDepartment: string | null
  // 선택한 키워드 목록
  selectedKeywords: string[]
  // 푸시 알림 활성화 여부
  notificationEnabled: boolean
}
