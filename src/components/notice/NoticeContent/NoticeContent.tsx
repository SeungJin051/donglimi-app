import { useRef, useMemo, useState, useEffect } from 'react'

import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { doc, increment, updateDoc } from 'firebase/firestore'
import { View, Text, TouchableOpacity } from 'react-native'
import Swipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable'

import InAppBrowser from '@/components/ui/InAppBrowser/InAppBrowser'
import RightSwipeActions from '@/components/ui/RightSwipeActions/RightSwipeActions'
import { db } from '@/config/firebaseConfig'
import { useInternetStatus } from '@/hooks/useInternetStatus'
import { useInterstitialAd } from '@/hooks/useInterstitialAd'
import { useAdStore } from '@/store/adStore'
import { useScrapStore } from '@/store/scrapStore'
import { Notice } from '@/types/notice.type'
import { canShowAd } from '@/utils/adManager'
import { getFormattedDate } from '@/utils/dateUtils'
import { getDepartmentStyles } from '@/utils/departmentStyles'
import { enqueueScrapDelta } from '@/utils/scrapSync'
import { showInfoToast, showSuccessToast } from '@/utils/toastUtils'

interface NoticeContentProps {
  item: Notice
}

export const NoticeContent = ({ item }: NoticeContentProps) => {
  // Firestore 문서 참조
  const docRef = doc(db, 'notices', item.content_hash)

  // 함수를 호출하여 현재 아이템의 부서에 맞는 스타일을 가져옵니다.
  const departmentStyle = getDepartmentStyles(item.department)

  // 스크랩 스토어 호출
  const { scraps, addScrap, removeScrap } = useScrapStore()

  // 인터넷 상태 (훅은 컴포넌트 최상위에서 호출)
  const { isOnline } = useInternetStatus()

  // 광고 관련
  const {
    linkOpenCount,
    todayAdCount,
    incrementLinkCount,
    increaseCount,
    resetIfDateChanged,
  } = useAdStore()
  const { showAd } = useInterstitialAd()

  // 날짜 체크 (마운트 시 1회)
  useEffect(() => {
    resetIfDateChanged()
  }, [resetIfDateChanged])

  // 스와이프 참조
  const swipeableRef = useRef<SwipeableMethods>(null)

  // 인앱 브라우저 상태
  const [browserVisible, setBrowserVisible] = useState(false)
  const [browserUrl, setBrowserUrl] = useState<string | null>(null)

  // 현재 공지가 스크랩되어 있는지 확인
  const isScraped = useMemo(() => {
    return scraps.some((s) => s.notice.content_hash === item.content_hash)
  }, [scraps, item.content_hash])

  // 스크랩 추가 핸들러
  const handleAddScrap = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

    // 로컬 상태를 먼저 업데이트 (낙관적 UI)
    addScrap({ notice: item })
    swipeableRef.current?.close()

    try {
      if (isOnline === false) {
        await enqueueScrapDelta(item.content_hash, 1)
        showSuccessToast('내 스크랩에 추가했어요')
        return
      }
      // 서버에 업데이트 시도
      await updateDoc(docRef, {
        scrap_count: increment(1),
      })
      showSuccessToast('내 스크랩에 추가했어요')
    } catch (error) {
      // 서버 업데이트 실패!
      console.error('스크랩 추가 실패:', error)

      // 롤백 로컬에서 다시 스크랩을 제거합니다.
      removeScrap({ notice: item })
      showInfoToast(
        '스크랩을 추가하지 못했어요',
        '일시적인 오류예요. 잠시 후 다시 시도해주세요.'
      )
    }
  }

  // 스크랩 삭제 핸들러
  const handleRemoveScrap = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

    // 로컬 상태 먼저 업데이트
    removeScrap({ notice: item })
    swipeableRef.current?.close()

    try {
      if (isOnline === false) {
        await enqueueScrapDelta(item.content_hash, -1)
        showSuccessToast('내 스크랩에서 삭제했어요')
        return
      }
      // 서버에 업데이트 시도
      await updateDoc(docRef, {
        scrap_count: increment(-1),
      })
      showSuccessToast('내 스크랩에서 삭제했어요')
    } catch (error) {
      // 서버 업데이트 실패 시 롤백
      console.error('스크랩 삭제 실패:', error)

      // 롤백 로컬에 다시 스크랩을 추가합니다.
      addScrap({ notice: item })
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

  // 공지 링크 열기
  const handleOpenLink = () => {
    if (item.link) {
      setBrowserUrl(item.link)
      setBrowserVisible(true)
      // 링크 열람 카운트 증가
      incrementLinkCount()
    }
  }

  // 브라우저 닫기 핸들러 (광고 로직 포함)
  const handleBrowserClose = () => {
    setBrowserVisible(false)

    // 광고 노출 판단 (현재 링크 카운트 기준)
    const shouldShow = canShowAd({
      viewedCount: linkOpenCount,
      todayCount: todayAdCount,
    })

    if (shouldShow) {
      // UX 딜레이 (500ms)
      setTimeout(() => {
        showAd()
        increaseCount() // 영구 저장
      }, 500)
    }
  }

  return (
    <>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={() => (
          <RightSwipeActions
            onPress={isScraped ? handleRemoveScrap : handleAddScrap}
            isScraped={isScraped}
          />
        )}
        onSwipeableWillOpen={handleSwipeableWillOpen}
        containerStyle={{
          marginBottom: 10,
        }}
        overshootLeft={false}
        overshootRight={false}
      >
        <TouchableOpacity
          className="ml-4 mr-0 min-h-[105px] rounded-l-lg border-b border-l border-t border-gray-200 bg-white p-5 pr-4"
          onPress={handleOpenLink}
          activeOpacity={0.7}
        >
          <View className="flex-1 justify-between">
            <View className="flex-row items-start justify-between">
              <Text
                className="flex-1 pr-2 text-base font-medium leading-snug text-gray-900"
                numberOfLines={2}
              >
                {item.title}
              </Text>
              {isScraped && (
                <Ionicons name="bookmark" size={20} color="#0158a6" />
              )}
            </View>

            <View className="flex-row items-center justify-between gap-3">
              <View className="flex-1 flex-row items-center gap-2">
                <View
                  className={`rounded-md px-2.5 py-1 ${departmentStyle.bg}`}
                >
                  <Text
                    className={`text-xs font-medium ${departmentStyle.text}`}
                  >
                    {item.department}
                  </Text>
                </View>

                <View className="flex-1 flex-row flex-wrap gap-1.5">
                  {item.tags.slice(0, 2).map((tag) => (
                    <View
                      key={tag}
                      className="rounded-md bg-gray-100 px-2 py-1"
                    >
                      <Text className="text-xs font-medium text-gray-600">
                        #{tag}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
              <Text className="text-xs font-normal text-gray-500">
                {getFormattedDate(item.saved_at)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>

      <InAppBrowser
        visible={browserVisible}
        url={browserUrl}
        onClose={handleBrowserClose}
      />
    </>
  )
}
