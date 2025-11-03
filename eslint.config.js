import eslintConfigPrettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  // 1. Global Ignores: 프로젝트 전체에서 린트를 무시할 파일/폴더
  {
    ignores: [
      'node_modules',
      '.expo',
      'dist',
      'babel.config.cjs', // .cjs 확장자로 된 설정 파일들을 무시
      'tailwind.config.cjs',
      'metro.config.cjs',
      '.prettierrc.cjs',
    ],
  },

  // 2. 기본 권장 설정
  ...tseslint.configs.recommended,

  // 3. 프로젝트 루트의 설정 파일(.cjs)을 위한 규칙
  {
    files: ['*.cjs'], // 루트의 .cjs 파일에만 이 규칙을 적용
    rules: {
      // 설정 파일에서는 require() 구문 사용을 허용
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // 4. 프로젝트 소스 코드 커스텀 설정
  {
    files: ['**/*.{js,jsx,ts,tsx}'], // 앱의 모든 소스 코드에 적용
    plugins: {
      import: importPlugin,
      react: react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      // 필수 규칙
      'react/react-in-jsx-scope': 'off',
      'react-hooks/exhaustive-deps': 'warn',

      // 코드 품질 규칙 (에러 대신 경고로)
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',

      // 스타일/컨벤션 규칙 (에러 대신 경고로)
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          pathGroups: [
            { pattern: 'react', group: 'external', position: 'before' },
            { pattern: '@/**', group: 'internal' },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },

  // 5. Prettier 설정 (항상 마지막에 위치)
  eslintConfigPrettier
)
