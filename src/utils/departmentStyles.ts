// 1. 카테고리별 스타일 정의 (Tailwind CSS 클래스 사용)

import { DEPARTMENT_LIST } from '@/constants/departments'

// 원하는 색상으로 자유롭게 커스텀하세요.
const categoryStyles: { [key: string]: { bg: string; text: string } } = {
  대학원: { bg: 'bg-indigo-50', text: 'text-indigo-700' },
  부속기관: { bg: 'bg-green-50', text: 'text-green-700' },
  정보광장: { bg: 'bg-amber-50', text: 'text-amber-700' },
  동의소식: { bg: 'bg-sky-50', text: 'text-sky-700' },
  인문사회과학대학: { bg: 'bg-rose-50', text: 'text-rose-700' },
  상경대학: { bg: 'bg-cyan-50', text: 'text-cyan-700' },
  미래융합대학: { bg: 'bg-teal-50', text: 'text-teal-700' },
  '의료·보건·생활대학': { bg: 'bg-lime-50', text: 'text-lime-700' },
  한의과대학: { bg: 'bg-fuchsia-50', text: 'text-fuchsia-700' },
  공과대학: { bg: 'bg-orange-50', text: 'text-orange-700' },
  소프트웨어융합대학: { bg: 'bg-purple-50', text: 'text-purple-700' },
  default: { bg: 'bg-gray-100', text: 'text-gray-600' },
}

// 2. 학과명(name)을 카테고리(category)로 매핑하는 Map 생성
// 앱이 시작될 때 한 번만 실행되어 효율적입니다.
const departmentToCategoryMap = new Map<string, string>()
DEPARTMENT_LIST.forEach((item) => {
  departmentToCategoryMap.set(item.name, item.category)
})

// 3. 최종 유틸리티 함수
export const getDepartmentStyles = (departmentName: string) => {
  // Map에서 학과명으로 카테고리를 찾습니다.
  const category = departmentToCategoryMap.get(departmentName)

  // 카테고리가 존재하고, 정의된 스타일이 있다면 해당 스타일을 반환합니다.
  if (category && categoryStyles[category]) {
    return categoryStyles[category]
  }

  // 그 외의 경우 기본 스타일을 반환합니다.
  return categoryStyles.default
}
