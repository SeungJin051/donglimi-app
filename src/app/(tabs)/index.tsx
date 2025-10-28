import React, { useEffect, useMemo, useState } from 'react'

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
import type { Notice } from '@/types/notice.type'
import { homeScrollRef } from '@/utils/scrollRefs'

// FlatList 아이템 타입 정의
type ListItem = { type: 'notice'; data: Notice } | { type: 'ad'; id: string }

export default function HomeScreen() {
  // 스와이프 가이드 표시 상태
  const [showSwipeGuide, setShowSwipeGuide] = useState(false)

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

  // 공지사항 배열에 광고 아이템 삽입
  const listData = useMemo<ListItem[]>(() => {
    const notices = data?.pages.flatMap((page) => page.notices) || []

    const result: ListItem[] = []
    const adInterval = 7 // 7개마다 광고

    notices.forEach((notice, index) => {
      // 광고 삽입: 0번째 또는 adInterval의 배수일 때
      if (index === 0 || index % adInterval === 0) {
        result.push({ type: 'ad', id: `ad-${index}` })
      }

      // 공지사항 삽입
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
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  // 새로고침 함수
  const handleRefresh = () => {
    refetch()
  }

  // 로딩 중일 때 보여줄 화면
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    )
  }

  // 에러가 발생했을 때 보여줄 화면
  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-base text-red-500">
          데이터를 불러오는 중 오류가 발생했습니다.
        </Text>
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
        onEndReachedThreshold={0.8}
        // pull-to-refresh
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
        // 다음 페이지 로딩 중일 때 하단에 로딩 표시
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="items-center py-4">
              <ActivityIndicator size="small" color="#3B82F6" />
            </View>
          ) : null
        }
        // showSwipeGuide가 true일 때만 스와이프 가이드 헤더 표시
        ListHeaderComponent={showSwipeGuide ? <SwipeGuideHeader /> : null}
      />
    </View>
  )
}
