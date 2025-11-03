import { Timestamp } from 'firebase/firestore'

// Notice 데이터의 타입을 정의합니다.
export interface Notice {
  category: string
  content_hash: string
  department: string
  link: string
  saved_at: Timestamp
  scrap_count: number
  tags: string[]
  title: string
  target_id?: string
}
