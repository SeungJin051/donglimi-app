# 🌳 동리미 앱 (donglimi-app)

> 학교 공지사항을 더 쉽고 빠르게 확인하고,
> 필요한 정보만 골라 받을 수 있는 공지사항 알림 앱입니다.

[![App Store Download](https://img.shields.io/badge/App_Store-0D96F6?style=flat-square&logo=appstore&logoColor=white)](https://apps.apple.com/kr/app/동리미/id6754769898)

이 프로젝트는 [Expo (React Native)](https://expo.dev/)를 기반으로 구축되었으며, [Firebase](https://firebase.google.com/)와 [Algolia](https://www.algolia.com/)를 백엔드로 활용합니다.

## 📍 주요 기능

- **공지사항 피드:** Firebase Firestore와 연동하여 실시간으로 학교 공지사항을 불러옵니다.
- **강력한 검색:** Algolia 검색 엔진을 연동하여 빠르고 정확한 공지사항 전문(full-text) 검색 기능을 제공합니다. (`notices` 인덱스 활용)
- **공지사항 스크랩:** 사용자가 원하는 공지사항을 로컬 및/또는 서버에 저장하여 언제든 다시 볼 수 있습니다.
- **맞춤 알림 구독:**
  - 사용자가 설정한 특정 키워드 또는 학과 공지사항이 올라올 경우 푸시 알림을 받습니다.
  - Firebase Cloud Messaging(FCM)을 활용하여 알림을 전송합니다.
- **광고 수익화:** Google AdMob SDK를 연동하여 배너 및 전면 광고를 앱 내에 표시합니다.
- **편의 기능:** 학사일정, 유용한 링크 등 학교 생활에 필요한 추가 정보를 제공합니다.

## 🛠️ 기술 스택 (Tech Stack)

### Core

![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=flat-square&logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-000020?style=flat-square&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Expo Router](https://img.shields.io/badge/Expo_Router-000020?style=flat-square&logo=expo&logoColor=white)

### Backend & Data

![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![Firestore](https://img.shields.io/badge/Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![Algolia](https://img.shields.io/badge/Algolia-5468FF?style=flat-square&logo=algolia&logoColor=white)

### State Management

![React Query](https://img.shields.io/badge/React_Query-FF4154?style=flat-square&logo=reactquery&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-1A1A1A?style=flat-square)
![AsyncStorage](https://img.shields.io/badge/AsyncStorage-61DAFB?style=flat-square&logo=react&logoColor=black)

### UI & Styling

![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![NativeWind](https://img.shields.io/badge/NativeWind-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)
![React Native Reanimated](https://img.shields.io/badge/Reanimated-4630EB?style=flat-square&logo=reactnative&logoColor=white)
![Gesture Handler](https://img.shields.io/badge/Gesture_Handler-4630EB?style=flat-square&logo=reactnative&logoColor=white)
![Gorhom Bottom Sheet](https://img.shields.io/badge/Gorhom_BottomSheet-4630EB?style=flat-square)

### Development Tools

![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=flat-square&logo=prettier&logoColor=black)
