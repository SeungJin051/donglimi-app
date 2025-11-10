import { useEffect, useMemo, useRef, useState, useCallback } from 'react'

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  updateDoc,
  Unsubscribe,
  orderBy,
  startAfter,
  where,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore'

import { requireDb } from '@/config/firebaseConfig'
import { usePushNotifications } from '@/hooks/usePushNotifications'
import {
  useNotificationCacheStore,
  NotificationScope,
} from '@/store/notificationCacheStore'
import {
  PushNotificationDoc,
  PushNotificationItem,
} from '@/types/notification.type'

type UseFetchNotificationOptions = {
  pageSize?: number
  realtime?: boolean
  filterUnread?: boolean
}

function toItem(docData: PushNotificationDoc): PushNotificationItem {
  return {
    id: docData.id,
    title: docData.title,
    body: docData.body ?? '',
    // 링크/식별자 키 정규화
    noticeLink: docData.noticeLink || docData.link,
    noticeId: docData.noticeId || docData.content_hash || docData.target_id,
    category: docData.category,
    department: docData.department,
    read: docData.is_read ?? false,
    // 우선순위: createdAt > sent_at > saved_at > published_at
    createdAtMs:
      (docData.createdAt?.toMillis?.() as number | undefined) ??
      (docData.sent_at?.toMillis?.() as number | undefined) ??
      (docData.saved_at?.toMillis?.() as number | undefined) ??
      (docData.published_at?.toMillis?.() as number | undefined) ??
      Date.now(),
  }
}

