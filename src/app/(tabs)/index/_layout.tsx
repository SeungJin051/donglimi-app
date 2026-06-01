import { HomeHeader } from '@/components/layout/HomeHeader'
import { TabStackLayout } from '@/components/layout/TabStackLayout'

export default function IndexStackLayout() {
  return <TabStackLayout header={() => <HomeHeader />} />
}
