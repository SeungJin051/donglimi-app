import { useInfiniteQuery } from '@tanstack/react-query'
import {
  collection,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  where,
} from 'firebase/firestore'

import { requireDb } from '@/config/firebaseConfig'
import { useCategoryFilterStore } from '@/store/categoryFilterStore'
import { Notice } from '@/types/notice.type'
import { mapFirestoreDocToNotice } from '@/utils/noticeMappers'

type FetchNoticesPageResult = {
  notices: Notice[]
  lastVisible?: QueryDocumentSnapshot<DocumentData>
  nextOffset?: number
}

type PageParam = QueryDocumentSnapshot<DocumentData> | number | undefined

/** 카테고리별 1회 조회 캐시 (복합 인덱스 없이 equality만 사용할 때) */
const categoryNoticeCache = new Map<string, Notice[]>()
const categoryUsesOffsetFallback = new Set<string>()

function sortNoticesBySavedAtDesc(notices: Notice[]) {
  return [...notices].sort(
    (a, b) => b.saved_at.toMillis() - a.saved_at.toMillis()
  )
}

function isMissingIndexError(error: unknown) {
  if (!error || typeof error !== 'object') return false
  const code = (error as { code?: string }).code
  const message = (error as { message?: string }).message ?? ''
  return (
    code === 'failed-precondition' && message.toLowerCase().includes('index')
  )
}

async function fetchAllNoticesPage({
  pageParam,
  limitCount,
}: {
  pageParam?: QueryDocumentSnapshot<DocumentData>
  limitCount: number
}): Promise<FetchNoticesPageResult> {
  const firestoreDb = requireDb()
  const noticesRef = collection(firestoreDb, 'notices')
  const base = query(noticesRef, orderBy('saved_at', 'desc'))
  const q = pageParam
    ? query(base, startAfter(pageParam), limit(limitCount))
    : query(base, limit(limitCount))

  const snap = await getDocs(q)
  const docs = snap.docs
  const notices = docs.map(mapFirestoreDocToNotice)
  const lastVisible = docs.length > 0 ? docs[docs.length - 1] : undefined

  return { notices, lastVisible }
}

async function fetchCategoryNoticesWithIndex({
  pageParam,
  category,
  limitCount,
}: {
  pageParam?: QueryDocumentSnapshot<DocumentData>
  category: string
  limitCount: number
}): Promise<FetchNoticesPageResult> {
  const firestoreDb = requireDb()
  const noticesRef = collection(firestoreDb, 'notices')
  const base = query(
    noticesRef,
    where('department', '==', category),
    orderBy('saved_at', 'desc')
  )
  const q = pageParam
    ? query(base, startAfter(pageParam), limit(limitCount))
    : query(base, limit(limitCount))

  const snap = await getDocs(q)
  const docs = snap.docs
  const notices = docs.map(mapFirestoreDocToNotice)
  const lastVisible = docs.length > 0 ? docs[docs.length - 1] : undefined

  return { notices, lastVisible }
}

async function fetchCategoryNoticesWithoutIndex({
  pageParam,
  category,
  limitCount,
}: {
  pageParam?: number
  category: string
  limitCount: number
}): Promise<FetchNoticesPageResult> {
  const offset = pageParam ?? 0

  if (offset === 0) {
    categoryNoticeCache.delete(category)
  }

  if (!categoryNoticeCache.has(category)) {
    const firestoreDb = requireDb()
    const noticesRef = collection(firestoreDb, 'notices')
    const snap = await getDocs(
      query(noticesRef, where('department', '==', category))
    )
    const sorted = sortNoticesBySavedAtDesc(
      snap.docs.map(mapFirestoreDocToNotice)
    )
    categoryNoticeCache.set(category, sorted)
  }

  const all = categoryNoticeCache.get(category) ?? []
  const notices = all.slice(offset, offset + limitCount)
  const nextOffset =
    offset + limitCount < all.length ? offset + limitCount : undefined

  return { notices, nextOffset }
}

const fetchNoticesPage = async ({
  pageParam,
  category,
  limitCount,
}: {
  pageParam?: PageParam
  category?: string
  limitCount: number
}): Promise<FetchNoticesPageResult> => {
  if (!category) {
    return fetchAllNoticesPage({
      pageParam: pageParam as QueryDocumentSnapshot<DocumentData> | undefined,
      limitCount,
    })
  }

  const useOffsetFallback =
    typeof pageParam === 'number' || categoryUsesOffsetFallback.has(category)

  if (useOffsetFallback) {
    return fetchCategoryNoticesWithoutIndex({
      pageParam: typeof pageParam === 'number' ? pageParam : undefined,
      category,
      limitCount,
    })
  }

  try {
    return await fetchCategoryNoticesWithIndex({
      pageParam: pageParam as QueryDocumentSnapshot<DocumentData> | undefined,
      category,
      limitCount,
    })
  } catch (error) {
    if (!isMissingIndexError(error)) {
      throw error
    }

    console.warn(
      '[notices] department+saved_at 인덱스가 없어 equality 쿼리로 대체합니다.',
      category
    )
    categoryUsesOffsetFallback.add(category)

    return fetchCategoryNoticesWithoutIndex({
      pageParam: undefined,
      category,
      limitCount,
    })
  }
}

export const useFetchNotices = (limitCount = 10) => {
  const { selectedCategory } = useCategoryFilterStore()
  const categoryKey = selectedCategory ?? 'all'

  return useInfiniteQuery({
    queryKey: ['notices', 'list', categoryKey, limitCount],
    queryFn: async ({ pageParam }) =>
      fetchNoticesPage({
        pageParam: pageParam as PageParam,
        category: selectedCategory || undefined,
        limitCount,
      }),
    initialPageParam: undefined as PageParam,
    getNextPageParam: (lastPage) => {
      if (lastPage.notices.length < limitCount) return undefined
      if (lastPage.nextOffset != null) return lastPage.nextOffset
      return lastPage.lastVisible
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
