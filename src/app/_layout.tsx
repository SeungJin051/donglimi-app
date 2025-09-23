import { Stack } from 'expo-router';

import '../../global.css';

// _를 붙이면 일반 페이지가 아니라 레이아웃(layout), 슬롯(slot), API 라우트 등 특별한 기능을 하는 파일로 취급됩니다.
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
    </Stack>
  );
}
