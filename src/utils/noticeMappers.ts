import {
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
} from 'firebase/firestore'

import { Notice } from '@/types/notice.type'

/** Algolia 인덱스 레코드(히트) — 대시보드 필드와 동일하게 유지 */
export type AlgoliaNoticeHit = {
  saved_at_ms?: number
  saved_at?: string | number
  published_at_ms?: number
  published_at?: string | number
  category?: string
  content_hash?: string
  target_id?: string
  objectID?: string
  department?: string
  link?: string
  scrap_count?: number
  tags?: string[]
  title?: string
}

function hitToSavedAtTimestamp(hit: AlgoliaNoticeHit): Timestamp {
  const savedAtVal =
    hit.saved_at_ms ?? hit.saved_at ?? hit.published_at_ms ?? hit.published_at

  let savedAtMs: number
  if (typeof savedAtVal === 'number') {
    savedAtMs = savedAtVal
  } else if (typeof savedAtVal === 'string' && savedAtVal) {
    savedAtMs = new Date(savedAtVal).getTime()
  } else {
    savedAtMs = Date.now()
  }

  return Timestamp.fromMillis(
    Number.isFinite(savedAtMs) ? savedAtMs : Date.now()
  )
}

export function mapAlgoliaHitToNotice(hit: AlgoliaNoticeHit): Notice {
  const id = hit.objectID ?? ''
  return {
    category: hit.category ?? '',
    content_hash: hit.content_hash ?? id,
    department: hit.department ?? '',
    link: hit.link ?? '',
    saved_at: hitToSavedAtTimestamp(hit),
    scrap_count: hit.scrap_count ?? 0,
    tags: Array.isArray(hit.tags) ? hit.tags : [],
    title: hit.title ?? '',
    target_id: hit.target_id,
  }
}

export function mapAlgoliaHitsToNotices(hits: unknown[]): Notice[] {
  if (!Array.isArray(hits)) return []
  return hits.map((h) => mapAlgoliaHitToNotice(h as AlgoliaNoticeHit))
}

export function mapFirestoreDocToNotice(
  doc: QueryDocumentSnapshot<DocumentData>
): Notice {
  const data = doc.data()
  const rawSaved = data.saved_at
  const saved_at =
    rawSaved instanceof Timestamp ? rawSaved : Timestamp.fromMillis(Date.now())

  return {
    category: data.category ?? '',
    content_hash: (data.content_hash as string | undefined) ?? doc.id,
    department: data.department ?? '',
    link: data.link ?? '',
    saved_at,
    scrap_count: typeof data.scrap_count === 'number' ? data.scrap_count : 0,
    tags: Array.isArray(data.tags) ? data.tags : [],
    title: data.title ?? '',
    target_id: (data.target_id as string | undefined) ?? doc.id,
  }
}