export function useFetchNotification(
  options: UseFetchNotificationOptions = {}
) {
  const { getPushToken } = usePushNotifications()
  const pageSize = options.pageSize ?? 50
  const enableRealtime = options.realtime ?? true

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<PushNotificationItem[]>([])
  const [loadingMore, setLoadingMore] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(true)

  // zustand 스토어 액션/상태는 getState로 접근하여 디펜던시 루프를 방지
  const getCacheState = useNotificationCacheStore.getState

  const tokenRef = useRef<string | null>(null)
  const unsubRef = useRef<Unsubscribe | null>(null)
  const lastDocRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null)

  const fetchToken = useCallback(async (): Promise<string | null> => {
    const token = await getPushToken()
    tokenRef.current = token
    return token
  }, [getPushToken])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const token = tokenRef.current ?? (await fetchToken())
      if (!token) {
        setItems([])
        setHasMore(false)
        setLoading(false)
        return
      }

      // 캐시 하이드레이트 (SWR: stale 먼저 보여주기)
      const scope: NotificationScope = options.filterUnread ? 'unread' : 'all'
      const cacheState = getCacheState()
      if (cacheState.token !== token) cacheState.setToken(token)
      const cached = cacheState.scopes[scope]
      if (cached?.items?.length) {
        setItems(cached.items)
      }

      const firestoreDb = requireDb()
      const col = collection(
        firestoreDb,
        'device_tokens',
        token,
        'notifications'
      )
      const base = options.filterUnread
        ? query(col, where('is_read', '==', false))
        : query(col)
      const q = query(base, orderBy('createdAt', 'desc'), limit(pageSize))

      const snap = await getDocs(q)
      const data: PushNotificationItem[] = snap.docs.map((d) =>
        toItem({ id: d.id, ...(d.data() as Omit<PushNotificationDoc, 'id'>) })
      )

      setItems(data)
      lastDocRef.current =
        snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null
      setHasMore(snap.docs.length === pageSize)

      // 캐시 덮어쓰기
      const last = snap.docs[snap.docs.length - 1]
      const lastCreatedAt =
        (last?.get?.('createdAt')?.toMillis?.() as number | undefined) ?? null
      getCacheState().setScopeData(scope, data, {
        lastCreatedAt,
        lastId: last?.id ?? null,
      })

      if (enableRealtime) {
        unsubRef.current?.()
        unsubRef.current = onSnapshot(q, (ss) => {
          const next = ss.docs.map((d) =>
            toItem({
              id: d.id,
              ...(d.data() as Omit<PushNotificationDoc, 'id'>),
            })
          )
          setItems(next)
          lastDocRef.current =
            ss.docs.length > 0 ? ss.docs[ss.docs.length - 1] : null
          setHasMore(ss.docs.length === pageSize)

          const l = ss.docs[ss.docs.length - 1]
          const lCreatedAt =
            (l?.get?.('createdAt')?.toMillis?.() as number | undefined) ?? null
          getCacheState().setScopeData(scope, next, {
            lastCreatedAt: lCreatedAt,
            lastId: l?.id ?? null,
          })
        })
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e)
      setError(message || '알림을 불러오지 못했어요')
    } finally {
      setLoading(false)
    }
  }, [
    enableRealtime,
    fetchToken,
    pageSize,
    options.filterUnread,
    getCacheState,
  ])

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    try {
      const token = tokenRef.current ?? (await fetchToken())
      if (!token) {
        setLoadingMore(false)
        return
      }
      const firestoreDb = requireDb()
      const scope: NotificationScope = options.filterUnread ? 'unread' : 'all'
      const col = collection(
        firestoreDb,
        'device_tokens',
        token,
        'notifications'
      )
      const base = options.filterUnread
        ? query(col, where('is_read', '==', false))
        : query(col)

      const q = lastDocRef.current
        ? query(
            base,
            orderBy('createdAt', 'desc'),
            startAfter(lastDocRef.current),
            limit(pageSize)
          )
        : query(base, orderBy('createdAt', 'desc'), limit(pageSize))

      const snap = await getDocs(q)
      const data: PushNotificationItem[] = snap.docs.map((d) =>
        toItem({ id: d.id, ...(d.data() as Omit<PushNotificationDoc, 'id'>) })
      )

      setItems((prev) => [...prev, ...data])
      lastDocRef.current =
        snap.docs.length > 0
          ? snap.docs[snap.docs.length - 1]
          : lastDocRef.current
      setHasMore(snap.docs.length === pageSize)

      const last = snap.docs[snap.docs.length - 1]
      const cacheState = getCacheState()
      const lastCreatedAt =
        (last?.get?.('createdAt')?.toMillis?.() as number | undefined) ??
        cacheState.scopes[scope].cursor.lastCreatedAt ??
        null
      getCacheState().appendScopeData(scope, data, {
        lastCreatedAt,
        lastId: last?.id ?? cacheState.scopes[scope].cursor.lastId ?? null,
      })
    } finally {
      setLoadingMore(false)
    }
  }, [
    fetchToken,
    hasMore,
    loadingMore,
    options.filterUnread,
    pageSize,
    getCacheState,
  ])

  useEffect(() => {
    load()
    return () => {
      unsubRef.current?.()
    }
  }, [load])

  const markAsRead = useCallback(
    async (id: string) => {
      if (!id) return
      try {
        const token = tokenRef.current ?? (await fetchToken())
        if (!token) return

        const firestoreDb = requireDb()
        const ref = doc(
          firestoreDb,
          'device_tokens',
          token,
          'notifications',
          id
        )

        await updateDoc(ref, { is_read: true })
        setItems((prev) =>
          prev.map((x) => (x.id === id ? { ...x, read: true } : x))
        )
        const scope: NotificationScope = options.filterUnread ? 'unread' : 'all'
        getCacheState().updateItem(scope, id, { read: true })
      } catch (e) {
        console.error('[useFetchNotification] markAsRead error', e)
      }
    },
    [fetchToken, options.filterUnread, getCacheState]
  )

  const markAllAsRead = useCallback(async () => {
    try {
      const token = tokenRef.current ?? (await fetchToken())
      if (!token) return

      const firestoreDb = requireDb()
      const current = items.filter((x) => !x.read)

      await Promise.all(
        current.map((x) =>
          updateDoc(
            doc(firestoreDb, 'device_tokens', token, 'notifications', x.id),
            {
              is_read: true,
            }
          )
        )
      )
      setItems((prev) => prev.map((x) => ({ ...x, read: true })))
    } catch (e) {
      console.error('[useFetchNotification] markAllAsRead error', e)
    }
  }, [items, fetchToken])

  const deleteNotification = useCallback(
    async (id: string) => {
      if (!id) return
      try {
        const token = tokenRef.current ?? (await fetchToken())
        if (!token) return

        const firestoreDb = requireDb()
        const ref = doc(
          firestoreDb,
          'device_tokens',
          token,
          'notifications',
          id
        )
        await deleteDoc(ref)

        setItems((prev) => prev.filter((x) => x.id !== id))
        const scope: NotificationScope = options.filterUnread ? 'unread' : 'all'
        getCacheState().removeItem(scope, id)
      } catch (e) {
        console.error('[useFetchNotification] deleteNotification error', e)
        throw e
      }
    },
    [fetchToken, options.filterUnread, getCacheState]
  )

  const deleteAllNotifications = useCallback(async () => {
    try {
      const token = tokenRef.current ?? (await fetchToken())
      if (!token) return

      const firestoreDb = requireDb()
      const notificationsRef = collection(
        firestoreDb,
        'device_tokens',
        token,
        'notifications'
      )

      // 현재 탭에 따라 필터링
      let q
      if (options.filterUnread) {
        // 안 읽음 탭: 안 읽은 알림만 삭제
        q = query(notificationsRef, where('is_read', '==', false))
      } else {
        // 전체 탭: 모든 알림 삭제
        q = query(notificationsRef)
      }

      const snapshot = await getDocs(q)
      const deletePromises = snapshot.docs.map((docSnapshot) =>
        deleteDoc(docSnapshot.ref)
      )

      await Promise.all(deletePromises)

      // 상태 업데이트
      if (options.filterUnread) {
        setItems((prev) => prev.filter((x) => x.read))
      } else {
        setItems([])
      }

      // 캐시 업데이트
      const scope: NotificationScope = options.filterUnread ? 'unread' : 'all'
      if (options.filterUnread) {
        // 안 읽은 항목만 캐시에서 제거
        items.forEach((item) => {
          if (!item.read) {
            getCacheState().removeItem(scope, item.id)
          }
        })
      } else {
        // 전체 캐시 클리어
        getCacheState().clearScope(scope)
      }
    } catch (e) {
      console.error('[useFetchNotification] deleteAllNotifications error', e)
      throw e
    }
  }, [fetchToken, options.filterUnread, items, getCacheState])

  const unreadCount = useMemo(
    () => items.filter((x) => !x.read).length,
    [items]
  )

  return {
    items,
    loading,
    error,
    unreadCount,
    reload: load,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    loadMore,
    hasMore,
    loadingMore,
  }
}

export default useFetchNotification
