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

// 푸시 알림 아이템
export interface PushNotificationDoc {
  id: string // 문서 id
  token?: string // Expo 푸시 토큰 (없을 수 있음)
  title: string
  body?: string
  // 링크/식별자 다양한 키 대응
  noticeLink?: string
  link?: string
  noticeId?: string
  content_hash?: string
  target_id?: string
  // 메타 정보
  category?: string
  department?: string
  tags?: string[]
  // 읽음 플래그 다양한 키 대응
  read?: boolean
  is_read?: boolean
  // 시간 필드 다양한 키 대응
  createdAt?: import('firebase/firestore').Timestamp
  sent_at?: import('firebase/firestore').Timestamp
  saved_at?: import('firebase/firestore').Timestamp
  published_at?: import('firebase/firestore').Timestamp
}

// 앱에서 쓰기 편한 형태
export interface PushNotificationItem {
  id: string
  title: string
  body: string
  noticeLink?: string
  noticeId?: string
  category?: string
  department?: string
  read: boolean
  createdAtMs: number
}
