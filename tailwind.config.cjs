/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // 레거시 브랜드 색 (점진 제거 예정)
        'deu-light-blue': '#0158a6',
        'deu-strong-blue': '#093a87',

        // === 시맨틱 디자인 토큰 (Toss-like) ===
        primary: {
          DEFAULT: '#3182F6', // 브랜드/CTA 블루
          pressed: '#1B64DA', // 눌림 상태
          soft: '#E8F3FF', // 옅은 배경 (선택 상태, 배지)
        },
        bg: '#F2F4F6', // 화면 배경
        surface: '#FFFFFF', // 카드/시트 표면
        'surface-pressed': '#F2F4F6', // 리스트 행 눌림 배경
        divider: '#F2F4F6', // 구분선
        stroke: '#E5E8EB', // 테두리
        text: {
          primary: '#191F28', // 제목/본문
          secondary: '#4E5968', // 보조 본문
          tertiary: '#8B95A1', // 캡션/메타
          disabled: '#B0B8C1',
        },
        danger: {
          DEFAULT: '#F04452',
          soft: '#FDEDEE',
        },
        success: {
          DEFAULT: '#12B76A',
          soft: '#E9F9F1',
        },
      },
      borderRadius: {
        card: '16px', // 카드
        control: '12px', // 버튼/입력
        badge: '8px', // 배지/칩
      },
    },
  },
  plugins: [],
}
