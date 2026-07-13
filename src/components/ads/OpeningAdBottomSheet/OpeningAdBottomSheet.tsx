import { useCallback, useEffect, useRef, useState } from 'react'

import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import {
  NativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaView,
} from 'react-native-google-mobile-ads'
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { initializeMobileAds } from '@/utils/mobileAdsInit'
import { NATIVE_AD_UNIT_ID } from '@/utils/nativeAdUnit'

let hasShownOpeningAdThisSession = false

const SHEET_RADIUS = 24
const MEDIA_HEIGHT = 148
const OPEN_DURATION = 340
const CLOSE_DURATION = 280

type OpeningNativeAdCardProps = {
  nativeAd: NativeAd
}

function OpeningNativeAdCard({ nativeAd }: OpeningNativeAdCardProps) {
  return (
    <View style={styles.cardOuter}>
      <View style={styles.handleBar} />

      <View style={styles.sponsorRow}>
        <View style={styles.adBadge}>
          <Text style={styles.adBadgeText}>AD</Text>
        </View>
        <Text style={styles.sponsorLabel}>스폰서 콘텐츠</Text>
      </View>

      <View style={styles.adClipContainer} collapsable={false}>
        <NativeAdView nativeAd={nativeAd} style={styles.nativeAdView}>
          <View style={styles.adCard} collapsable={false}>
            <View style={styles.adHeader}>
              {nativeAd.icon ? (
                <NativeAsset assetType={NativeAssetType.ICON}>
                  <Image
                    source={{ uri: nativeAd.icon.url }}
                    style={styles.adIcon}
                  />
                </NativeAsset>
              ) : null}

              <View style={styles.adHeaderText}>
                <NativeAsset assetType={NativeAssetType.HEADLINE}>
                  <Text style={styles.headline} numberOfLines={2}>
                    {nativeAd.headline}
                  </Text>
                </NativeAsset>

                {nativeAd.advertiser ? (
                  <NativeAsset assetType={NativeAssetType.ADVERTISER}>
                    <Text style={styles.advertiser} numberOfLines={1}>
                      {nativeAd.advertiser}
                    </Text>
                  </NativeAsset>
                ) : null}
              </View>
            </View>

            <View style={styles.mediaClip} collapsable={false}>
              <NativeMediaView style={styles.mediaView} resizeMode="cover" />
            </View>

            {nativeAd.body ? (
              <View style={styles.bodyWrap}>
                <NativeAsset assetType={NativeAssetType.BODY}>
                  <Text style={styles.body} numberOfLines={2}>
                    {nativeAd.body}
                  </Text>
                </NativeAsset>
              </View>
            ) : null}

            <View style={styles.ctaWrap}>
              <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
                <View style={styles.ctaButton}>
                  <Text style={styles.ctaText}>{nativeAd.callToAction}</Text>
                </View>
              </NativeAsset>
            </View>
          </View>
        </NativeAdView>
      </View>
    </View>
  )
}

