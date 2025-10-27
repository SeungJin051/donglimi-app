import { createRef } from 'react'

import { FlatList } from 'react-native'

export const homeScrollRef = createRef<FlatList>()

export const scrollToTop = () => {
  homeScrollRef.current?.scrollToOffset({ offset: 0, animated: true })
}
