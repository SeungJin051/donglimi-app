// 구독 탭 단과대학/학과
export const SUBSCRIPTION_TAB_DEPARTMENT = [
  '인문사회과학대학',
  '상경대학',
  '미래융합대학',
  '의료·보건·생활대학',
  '한의과대학',
  '공과대학',
  '소프트웨어융합대학',
  '예술디자인체육대학',
  '자유전공학부',
]

// 구독 탭
export const SUBSCRIPTION_TAB = ['정보광장', '단과대학/학과']

// 구독 아이템 타입 정의
export interface Subscription {
  id: string
  name: string
}
