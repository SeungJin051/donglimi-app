import AsyncStorage from '@react-native-async-storage/async-storage'
import { doc, increment, updateDoc } from 'firebase/firestore'

import { db } from '@/config/firebaseConfig'

const STORAGE_KEY = 'pendingScrapIncrements'

type PendingOp = {
  id: string // notice content_hash
  delta: 1 | -1
}

async function readQueue(): Promise<PendingOp[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as PendingOp[]) : []
  } catch {
    return []
  }
}

async function writeQueue(queue: PendingOp[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(queue))
}

export async function enqueueScrapDelta(id: string, delta: 1 | -1) {
  const queue = await readQueue()
  queue.push({ id, delta })
  await writeQueue(queue)
}

export async function flushScrapQueue(): Promise<void> {
  const queue = await readQueue()
  if (queue.length === 0) return

  // 병합: 같은 id에 대한 다중 연산을 합산하여 최소 호출
  const merged = new Map<string, number>()
  for (const { id, delta } of queue) {
    merged.set(id, (merged.get(id) ?? 0) + delta)
  }

  // 적용
  for (const [id, totalDelta] of merged.entries()) {
    if (!totalDelta) continue
    try {
      const ref = doc(db, 'notices', id)
      await updateDoc(ref, { scrap_count: increment(totalDelta) })
    } catch (e) {
      // 실패 시 남겨두기 위해 조기 종료
      return
    }
  }

  // 모두 성공한 경우에만 큐 제거
  await writeQueue([])
}
