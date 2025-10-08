import { Text, View, FlatList, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { NoticeItem } from '@/components/notice/NoticeItem/NoticeItem'
import { useFetchNotices } from '@/hooks/useFetchNotices'

export default function HomeScreen() {
  // 훅을 호출하여 데이터, 로딩 상태, 에러 상태를 가져옵니다.
  const { data: notices, isLoading, error } = useFetchNotices()

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
    <View className="flex-1 bg-white">
      <FlatList
        data={notices}
        renderItem={({ item }) => <NoticeItem item={item} />}
        keyExtractor={(item) => item.content_hash}
        // 데이터가 없을 때 표시될 컴포넌트
        ListEmptyComponent={
          <View className="mt-20 flex-1 items-center justify-center">
            <Text className="text-gray-500">표시할 공지사항이 없습니다.</Text>
          </View>
        }
      />
    </View>
  )
}
