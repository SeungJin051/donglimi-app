module.exports = {
  singleQuote: true, // single 쿼테이션 사용 여부
  printWidth: 80, //  줄 바꿈 할 폭 길이
  tabWidth: 2, // 탭 너비
  useTabs: false, // 탭 사용 여부
  semi: true, // 세미콜론 사용 여부
  quoteProps: 'as-needed', // 객체 속성에 쿼테이션 적용 방식
  jsxSingleQuote: true, // JSX 속성에 작은따옴표 사용
  trailingComma: 'es5', // 여러 줄을 사용할 때, 후행 콤마 사용 방식
  bracketSpacing: true, // 객체 리터럴에서 괄호에 공백 삽입 여부
  arrowParens: 'always', // 화살표 함수에서 파라미터가 하나일 때도 괄호를 항상 사용
  endOfLine: 'lf', // 파일의 마지막 줄에 줄바꿈(newline)을 추가
  plugins: ['prettier-plugin-tailwindcss'],
};
