import React, { Component } from 'react'

import { GestureHandlerRootView } from 'react-native-gesture-handler'

type Props = {
  children: React.ReactNode
}

type State = {
  hasError: boolean
}

// 에러 경계 컴포넌트
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    // 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error('App Error Boundary caught an error:', error)
  }

  render() {
    if (this.state.hasError) {
      // 에러 발생 시 최소한의 UI만 렌더링 (앱의 완전한 크래시 방지)
      // 또는 여기에 "오류가 발생했습니다" 같은 공통 UI를 넣을 수 있습니다.
      return <GestureHandlerRootView style={{ flex: 1 }} />
    }

    // 에러가 없으면 자식 컴포넌트 렌더링
    return this.props.children
  }
}
