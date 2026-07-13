import { useRef, useState } from 'react'

import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import * as WebBrowser from 'expo-web-browser'
import {
  collection,
  doc,
  getDocs,
  increment,
  limit,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { Text, View } from 'react-native'
import Swipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable'

import InAppBrowser from '@/components/ui/InAppBrowser/InAppBrowser'
import PressableScale from '@/components/ui/PressableScale/PressableScale'
import RightSwipeActions from '@/components/ui/RightSwipeActions/RightSwipeActions'
import { requireDb } from '@/config/firebaseConfig'
import { COLORS } from '@/constants/colors'
import { Scrap, useScrapStore } from '@/store/scrapStore'
import { getFormattedDate } from '@/utils/dateUtils'
import { getDepartmentStyles } from '@/utils/departmentStyles'
import { showInfoToast, showSuccessToast } from '@/utils/toastUtils'

// 개별 스크랩 아이템 컴포넌트
export const ScrapItem = ({ scrap }: { scrap: Scrap }) => {
  const { removeScrap, addScrap } = useScrapStore()
  const departmentStyle = getDepartmentStyles(scrap.notice.department)
  const swipeableRef = useRef<SwipeableMethods>(null)

  // 인앱 브라우저 상태
  const [browserVisible, setBrowserVisible] = useState(false)
  const [browserUrl, setBrowserUrl] = useState<string | null>(null)

  // 스크랩 삭제 핸들러
  const handleRemoveScrap = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

    // 낙관적 UI: 로컬(Zustand)에서 먼저 삭제
    removeScrap(scrap)
    swipeableRef.current?.close()

    try {
      // 서버: Firestore의 scrap_count -1 업데이트 시도
      const firestoreDb = requireDb()

      // content_hash로 문서 찾기
      const noticesRef = collection(firestoreDb, 'notices')
      const q = query(
        noticesRef,
        where('content_hash', '==', scrap.notice.content_hash),
        limit(1)
      )
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        // 문서가 없으면 생성 (스크랩 삭제이므로 0으로 설정)
        const newDocRef = doc(noticesRef)
        await setDoc(newDocRef, {
          content_hash: scrap.notice.content_hash,
          scrap_count: 0,
        })
      } else {
        // 문서가 있으면 업데이트
        const docSnapshot = querySnapshot.docs[0]
        await updateDoc(docSnapshot.ref, {
          scrap_count: increment(-1),
        })
      }
      showSuccessToast('내 스크랩에서 삭제했어요')
    } catch (error) {
      // 롤백: 서버 업데이트 실패 시 로컬 상태 되돌리기
      console.error('스크랩 삭제 실패 (서버):', error)
      addScrap(scrap) // 삭제했던 스크랩을 다시 추가
      showInfoToast(
        '내 스크랩에서 삭제하지 못했어요',
        '일시적인 오류예요. 잠시 후 다시 시도해주세요.'
      )
    }
  }
  // 스와이프 활성화 시 햅틱 피드백
  const handleSwipeableWillOpen = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  // 링크 열기
  const handleOpenLink = () => {
    if (!scrap.notice.link) return

    // 도서관 사이트는 외부 브라우저로 바로 열기 (SSL 이슈)
    if (scrap.notice.link.includes('lib.deu.ac.kr')) {
      WebBrowser.openBrowserAsync(scrap.notice.link)
      return
    }

    // 나머지는 InApp 브라우저
    setBrowserUrl(scrap.notice.link)
    setBrowserVisible(true)
  }

  return (
    <>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={() => (
          <RightSwipeActions onPress={handleRemoveScrap} isScraped={true} />
        )}
        onSwipeableWillOpen={handleSwipeableWillOpen}
        containerStyle={{
          marginBottom: 12,
        }}
        overshootLeft={false}
        overshootRight={false}
      >
        <PressableScale
          className="ml-4 min-h-[105px] rounded-l-card bg-surface p-4"
          onPress={handleOpenLink}
        >
          <View className="flex-1 justify-between gap-3">
            <View className="flex-row items-start justify-between">
              <Text
                className="flex-1 pr-2 text-[15px] font-semibold leading-snug text-text-primary"
                numberOfLines={2}
              >
                {scrap.notice.title}
              </Text>
              <Ionicons name="bookmark" size={20} color={COLORS.primary} />
            </View>

            <View className="flex-row items-center justify-between gap-3">
              <View className="flex-1 flex-row items-center gap-1.5">
                <View
                  className={`rounded-badge px-2.5 py-1 ${departmentStyle.bg}`}
                >
                  <Text
                    className={`text-xs font-semibold ${departmentStyle.text}`}
                  >
                    {scrap.notice.department}
                  </Text>
                </View>

                <View className="flex-1 flex-row flex-wrap gap-1.5">
                  {scrap.notice.tags.slice(0, 2).map((tag) => (
                    <View key={tag} className="rounded-badge bg-bg px-2 py-1">
                      <Text className="text-xs font-medium text-text-secondary">
                        #{tag}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <Text className="text-xs font-normal text-text-tertiary">
                {getFormattedDate(scrap.notice.saved_at)}
              </Text>
            </View>
          </View>
        </PressableScale>
      </Swipeable>

      <InAppBrowser
        visible={browserVisible}
        url={browserUrl}
        onClose={() => setBrowserVisible(false)}
      />
    </>
  )
}
