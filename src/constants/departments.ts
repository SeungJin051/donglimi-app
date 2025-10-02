export interface DepartmentTarget {
  name: string
  url: string // 크롤링할 공지사항 페이지 URL
  type: string // 파서 타입 (공지사항, 학과공지, 채용공지 등)
  category: string // 대학/카테고리 분류
}

export const SUBSCRIPTION_LIST: DepartmentTarget[] = [
  // 대학원
  {
    category: '대학원',
    name: '대학원',
    url: 'https://www.deu.ac.kr/grd/sub06_01.do',
    type: '공지사항',
  },

  // 부속기관
  {
    category: '부속기관',
    name: '중앙도서관',
    url: 'https://lib.deu.ac.kr/sb/default_notice_list.mir',
    type: '도서관공지',
  },
  {
    category: '부속기관',
    name: '국제교류처',
    url: 'https://exchange.deu.ac.kr/exchange/sub05_01.do',
    type: '공지사항',
  },
  {
    category: '부속기관',
    name: '대학일자리플러스센터',
    url: 'https://deuhome.deu.ac.kr/pluscenter/sub04_07.do',
    type: '공지사항',
  },

  // 정보광장
  {
    category: '정보광장',
    name: '일반공지',
    url: 'https://www.deu.ac.kr/www/deu-notice.do',
    type: '공지사항',
  },
  {
    category: '정보광장',
    name: '장학공지',
    url: 'https://www.deu.ac.kr/www/deu-scholarship.do',
    type: '공지사항',
  },
  {
    category: '정보광장',
    name: '교육·모집',
    url: 'https://www.deu.ac.kr/www/deu-education.do',
    type: '공지사항',
  },
  {
    category: '정보광장',
    name: '기숙사',
    url: 'https://www.deu.ac.kr/www/deu-dormitory.do',
    type: '공지사항',
  },
  {
    category: '정보광장',
    name: '채용',
    url: 'https://www.deu.ac.kr/www/deu-job.do',
    type: '채용공지',
  },
  {
    category: '정보광장',
    name: '입찰',
    url: 'https://www.deu.ac.kr/www/deu-bids.do',
    type: '공지사항',
  },
  {
    category: '정보광장',
    name: '외부기관',
    url: 'https://www.deu.ac.kr/www/deu-external.do',
    type: '공지사항',
  },
  // 추가 항목
  {
    category: '정보광장',
    name: '동의TODAY',
    url: 'https://www.deu.ac.kr/www/deu-today.do',
    type: '동의TODAY',
  },
  {
    category: '정보광장',
    name: '중앙도서관',
    url: 'https://lib.deu.ac.kr/sb/default_notice_list.mir',
    type: '도서관공지',
  },
  {
    category: '정보광장',
    name: '국제교류처',
    url: 'https://exchange.deu.ac.kr/exchange/sub05_01.do',
    type: '공지사항',
  },
  {
    category: '정보광장',
    name: '대학일자리플러스센터',
    url: 'https://deuhome.deu.ac.kr/pluscenter/sub04_07.do',
    type: '공지사항',
  },
  {
    category: '정보광장',
    name: '대학원',
    url: 'https://www.deu.ac.kr/grd/sub06_01.do',
    type: '공지사항',
  },

  // 동의소식
  {
    category: '동의소식',
    name: '동의TODAY',
    url: 'https://www.deu.ac.kr/www/deu-today.do',
    type: '동의TODAY',
  },

  // 인문사회과학대학
  {
    category: '인문사회과학대학',
    name: '국어국문학과',
    url: 'https://koreanl.deu.ac.kr/koreanl/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '인문사회과학대학',
    name: '유아교육과',
    url: 'https://ece.deu.ac.kr/ece/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '인문사회과학대학',
    name: '중어중국학과',
    url: 'https://china.deu.ac.kr/chi/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '인문사회과학대학',
    name: '광고홍보학과',
    url: 'https://ad.deu.ac.kr/ad/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '인문사회과학대학',
    name: '일본학과',
    url: 'https://japan.deu.ac.kr/japanese/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '인문사회과학대학',
    name: '미디어커뮤니케이션학과',
    url: 'https://massmedia.deu.ac.kr/massmedia/sub05_01.do',
    type: '학과공지',
  },
  {
    category: '인문사회과학대학',
    name: '영어영문학과',
    url: 'https://english.deu.ac.kr/english/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '인문사회과학대학',
    name: '법학과',
    url: 'https://law.deu.ac.kr/law/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '인문사회과학대학',
    name: '문헌정보학과',
    url: 'https://lis.deu.ac.kr/lis/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '인문사회과학대학',
    name: '경찰행정학과',
    url: 'https://police2001.deu.ac.kr/police/sub02_01.do',
    type: '학과공지',
  },
  {
    category: '인문사회과학대학',
    name: '평생교육·청소년상담학과',
    url: 'https://lifelonged.deu.ac.kr/lifelonged/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '인문사회과학대학',
    name: '소방방재행정학과',
    url: 'https://fire.deu.ac.kr/fire/sub07_03.do',
    type: '학과공지',
  },
  {
    category: '인문사회과학대학',
    name: '심리학과',
    url: 'https://psychology.deu.ac.kr/psychology/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '인문사회과학대학',
    name: '행정학과',
    url: 'https://pap.deu.ac.kr/pap/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '인문사회과학대학',
    name: '아동학과',
    url: 'https://childfamily.deu.ac.kr/childfamily/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '인문사회과학대학',
    name: '사회복지학과',
    url: 'https://socialwelfare.deu.ac.kr/socialwelfare/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '인문사회과학대학',
    name: '디지털콘텐츠학과',
    url: 'https://dcc.deu.ac.kr/dcc/sub06_03.do',
    type: '학과공지',
  },

  // 상경대학
  {
    category: '상경대학',
    name: '금융경영학과',
    url: 'https://banin.deu.ac.kr/banin/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '상경대학',
    name: '경영정보학과',
    url: 'https://ibm.deu.ac.kr/ibm/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '상경대학',
    name: '재무부동산학과',
    url: 'https://fre.deu.ac.kr/fre/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '상경대학',
    name: 'e비지니스학과',
    url: 'https://ebiz.deu.ac.kr/ebiz/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '상경대학',
    name: '스마트항만물류학과',
    url: 'https://logistics.deu.ac.kr/logistics/sub07_01.do',
    type: '학과공지',
  },
  {
    category: '상경대학',
    name: '국제관광경영학과',
    url: 'https://newtour.deu.ac.kr/tour/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '상경대학',
    name: '호텔·컨벤션경영학과',
    url: 'https://hotel.deu.ac.kr/hotel/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '상경대학',
    name: '무역학과',
    url: 'https://trade.deu.ac.kr/trade/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '상경대학',
    name: '외식경영학과',
    url: 'https://neweatingout.deu.ac.kr/eatingout/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '상경대학',
    name: '유통물류학과',
    url: 'https://dm.deu.ac.kr/dm/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '상경대학',
    name: '스마트호스피탈리티학과',
    url: 'https://shp.deu.ac.kr/shp/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '상경대학',
    name: '경영학과',
    url: 'https://business1.deu.ac.kr/business/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '상경대학',
    name: '회계학과',
    url: 'https://accounting.deu.ac.kr/account/sub06_03.do',
    type: '학과공지',
  },

  // 미래융합대학
  {
    category: '미래융합대학',
    name: '부동산자산경영학과',
    url: 'https://deuhome.deu.ac.kr/rdm/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '미래융합대학',
    name: '뷰티비니지스학과',
    url: 'https://deuhome.deu.ac.kr/bb/sub07_01.do',
    type: '학과공지',
  },
  {
    category: '미래융합대학',
    name: '스마트창업경영학과',
    url: 'https://deuhome.deu.ac.kr/sei/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '미래융합대학',
    name: 'AI다문화상담학과',
    url: 'https://multicounsel.deu.ac.kr/multicounsel/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '미래융합대학',
    name: '시니어스포츠지도학과',
    url: 'https://seniorsp.deu.ac.kr/seniorsp/sub06_03.do',
    type: '학과공지',
  },

  // 의료·보건·생활대학
  {
    category: '의료·보건·생활대학',
    name: '간호학과',
    url: 'https://nursing.deu.ac.kr/nursing/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '의료·보건·생활대학',
    name: '임상병리학과',
    url: 'https://1cls.deu.ac.kr/cls/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '의료·보건·생활대학',
    name: '치위생과',
    url: 'https://dental.deu.ac.kr/dental/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '의료·보건·생활대학',
    name: '방사선학과',
    url: 'https://radiology.deu.ac.kr/radiology/sub06_03.do',
    type: '학과공지',
  },

  // 한의과대학 (한의예과와 한의학과 모두 동일한 URL 사용)
  {
    category: '한의과대학',
    name: '한의예과',
    url: 'https://omc.deu.ac.kr/omc/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '한의과대학',
    name: '한의학과',
    url: 'https://omc.deu.ac.kr/omc/sub06_03.do',
    type: '학과공지',
  },

  // 공과대학
  {
    category: '공과대학',
    name: '기계공학과',
    url: 'https://nme.deu.ac.kr/me/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '공과대학',
    name: '로봇공학과',
    url: 'https://mecha.deu.ac.kr/mecha/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '공과대학',
    name: '자동차공학과',
    url: 'https://automotive-engineering.deu.ac.kr/automotive-engineering/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '공과대학',
    name: '조선해양공학과',
    url: 'https://naoe.deu.ac.kr/naoe/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '공과대학',
    name: '신소재공학과',
    url: 'https://mse.deu.ac.kr/mse/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '공과대학',
    name: '고분자나노공학과',
    url: 'https://polymer.deu.ac.kr/polymer/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '공과대학',
    name: '건축학과',
    url: 'https://deuproarchi.deu.ac.kr/deuproarchi/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '공과대학',
    name: '건축공학과',
    url: 'https://archieng.deu.ac.kr/archieng/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '공과대학',
    name: '토목공학과',
    url: 'https://civil.deu.ac.kr/civil/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '공과대학',
    name: '도시공학과',
    url: 'https://urban.deu.ac.kr/urban/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '공과대학',
    name: '환경공학과',
    url: 'https://env.deu.ac.kr/env/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '공과대학',
    name: '화학공학과',
    url: 'https://cheng.deu.ac.kr/che/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '공과대학',
    name: '화장품공학과',
    url: 'https://dce.deu.ac.kr/apchem/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '공과대학',
    name: '의생명공학과',
    url: 'https://biotech.deu.ac.kr/biotech/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '공과대학',
    name: '바이오의약학과',
    url: 'https://biopharm.deu.ac.kr/biopharm/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '공과대학',
    name: '식품공학과',
    url: 'https://efood.deu.ac.kr/efood/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '공과대학',
    name: '인간공학과',
    url: 'https://hsde.deu.ac.kr/hsde/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '공과대학',
    name: '산업ICT기술공학',
    url: 'https://ind-ict.deu.ac.kr/ind-ict/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '공과대학',
    name: '산업경영빅데이터공학과',
    url: 'https://pite.deu.ac.kr/pite/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '공과대학',
    name: '전기공학과',
    url: 'https://deuhome.deu.ac.kr/elec/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '공과대학',
    name: '전자공학과',
    url: 'https://deuhome.deu.ac.kr/ee/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '공과대학',
    name: '정보통신공학과',
    url: 'https://deuhome.deu.ac.kr/ice/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '공과대학',
    name: '미래모빌리티학과',
    url: 'https://futuremobility.deu.ac.kr/futuremobility/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '공과대학',
    name: '첨단에너지공학과',
    url: 'https://energy.deu.ac.kr/energy/sub06_03.do',
    type: '학과공지',
  },

  // 소프트웨어융합대학
  {
    category: '소프트웨어융합대학',
    name: '소프트웨어융합대학',
    url: 'https://swcc.deu.ac.kr/swcc/sub01_04.do',
    type: '학과공지',
  },
  {
    category: '소프트웨어융합대학',
    name: '컴퓨터공학과',
    url: 'https://computer.deu.ac.kr/computer/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '소프트웨어융합대학',
    name: '컴퓨터소프트웨어공학과',
    url: 'https://csw.deu.ac.kr/se/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '소프트웨어융합대학',
    name: '응용소프트웨어공학과',
    url: 'https://deuhome.deu.ac.kr/asw/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '소프트웨어융합대학',
    name: '인공지능학과',
    url: 'https://deuhome.deu.ac.kr/ai/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '소프트웨어융합대학',
    name: '게임공학과',
    url: 'https://deuhome.deu.ac.kr/game/sub06_03.do',
    type: '학과공지',
  },
  {
    category: '소프트웨어융합대학',
    name: '소프트웨어융합학과',
    url: 'https://deuhome.deu.ac.kr/sw/sub06_03.do',
    type: '학과공지',
  },
]
