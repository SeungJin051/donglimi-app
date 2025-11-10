import React from 'react'

import { MaterialIcons } from '@expo/vector-icons'
import { Modal, View, Text, TouchableOpacity } from 'react-native'

interface UpdateModalProps {
  visible: boolean
  currentVersion: string
  latestVersion: string
  onUpdate: () => void
  onLater?: () => void
  forceUpdate?: boolean
}

export default function UpdateModal({
  visible,
  latestVersion,
  onUpdate,
  onLater,
  forceUpdate = false,
}: UpdateModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={forceUpdate ? undefined : onLater}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
          {/* 아이콘 */}
          <View className="mb-4 items-center">
            <View className="rounded-full bg-blue-50 p-4">
              <MaterialIcons name="system-update" size={32} color="#3182F6" />
            </View>
          </View>

          {/* 제목 */}
          <Text className="mb-2 text-center text-xl font-bold text-gray-900">
            {forceUpdate
              ? '업데이트가 필요합니다'
              : '새로운 버전이 출시되었습니다'}
          </Text>

          {/* 설명 */}
          <Text className="mb-6 text-center text-base text-gray-600">
            {forceUpdate
              ? `새로운 버전(${latestVersion})으로 업데이트해야\n앱을 계속 사용하실 수 있습니다.`
              : `새로운 버전(${latestVersion})이 출시되었습니다.\n더 나은 서비스를 위해 업데이트해주세요.`}
          </Text>

          {/* 버튼 */}
          <View className="gap-3">
            <TouchableOpacity
              onPress={onUpdate}
              className="rounded-xl bg-blue-600 px-6 py-4 active:bg-blue-700"
            >
              <Text className="text-center text-base font-semibold text-white">
                지금 업데이트하기
              </Text>
            </TouchableOpacity>

            {!forceUpdate && onLater && (
              <TouchableOpacity
                onPress={onLater}
                className="rounded-xl border border-gray-300 bg-white px-6 py-4 active:bg-gray-50"
              >
                <Text className="text-center text-base font-medium text-gray-700">
                  나중에
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  )
}
