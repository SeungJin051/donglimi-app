/**
 * 사용자가 자신의 학과를 설정할 때 사용할 상수 목록입니다.
 * 단과대학별로 학과가 그룹화되어 있습니다.
 */
export const DEPARTMENTS_BY_COLLEGE = {
  // 인문사회과학대학
  humanities: {
    title: '인문사회과학대학',
    departments: [
      { id: 'korean', name: '국어국문학과' },
      { id: 'earlyChildhoodEdu', name: '유아교육과' },
      { id: 'chinese', name: '중어중국학과' },
      { id: 'advertising', name: '광고홍보학과' },
      { id: 'japanese', name: '일본학과' },
      { id: 'mediaComm', name: '미디어커뮤니케이션학과' },
      { id: 'english', name: '영어영문학과' },
      { id: 'law', name: '법학과' },
      { id: 'libraryInfo', name: '문헌정보학과' },
      { id: 'policeAdmin', name: '경찰행정학과' },
      { id: 'lifelongEdu', name: '평생교육·청소년상담학과' },
      { id: 'fireAdmin', name: '소방방재행정학과' },
      { id: 'psychology', name: '심리학과' },
      { id: 'publicAdmin', name: '행정학과' },
      { id: 'childStudies', name: '아동학과' },
      { id: 'socialWelfare', name: '사회복지학과' },
      { id: 'digitalContents', name: '디지털콘텐츠학과' },
    ],
  },
  // 상경대학
  commerce: {
    title: '상경대학',
    departments: [
      { id: 'finance', name: '금융경영학과' },
      { id: 'managementInfo', name: '경영정보학과' },
      { id: 'realEstate', name: '재무부동산학과' },
      { id: 'eBusiness', name: 'e비지니스학과' },
      { id: 'smartPortLogistics', name: '스마트항만물류학과' },
      { id: 'tourism', name: '국제관광경영학과' },
      { id: 'hotelConvention', name: '호텔·컨벤션경영학과' },
      { id: 'trade', name: '무역학과' },
      { id: 'foodService', name: '외식경영학과' },
      { id: 'distributionLogistics', name: '유통물류학과' },
      { id: 'smartHospitality', name: '스마트호스피탈리티학과' },
      { id: 'businessAdmin', name: '경영학과' },
      { id: 'accounting', name: '회계학과' },
    ],
  },
  // 미래융합대학
  futureConvergence: {
    title: '미래융합대학',
    departments: [
      { id: 'realEstateAsset', name: '부동산자산경영학과' },
      { id: 'beautyBusiness', name: '뷰티비니지스학과' },
      { id: 'smartStartup', name: '스마트창업경영학과' },
      { id: 'aiMulticulturalCounseling', name: 'AI다문화상담학과' },
      { id: 'seniorSports', name: '시니어스포츠지도학과' },
    ],
  },
  // 의료·보건·생활대학
  healthSciences: {
    title: '의료·보건·생활대학',
    departments: [
      { id: 'nursing', name: '간호학과' },
      { id: 'clinicalPathology', name: '임상병리학과' },
      { id: 'dentalHygiene', name: '치위생과' },
      { id: 'radiology', name: '방사선학과' },
      { id: 'healthCareManagement', name: '의료경영학과' },
      { id: 'physicalTherapy', name: '물리치료학과' },
      { id: 'foodNutrition', name: '식품영양학과' },
      { id: 'ems', name: '응급구조학과' },
    ],
  },
  // 한의과대학
  koreanMedicine: {
    title: '한의과대학',
    departments: [
      { id: 'preKoreanMedicine', name: '한의예과' },
      { id: 'koreanMedicine', name: '한의학과' },
    ],
  },
  // 공과대학
  engineering: {
    title: '공과대학',
    departments: [
      { id: 'mechanicalEng', name: '기계공학과' },
      { id: 'robotEng', name: '로봇공학과' },
      { id: 'automotiveEng', name: '자동차공학과' },
      { id: 'navalArch', name: '조선해양공학과' },
      { id: 'materialsSci', name: '신소재공학과' },
      { id: 'polymerNano', name: '고분자나노공학과' },
      { id: 'architecture', name: '건축학과' },
      { id: 'architecturalEng', name: '건축공학과' },
      { id: 'civilEng', name: '토목공학과' },
      { id: 'urbanEng', name: '도시공학과' },
      { id: 'environmentalEng', name: '환경공학과' },
      { id: 'chemicalEng', name: '화학공학과' },
      { id: 'cosmeticEng', name: '화장품공학과' },
      { id: 'biomedicalEng', name: '의생명공학과' },
      { id: 'biopharmaceutical', name: '바이오의약학과' },
      { id: 'foodSci', name: '식품공학과' },
      { id: 'humanFactors', name: '인간공학과' },
      { id: 'industrialIct', name: '산업ICT기술공학' },
      { id: 'industrialMgmtBigData', name: '산업경영빅데이터공학과' },
      { id: 'electricalEng', name: '전기공학과' },
      { id: 'electronicEng', name: '전자공학과' },
      { id: 'infoCommEng', name: '정보통신공학과' },
      { id: 'futureMobility', name: '미래모빌리티학과' },
      { id: 'advancedEnergy', name: '첨단에너지공학과' },
    ],
  },
  // 소프트웨어융합대학
  softwareConvergence: {
    title: '소프트웨어융합대학',
    departments: [
      { id: 'computerEng', name: '컴퓨터공학과' },
      { id: 'computerSwEng', name: '컴퓨터소프트웨어공학과' },
      { id: 'appliedSwEng', name: '응용소프트웨어공학과' },
      { id: 'ai', name: '인공지능학과' },
      { id: 'gameEng', name: '게임공학과' },
      { id: 'softwareConvergenceDept', name: '소프트웨어융합학과' },
    ],
  },

  artDesignSports: {
    title: '예술디자인체육대학',
    departments: [
      { id: 'music', name: '음악학과' },
      { id: 'designArt', name: '디자인조형학과' },
      { id: 'fashionDesign', name: '패션디자인학과' },
      { id: 'physicalEdu', name: '체육학과' },
      { id: 'leisureSports', name: '레저스포츠학과' },
      { id: 'taekwondo', name: '태권도학과' },
      { id: 'sportsCoaching', name: '경기지도학과' },
      { id: 'kBeauty', name: 'K-뷰티학과' },
      { id: 'cinema', name: '영화학과' },
    ],
  },

  // 자유전공학부
  freeMajor: {
    title: '자유전공학부',
    departments: [{ id: 'freeMajor', name: '자유전공학부' }],
  },
}
