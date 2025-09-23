import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '../../global.css';

// _를 붙이면 일반 페이지가 아니라 레이아웃(layout), 슬롯(slot), API 라우트 등 특별한 기능을 하는 파일로 취급됩니다.
export default function RootLayout() {
  return (
    // 안전 영역
    <SafeAreaProvider>
      {/* 공통 레이아웃 안에서 페이지 내용이 표시될 위치 */}
      <Slot />
    </SafeAreaProvider>
  );
}
