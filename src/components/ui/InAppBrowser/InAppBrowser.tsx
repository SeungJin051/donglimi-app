import React, { useState, useRef, useCallback } from 'react'

import { Ionicons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import * as Haptics from 'expo-haptics'
import * as WebBrowser from 'expo-web-browser'
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
  Share,
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'

interface InAppBrowserProps {
  visible: boolean
  url: string | null
  onClose: () => void
}

export default function InAppBrowser({
  visible,
  url,
  onClose,
}: InAppBrowserProps) {
  const insets = useSafeAreaInsets()
  const webViewRef = useRef<WebView>(null)
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)
  const [pageTitle, setPageTitle] = useState('')
  const [showActionSheet, setShowActionSheet] = useState(false)

  // 스크롤 관련 상태
  const scrollY = useRef(0)
  const footerTranslateY = useRef(new Animated.Value(0)).current
  const lastScrollY = useRef(0)

  // 액션 시트
  const handleOpenActionSheet = useCallback(() => {
    setShowActionSheet(true)
  }, [])

  // 호스트 이름
  const getHostname = useCallback(() => {
    if (!url) return '웹페이지'
    try {
      return new URL(url).hostname
    } catch {
      return '웹페이지'
    }
  }, [url])

  // 뒤로가기
  const handleGoBack = useCallback(() => {
    if (canGoBack && webViewRef.current) webViewRef.current.goBack()
  }, [canGoBack])

  // 앞으로가기
  const handleGoForward = useCallback(() => {
    if (canGoForward && webViewRef.current) webViewRef.current.goForward()
  }, [canGoForward])

  // 새로고침
  const handleReload = useCallback(() => {
    webViewRef.current?.reload()
  }, [])

  // 링크 복사
  const handleCopyLink = useCallback(async () => {
    if (!url) return
    try {
      await Clipboard.setStringAsync(url)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      Alert.alert('링크 복사 완료', '클립보드에 복사되었습니다.')
      setShowActionSheet(false)
    } catch {
      Alert.alert('오류', '링크 복사에 실패했습니다.')
    }
  }, [url])

  // 외부 브라우저
  const handleOpenInBrowser = useCallback(async () => {
    if (!url) return
    try {
      await WebBrowser.openBrowserAsync(url)
      setShowActionSheet(false)
    } catch {
      Alert.alert('오류', '브라우저를 열 수 없습니다.')
    }
  }, [url])

  // 공유
  const handleShare = useCallback(async () => {
    await Share.share({
      message: pageTitle,
      url: url as string,
    })
  }, [url, pageTitle])

  // 파일 다운로드 처리
  const handleFileDownload = useCallback(
    ({ nativeEvent }: { nativeEvent: { downloadUrl: string } }) => {
      const downloadUrl = nativeEvent.downloadUrl
      if (downloadUrl) {
        WebBrowser.openBrowserAsync(downloadUrl)
      }
    },
    []
  )

  // 스크롤 메시지
  const handleMessage = useCallback(
    (event: { nativeEvent: { data: string } }) => {
      try {
        const data = JSON.parse(event.nativeEvent.data)
        if (data.type === 'scroll') {
          const currentScrollY = data.scrollY
          const scrollDiff = currentScrollY - lastScrollY.current
          if (Math.abs(scrollDiff) > 10) {
            if (scrollDiff > 0 && currentScrollY > 150) {
              Animated.timing(footerTranslateY, {
                toValue: 100,
                duration: 200,
                useNativeDriver: true,
              }).start()
            } else if (scrollDiff < 0) {
              Animated.timing(footerTranslateY, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
              }).start()
            }
            lastScrollY.current = currentScrollY
          }
          scrollY.current = currentScrollY
        }
      } catch {}
    },
    [footerTranslateY]
  )

  // WebView에 주입할 JS
  const injectedJavaScript = `
    let lastScrollY = 0;
    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          const scrollY = window.pageYOffset || document.documentElement.scrollTop;
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'scroll', scrollY }));
          ticking = false;
        });
        ticking = true;
      }
    });
    true;
  `

  if (!url) return null

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="fullScreen"
    >
      <SafeAreaView
        className="flex-1 bg-white"
        edges={['top', 'left', 'right']}
      >
        {/* 헤더 */}
        <View className="border-b border-gray-100 bg-white px-4 pb-3">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              className="flex-1 pr-3"
              onPress={handleOpenActionSheet}
            >
              <Text
                className="text-lg font-bold leading-tight text-gray-900"
                numberOfLines={1}
              >
                {pageTitle || getHostname()}
              </Text>
              <Text className="mt-1 text-xs text-gray-400" numberOfLines={1}>
                {getHostname()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              className="ml-2 items-center justify-center"
            >
              <Ionicons name="close" size={30} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 웹뷰 */}
        <View className="flex-1">
          <WebView
            ref={webViewRef}
            source={{ uri: url }}
            style={{ flex: 1 }}
            javaScriptEnabled
            domStorageEnabled
            allowFileAccess
            mixedContentMode="compatibility"
            originWhitelist={['*']}
            onFileDownload={handleFileDownload}
            onNavigationStateChange={(navState) => {
              setCanGoBack(navState.canGoBack)
              setCanGoForward(navState.canGoForward)
              setPageTitle(navState.title || '')
            }}
            onMessage={handleMessage}
            injectedJavaScript={injectedJavaScript}
            startInLoadingState
            renderLoading={() => (
              <View className="absolute inset-0 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#0158a6" />
              </View>
            )}
          />

          {/* 푸터 */}
          <Animated.View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              paddingBottom: insets.bottom || 8,
              transform: [{ translateY: footerTranslateY }],
            }}
            className="border-t border-gray-100 bg-white px-4 pt-2"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <TouchableOpacity
                  onPress={handleGoBack}
                  disabled={!canGoBack}
                  className="h-12 w-12 items-center justify-center rounded-lg"
                >
                  <Ionicons
                    name="chevron-back"
                    size={26}
                    color={canGoBack ? '#333' : '#d1d5db'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleGoForward}
                  disabled={!canGoForward}
                  className="h-12 w-12 items-center justify-center rounded-lg"
                >
                  <Ionicons
                    name="chevron-forward"
                    size={26}
                    color={canGoForward ? '#333' : '#d1d5db'}
                  />
                </TouchableOpacity>
              </View>
              <View className="flex-row items-center gap-4">
                <TouchableOpacity
                  onPress={handleShare}
                  className="h-12 w-12 items-center justify-center rounded-lg"
                >
                  <Ionicons name="share-outline" size={24} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleReload}
                  className="h-12 w-12 items-center justify-center rounded-lg"
                >
                  <Ionicons name="reload" size={24} color="#333" />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>

        {/* 액션 시트 */}
        {showActionSheet && (
          <View className="absolute inset-0 z-50">
            <TouchableOpacity
              className="flex-1 bg-black/50"
              onPress={() => setShowActionSheet(false)}
            >
              <View className="flex-1 justify-end">
                <TouchableOpacity onPress={(e) => e.stopPropagation()}>
                  <View
                    className="rounded-t-3xl bg-white pt-4"
                    style={{ paddingBottom: insets.bottom + 32 }}
                  >
                    <View className="mb-4 items-center">
                      <View className="h-1 w-10 rounded-full bg-gray-300" />
                    </View>

                    <TouchableOpacity
                      className="flex-row items-center px-6 py-4"
                      onPress={handleShare}
                    >
                      <View className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                        <Ionicons
                          name="share-outline"
                          size={20}
                          color="#0158a6"
                        />
                      </View>
                      <Text className="text-base font-medium text-gray-900">
                        공유
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="flex-row items-center px-6 py-4"
                      onPress={handleCopyLink}
                    >
                      <View className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                        <Ionicons
                          name="copy-outline"
                          size={20}
                          color="#0158a6"
                        />
                      </View>
                      <Text className="text-base font-medium text-gray-900">
                        링크 복사
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="flex-row items-center px-6 py-4"
                      onPress={handleOpenInBrowser}
                    >
                      <View className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                        <Ionicons
                          name="open-outline"
                          size={20}
                          color="#0158a6"
                        />
                      </View>
                      <Text className="text-base font-medium text-gray-900">
                        외부 브라우저에서 열기
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  )
}
