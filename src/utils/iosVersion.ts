import { Platform } from 'react-native'

/** iOS 메이저 버전 (예: 18, 26). iOS가 아니면 0 */
export function getIosMajorVersion(): number {
  if (Platform.OS !== 'ios') return 0
  const version = Platform.Version
  if (typeof version === 'string') {
    return parseInt(version.split('.')[0] ?? '0', 10)
  }
  return Math.floor(Number(version))
}

/** Liquid Glass Native Tabs — iOS 26+ & Xcode 26 빌드 필요 */
export function isIos26OrLater(): boolean {
  return getIosMajorVersion() >= 26
}
