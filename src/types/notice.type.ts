import { Timestamp } from 'firebase/firestore'

// Notice 데이터의 타입을 정의합니다.
export interface Notice {
  id: string // Firestore 문서 ID는 string 타입입니다.
  bookmark_count: number
  category: string
  comment_count: number
  content_hash: string
  created_at: Timestamp
  department: string
  like_count: number
  link: string
  posted_at: string
  posted_at_text: string
  posted_at_ts: Timestamp
  source_host: string
  source_type: string
  tags: string[] // 문자열 배열 타입
  target_id: string
  title: string
  updated_at: Timestamp
}
