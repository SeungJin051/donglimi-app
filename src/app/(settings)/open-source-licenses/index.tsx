import { ScrollView, View, Text } from 'react-native'

import SettingDetailHeader from '@/components/layout/SettingDetailHeader/SettingDetailHeader'

const licenses = [
  {
    name: 'React Native',
    license: 'MIT License',
    description: 'A framework for building native apps using React',
  },
  {
    name: 'Expo',
    license: 'MIT License',
    description: 'An open-source platform for making universal native apps',
  },
  {
    name: 'React Navigation',
    license: 'MIT License',
    description: 'Routing and navigation for React Native apps',
  },
  {
    name: 'Firebase',
    license: 'Apache License 2.0',
    description: "Google's mobile platform for app development",
  },
  {
    name: 'AsyncStorage',
    license: 'MIT License',
    description: 'An unencrypted, asynchronous, key-value storage system',
  },
  {
    name: 'React Native Safe Area Context',
    license: 'MIT License',
    description: 'A flexible way to handle safe area insets in React Native',
  },
  {
    name: 'React Native Vector Icons',
    license: 'MIT License',
    description: 'Customizable icons for React Native',
  },
  {
    name: 'React Query (TanStack Query)',
    license: 'MIT License',
    description: 'Powerful data synchronization for React',
  },
  {
    name: 'Zustand',
    license: 'MIT License',
    description:
      'A small, fast and scalable bearbones state-management solution',
  },
  {
    name: 'Tailwind CSS',
    license: 'MIT License',
    description: 'A utility-first CSS framework',
  },
  {
    name: 'NativeWind',
    license: 'MIT License',
    description: 'React Native utility-first universal design system',
  },
  {
    name: 'React Native Reanimated',
    license: 'MIT License',
    description: "React Native's animation library",
  },
]

export default function OpenSourceLicensesScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <SettingDetailHeader title="오픈소스 라이선스" />

      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-xl border border-gray-200 bg-white p-6">
          <Text className="mb-6 text-base leading-6 text-gray-700">
            동림이 앱은 다음과 같은 오픈소스 라이브러리를 사용합니다.
          </Text>

          {licenses.map((license, index) => (
            <View
              key={index}
              className={`mb-4 rounded-xl border border-gray-200 bg-gray-50 p-4 ${
                index === licenses.length - 1 ? '' : 'border-b border-gray-200'
              }`}
            >
              <View className="mb-2">
                <Text className="text-base font-semibold text-gray-900">
                  {license.name}
                </Text>
                <Text className="mt-1 text-sm text-blue-600">
                  {license.license}
                </Text>
              </View>
              <Text className="mb-2 text-sm text-gray-600">
                {license.description}
              </Text>
              <Text className="text-xs text-gray-500">라이선스 전문 보기</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}
