import { NotificationHeader } from '@/components/layout/NotificationHeader'
import { TabStackLayout } from '@/components/layout/TabStackLayout'

export default function NotificationStackLayout() {
  return <TabStackLayout header={() => <NotificationHeader />} />
}
