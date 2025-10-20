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
} from 'firebase/firestore'

import { db } from '@/config/firebaseConfig'
import { usePushNotifications } from '@/hooks/usePushNotifications'
import {
  PushNotificationDoc,
  PushNotificationItem,
} from '@/types/notification.type'

type UseFetchNotificationOptions = {
  pageSize?: number
  realtime?: boolean
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
    read: docData.read ?? docData.is_read ?? false,
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

  const tokenRef = useRef<string | null>(null)
  const unsubRef = useRef<Unsubscribe | null>(null)

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
        setLoading(false)
        return
      }

      const col = collection(db, 'device_tokens', token, 'notifications')
      const q = query(col, limit(pageSize))

      const snap = await getDocs(q)
      const data: PushNotificationItem[] = snap.docs.map((d) =>
        toItem({ id: d.id, ...(d.data() as Omit<PushNotificationDoc, 'id'>) })
      )
      // 최신순 정렬 (클라이언트 사이드)
      const sorted = data.sort((a, b) => b.createdAtMs - a.createdAtMs)

      setItems(sorted)

      if (enableRealtime) {
        unsubRef.current?.()
        unsubRef.current = onSnapshot(q, (ss) => {
          const next = ss.docs.map((d) =>
            toItem({
              id: d.id,
              ...(d.data() as Omit<PushNotificationDoc, 'id'>),
            })
          )
          const sortedRealtime = next.sort(
            (a, b) => b.createdAtMs - a.createdAtMs
          )
          setItems(sortedRealtime)
        })
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e)
      setError(message || '알림을 불러오지 못했어요')
    } finally {
      setLoading(false)
    }
  }, [enableRealtime, fetchToken, pageSize])

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

        const ref = doc(db, 'device_tokens', token, 'notifications', id)

        await updateDoc(ref, { read: true, is_read: true })
        setItems((prev) =>
          prev.map((x) => (x.id === id ? { ...x, read: true } : x))
        )
      } catch (e) {
        console.error('[useFetchNotification] markAsRead error', e)
      }
    },
    [fetchToken]
  )

  const markAllAsRead = useCallback(async () => {
    try {
      const token = tokenRef.current ?? (await fetchToken())
      if (!token) return

      const current = items.filter((x) => !x.read)

      await Promise.all(
        current.map((x) =>
          updateDoc(doc(db, 'device_tokens', token, 'notifications', x.id), {
            read: true,
            is_read: true,
          })
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

        const ref = doc(db, 'device_tokens', token, 'notifications', id)
        await deleteDoc(ref)

        // 로컬 상태에서도 제거
        setItems((prev) => prev.filter((x) => x.id !== id))
      } catch (e) {
        console.error('[useFetchNotification] deleteNotification error', e)
        throw e // 에러를 다시 던져서 UI에서 처리할 수 있도록
      }
    },
    [fetchToken]
  )

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
  }
}

export default useFetchNotification
