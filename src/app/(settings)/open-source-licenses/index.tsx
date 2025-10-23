import React, { useState } from 'react'

import { ScrollView, View, Text, TouchableOpacity } from 'react-native'

import SettingDetailHeader from '@/components/layout/SettingDetailHeader/SettingDetailHeader'
import InAppBrowser from '@/components/ui/InAppBrowser/InAppBrowser'

const licenses = [
  {
    name: 'React Native',
    license: 'MIT License',
    description: 'A framework for building native apps using React',
    licenseUrl: 'https://github.com/facebook/react-native/blob/main/LICENSE',
  },
  {
    name: 'Expo',
    license: 'MIT License',
    description: 'An open-source platform for making universal native apps',
    licenseUrl: 'https://github.com/expo/expo/blob/main/LICENSE',
  },
  {
    name: 'React Navigation',
    license: 'MIT License',
    description: 'Routing and navigation for React Native apps',
    licenseUrl:
      'https://github.com/react-navigation/react-navigation/blob/main/LICENSE',
  },
  {
    name: 'Firebase',
    license: 'Apache License 2.0',
    description: "Google's mobile platform for app development",
    licenseUrl:
      'https://github.com/firebase/firebase-ios-sdk/blob/master/LICENSE',
  },
  {
    name: 'AsyncStorage',
    license: 'MIT License',
    description: 'An unencrypted, asynchronous, key-value storage system',
    licenseUrl:
      'https://github.com/react-native-async-storage/async-storage/blob/master/LICENSE',
  },
  {
    name: 'React Native Safe Area Context',
    license: 'MIT License',
    description: 'A flexible way to handle safe area insets in React Native',
    licenseUrl:
      'https://github.com/th3rdwave/react-native-safe-area-context/blob/main/LICENSE',
  },
  {
    name: 'React Native Vector Icons',
    license: 'MIT License',
    description: 'Customizable icons for React Native',
    licenseUrl:
      'https://github.com/oblador/react-native-vector-icons/blob/master/LICENSE',
  },
  {
    name: 'React Query (TanStack Query)',
    license: 'MIT License',
    description: 'Powerful data synchronization for React',
    licenseUrl: 'https://github.com/TanStack/query/blob/main/LICENSE',
  },
  {
    name: 'Zustand',
    license: 'MIT License',
    description:
      'A small, fast and scalable bearbones state-management solution',
    licenseUrl: 'https://github.com/pmndrs/zustand/blob/main/LICENSE',
  },
  {
    name: 'Tailwind CSS',
    license: 'MIT License',
    description: 'A utility-first CSS framework',
    licenseUrl:
      'https://github.com/tailwindlabs/tailwindcss/blob/master/LICENSE',
  },
  {
    name: 'NativeWind',
    license: 'MIT License',
    description: 'React Native utility-first universal design system',
    licenseUrl: 'https://github.com/nativewind/nativewind/blob/master/LICENSE',
  },
  {
    name: 'React Native Reanimated',
    license: 'MIT License',
    description: "React Native's animation library",
    licenseUrl:
      'https://github.com/software-mansion/react-native-reanimated/blob/master/LICENSE',
  },
]

export default function OpenSourceLicensesScreen() {
  const [browserVisible, setBrowserVisible] = useState(false)
  const [browserUrl, setBrowserUrl] = useState<string | null>(null)

  const handleLicenseClick = (url: string) => {
    setBrowserUrl(url)
    setBrowserVisible(true)
  }

  const handleCloseBrowser = () => {
    setBrowserVisible(false)
    setBrowserUrl(null)
  }

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
              <TouchableOpacity
                onPress={() => handleLicenseClick(license.licenseUrl)}
                className="self-start"
              >
                <Text className="text-xs text-blue-600 underline">
                  라이선스 전문 보기
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <InAppBrowser
        visible={browserVisible}
        url={browserUrl}
        onClose={handleCloseBrowser}
      />
    </View>
  )
}