export function OpeningAdBottomSheet() {
  const insets = useSafeAreaInsets()
  const [nativeAd, setNativeAd] = useState<NativeAd | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const isClosingRef = useRef(false)

  const panelTranslateY = useSharedValue(480)
  const backdropOpacity = useSharedValue(0)
  const dragOffsetY = useSharedValue(0)

  const finishDismiss = useCallback(() => {
    isClosingRef.current = false
    setIsMounted(false)
    setNativeAd((current) => {
      current?.destroy()
      return null
    })
    panelTranslateY.value = 480
    backdropOpacity.value = 0
    dragOffsetY.value = 0
  }, [backdropOpacity, dragOffsetY, panelTranslateY])

  const animateOpen = useCallback(() => {
    panelTranslateY.value = 480
    backdropOpacity.value = 0
    dragOffsetY.value = 0

    backdropOpacity.value = withTiming(1, {
      duration: OPEN_DURATION,
      easing: Easing.out(Easing.quad),
    })
    panelTranslateY.value = withTiming(0, {
      duration: OPEN_DURATION,
      easing: Easing.out(Easing.cubic),
    })
  }, [backdropOpacity, dragOffsetY, panelTranslateY])

  const animateClose = useCallback(() => {
    if (isClosingRef.current) return
    isClosingRef.current = true

    backdropOpacity.value = withTiming(0, {
      duration: CLOSE_DURATION,
      easing: Easing.in(Easing.quad),
    })
    panelTranslateY.value = withTiming(
      480,
      {
        duration: CLOSE_DURATION,
        easing: Easing.in(Easing.cubic),
      },
      (finished) => {
        if (finished) {
          runOnJS(finishDismiss)()
        }
      }
    )
  }, [backdropOpacity, finishDismiss, panelTranslateY])

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }))

  const panelAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: panelTranslateY.value + dragOffsetY.value }],
  }))

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        dragOffsetY.value = event.translationY
        backdropOpacity.value = Math.max(0, 1 - event.translationY / 280)
      }
    })
    .onEnd((event) => {
      const shouldClose = event.translationY > 100 || event.velocityY > 900

      if (shouldClose) {
        runOnJS(animateClose)()
        return
      }

      dragOffsetY.value = withTiming(0, {
        duration: 200,
        easing: Easing.out(Easing.cubic),
      })
      backdropOpacity.value = withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.quad),
      })
    })

  useEffect(() => {
    if (hasShownOpeningAdThisSession) return

    let cancelled = false
    let loadedAd: NativeAd | null = null

    const loadOpeningAd = async () => {
      try {
        await initializeMobileAds()
        if (cancelled) return

        loadedAd = await NativeAd.createForAdRequest(NATIVE_AD_UNIT_ID)
        if (cancelled) {
          loadedAd.destroy()
          return
        }

        hasShownOpeningAdThisSession = true
        setNativeAd(loadedAd)

        setTimeout(() => {
          if (!cancelled) {
            setIsMounted(true)
          }
        }, 700)
      } catch (error) {
        console.log('오프닝 네이티브 광고 로드 실패:', error)
        loadedAd?.destroy()
      }
    }

    void loadOpeningAd()

    return () => {
      cancelled = true
      if (!hasShownOpeningAdThisSession) {
        loadedAd?.destroy()
      }
    }
  }, [])

  useEffect(() => {
    if (isMounted) {
      animateOpen()
    }
  }, [animateOpen, isMounted])

  if (!isMounted || !nativeAd) {
    return null
  }

  return (
    <Modal
      visible
      transparent
      animationType="none"
      onRequestClose={animateClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={animateClose}>
          <Animated.View style={[styles.backdrop, backdropAnimatedStyle]} />
        </Pressable>

        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              styles.panel,
              panelAnimatedStyle,
              { paddingBottom: Math.max(insets.bottom, 16) },
            ]}
          >
            <OpeningNativeAdCard nativeAd={nativeAd} />
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  panel: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    overflow: 'hidden',
    maxHeight: '52%',
  },
  handleBar: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    marginTop: 10,
    marginBottom: 8,
  },
  cardOuter: {
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  sponsorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  adBadge: {
    borderRadius: 4,
    backgroundColor: '#FBBF24',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  adBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sponsorLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  adClipContainer: {
    overflow: 'hidden',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  nativeAdView: {
    overflow: 'hidden',
  },
  adCard: {
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  adHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  adIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  adHeaderText: {
    flex: 1,
  },
  headline: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 20,
  },
  advertiser: {
    marginTop: 2,
    fontSize: 12,
    color: '#6B7280',
  },
  mediaClip: {
    height: MEDIA_HEIGHT,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  mediaView: {
    width: '100%',
    height: MEDIA_HEIGHT,
  },
  bodyWrap: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
  },
  body: {
    fontSize: 13,
    lineHeight: 18,
    color: '#4B5563',
  },
  ctaWrap: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 14,
  },
  ctaButton: {
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#3182F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  ctaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
})
