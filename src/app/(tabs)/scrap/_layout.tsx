import { ScrapHeader } from '@/components/layout/ScrapHeader/ScrapHeader'
import { TabStackLayout } from '@/components/layout/TabStackLayout'

export default function ScrapStackLayout() {
  return <TabStackLayout header={() => <ScrapHeader />} />
}
