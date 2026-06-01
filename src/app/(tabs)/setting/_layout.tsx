import { SettingHeader } from '@/components/layout/SettingHeader/SettingHeader'
import { TabStackLayout } from '@/components/layout/TabStackLayout'

export default function SettingStackLayout() {
  return <TabStackLayout header={() => <SettingHeader />} />
}
