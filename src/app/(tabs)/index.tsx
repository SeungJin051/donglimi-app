import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { NoticeContent } from '@/components/notice/NoticeContent/NoticeContent'
import { useFetchNotices } from '@/hooks/useFetchNotices'

export default function HomeScreen() {
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

  // 모든 페이지의 데이터를 평탄화하여 하나의 배열로 만듦
  const notices = data?.pages.flatMap((page) => page.notices) || []

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
        data={notices}
        renderItem={({ item }) => <NoticeContent item={item} />}
        keyExtractor={(item) => item.content_hash}
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
      />
    </View>
  )
}
