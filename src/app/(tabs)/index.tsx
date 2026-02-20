import React, { useEffect, useMemo, useRef, useState } from 'react'

import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { CenterAdCard } from '@/components/notice/CenterAdCard/CenterAdCard'
import { NoticeContent } from '@/components/notice/NoticeContent/NoticeContent'
import SwipeGuideHeader from '@/components/ui/SwipeGuideHeader/SwipeGuideHeader'
import { useFetchNotices } from '@/hooks/useFetchNotices'
import { useInternetStatus } from '@/hooks/useInternetStatus'
import { useNetworkGuard } from '@/hooks/useNetworkGuard'
import type { Notice } from '@/types/notice.type'
import { homeScrollRef } from '@/utils/scrollRefs'
import { showSuccessToast, showInfoToast } from '@/utils/toastUtils'

// FlatList 아이템 타입 정의
type ListItem = { type: 'notice'; data: Notice } | { type: 'ad'; id: string }

export default function HomeScreen() {
  // 스와이프 가이드 표시 상태
  const [showSwipeGuide, setShowSwipeGuide] = useState(false)

  // 새로고침 피드백을 위한 이전 데이터 개수 추적
  const previousNoticesCountRef = useRef<number>(0)
  const shouldShowFeedbackRef = useRef<boolean>(false)

  // 무한스크롤 훅을 호출하여 데이터, 로딩 상태, 에러 상태를 가져옵니다.
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useFetchNotices()

  // 네트워크 상태
  const { isOnline } = useInternetStatus()
  const { guardAsync } = useNetworkGuard()
  const [showOfflineSnippet, setShowOfflineSnippet] = useState(false)
  const snippetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 공지사항 배열에 광고 아이템 삽입
  const listData = useMemo<ListItem[]>(() => {
    if (!data?.pages) return []

    // 모든 페이지의 공지사항을 합치고 중복 제거
    const allNotices = data.pages.flatMap((page) => page.notices)
    const seen = new Set<string>()
    const uniqueNotices = allNotices.filter((notice) => {
      if (seen.has(notice.content_hash)) {
        return false
      }
      seen.add(notice.content_hash)
      return true
    })

    // 광고 삽입
    const result: ListItem[] = []
    const adInterval = 5
    let adCount = 0

    uniqueNotices.forEach((notice, index) => {
      if (index !== 0 && index % adInterval === 0) {
        adCount += 1
        result.push({ type: 'ad', id: `ad-${adCount}` })
      }
      result.push({ type: 'notice', data: notice })
    })

    return result
  }, [data])

  // AsyncStorage에서 스와이프 가이드 확인 여부 체크
  useEffect(() => {
    const checkSwipeGuideStatus = async () => {
      try {
        const hasSeenSwipeGuide =
          await AsyncStorage.getItem('hasSeenSwipeGuide')

        // hasSeenSwipeGuide가 null이면 (처음 본 사용자) 가이드 표시
        if (hasSeenSwipeGuide === null) {
          setShowSwipeGuide(true)

          // 가이드를 본 것으로 표시
          await AsyncStorage.setItem('hasSeenSwipeGuide', 'true')
        } else {
          setShowSwipeGuide(false)
        }
      } catch (error) {
        console.error('스와이프 가이드 상태 확인 중 오류:', error)
      }
    }

    checkSwipeGuideStatus()
  }, [])

  // 다음 페이지 로드 함수
  const handleLoadMore = () => {
    if (!hasNextPage || isFetchingNextPage) return
    if (isOnline === false) {
      if (snippetTimerRef.current) clearTimeout(snippetTimerRef.current)
      setShowOfflineSnippet(true)
      snippetTimerRef.current = setTimeout(() => {
        setShowOfflineSnippet(false)
      }, 1000)
      return
    }
    fetchNextPage()
  }

  // 새로고침 완료 감지 (isRefetching이 false로 변경될 때)
  useEffect(() => {
    if (!isRefetching && shouldShowFeedbackRef.current) {
      shouldShowFeedbackRef.current = false

      // 약간의 딜레이를 두고 피드백 표시 (데이터 업데이트 대기)
      setTimeout(() => {
        const previousCount = previousNoticesCountRef.current
        const newCount = data?.pages.flatMap((page) => page.notices).length || 0

        // 항상 피드백 표시
        if (newCount > previousCount) {
          // 새로운 데이터가 있으면
          showSuccessToast('새로운 공지사항이 업데이트되었어요')
        } else if (newCount === previousCount && previousCount > 0) {
          // 데이터 개수가 같고 데이터가 있으면
          showInfoToast('최신 정보입니다')
        } else {
          // 데이터가 없어도 피드백 표시
          showInfoToast('새로고침 완료')
        }
      }, 500)
    }
  }, [isRefetching, data])

  // 새로고침 함수
  const handleRefresh = guardAsync(async () => {
    // 새로고침 시작 전 데이터 개수 저장
    const currentCount = data?.pages.flatMap((page) => page.notices).length || 0
    previousNoticesCountRef.current = currentCount
    shouldShowFeedbackRef.current = true

    try {
      await refetch()
    } catch (error) {
      console.error('새로고침 실패:', error)
      shouldShowFeedbackRef.current = false
    }
  })

  const handleRetry = guardAsync(async () => {
    await refetch()
  })

  // 로딩 중일 때 보여줄 화면
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    )
  }

  // 에러가 발생했을 때 보여줄 화면
  if (error && (!data || data.pages.length === 0)) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white px-8">
        <Ionicons name="cloud-offline" size={48} color="#EF4444" />
        <Text className="mt-4 text-lg font-semibold text-gray-900">
          데이터를 불러올 수 없어요
        </Text>
        <Text className="mt-1 text-center text-sm text-gray-500">
          연결 상태를 확인한 뒤 다시 시도해 주세요.
        </Text>
        <View className="mt-6 w-full items-center">
          <View className="w-full max-w-[240px]">
            <Text
              onPress={handleRetry}
              className="rounded-lg bg-deu-light-blue px-4 py-3 text-center text-white"
            >
              다시 시도
            </Text>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  // 데이터 로딩이 완료되었을 때 공지사항 목록을 보여줍니다.
  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        ref={homeScrollRef}
        data={listData}
        renderItem={({ item }) => {
          if (item.type === 'ad') {
            return <CenterAdCard />
          }
          return <NoticeContent item={item.data} />
        }}
        keyExtractor={(item) =>
          item.type === 'ad' ? item.id : item.data.content_hash
        }
        // 데이터가 없을 때 표시될 컴포넌트
        ListEmptyComponent={
          <View className="mt-20 flex-1 items-center justify-center">
            <Text className="text-gray-500">표시할 공지사항이 없습니다.</Text>
          </View>
        }
        // 리스트 끝에서 화면 높이의 80% 지점에서 다음 페이지 로드
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        windowSize={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={true}
        // pull-to-refresh
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
            progressViewOffset={showSwipeGuide ? 60 : 0}
            title={isRefetching ? '새로고침 중...' : undefined}
            titleColor="#6B7280"
          />
        }
        // 다음 페이지 로딩 중일 때 하단에 로딩 표시
        ListFooterComponent={
          isFetchingNextPage || showOfflineSnippet ? (
            <View className="items-center py-4">
              {isFetchingNextPage ? (
                <ActivityIndicator size="small" color="#3B82F6" />
              ) : (
                <View className="w-full px-4">
                  <View className="mb-3 h-24 w-full rounded-lg bg-gray-200" />
                  <View className="mb-3 h-24 w-full rounded-lg bg-gray-200" />
                  <View className="mb-3 h-24 w-full rounded-lg bg-gray-200" />
                </View>
              )}
            </View>
          ) : null
        }
        // showSwipeGuide가 true일 때만 스와이프 가이드 헤더 표시
        ListHeaderComponent={showSwipeGuide ? <SwipeGuideHeader /> : null}
      />
    </View>
  )
}
