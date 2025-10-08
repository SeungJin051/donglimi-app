import { Timestamp } from 'firebase/firestore'

// Notice 데이터의 타입을 정의합니다.
export interface Notice {
  content_hash: string
  category: string
  department: string
  link: string
  posted_at: string
  saved_at: Timestamp
  scrap_count: number
  tags: string[]
  title: string
}
