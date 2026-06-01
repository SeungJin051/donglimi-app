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
}

const fetchNoticesPage = async ({
  pageParam,
  category,
  limitCount,
}: {
  pageParam?: QueryDocumentSnapshot<DocumentData>
  category?: string
  limitCount: number
}): Promise<FetchNoticesPageResult> => {
  const firestoreDb = requireDb()
  const noticesRef = collection(firestoreDb, 'notices')

  const base = category
    ? query(
        noticesRef,
        where('department', '==', category),
        orderBy('saved_at', 'desc')
      )
    : query(noticesRef, orderBy('saved_at', 'desc'))

  const q = pageParam
    ? query(base, startAfter(pageParam), limit(limitCount))
    : query(base, limit(limitCount))

  const snap = await getDocs(q)
  const docs = snap.docs
  const notices = docs.map(mapFirestoreDocToNotice)
  const lastVisible = docs.length > 0 ? docs[docs.length - 1] : undefined

  return { notices, lastVisible }
}

export const useFetchNotices = (limitCount = 10) => {
  const { selectedCategory } = useCategoryFilterStore()
  const categoryKey = selectedCategory ?? 'all'

  return useInfiniteQuery({
    queryKey: ['notices', 'list', categoryKey, limitCount],
    queryFn: async ({ pageParam }) =>
      fetchNoticesPage({
        pageParam: pageParam as QueryDocumentSnapshot<DocumentData> | undefined,
        category: selectedCategory || undefined,
        limitCount,
      }),
    initialPageParam: undefined as
      | QueryDocumentSnapshot<DocumentData>
      | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.notices.length < limitCount) return undefined
      return lastPage.lastVisible
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
