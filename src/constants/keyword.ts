/**
 * 사용자에게 키워드 알림 설정 시 보여줄 상수 목록입니다.
 * 앱 클라이언트나 서버에서 이 값을 기준으로 필터링 로직을 구현할 수 있습니다.
 */
export const NOTIFICATION_KEYWORDS = {
  // 메인 카테고리: '장학'
  scholarship: {
    title: '장학',
    description: '장학금, 등록금 면제 등 학비 지원 관련 정보',
    keywords: ['장학'],
  },
  // 메인 카테고리: '취업 및 창업'
  job: {
    title: '취/창업',
    description: '취업 정보, 인턴십, 창업 지원 및 관련 프로그램',
    keywords: [
      '취업',
      '채용',
      '인턴',
      '모집',
      '현장실습',
      '창업',
      '직무',
      '커리어',
      '일자리',
    ],
  },
  // 메인 카테고리: '국제 교류'
  international: {
    title: '국제',
    description: '국제 교류, 해외 연수, 교환학생 프로그램',
    keywords: ['국제', '해외', '교환학생', '어학연수', '유학생', '외국인'],
  },
  // 메인 카테고리: '학사 정보'
  academic: {
    title: '학사',
    description: '수강신청, 학점, 졸업요건 등 학사 관련 정보',
    keywords: [
      '학사',
      '수강',
      '등록',
      '졸업',
      '휴학',
      '복학',
      '계절학기',
      '전공',
      '교직',
      '시험',
    ],
  },
}

// 키워드 카테고리 목록 (선택용)
export const KEYWORD_CATEGORIES = Object.keys(NOTIFICATION_KEYWORDS) as Array<
  keyof typeof NOTIFICATION_KEYWORDS
>

// 선택된 키워드 타입 정의
export type SelectedKeywords = {
  [key in keyof typeof NOTIFICATION_KEYWORDS]?: boolean
}
