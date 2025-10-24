---
title: "개발 도구 — ESLint, Prettier, VSCode, Turbo, Storybook"
date: 2025-10-24
---

**Next.js 15 / React 19 기준**

#### 요약
Next.js 개발 환경은 **ESLint + Prettier 코드 품질 관리**,  
**VSCode 개발 설정**, **Turborepo 빌드 캐시**, **Storybook 컴포넌트 테스트**를 중심으로 구성된다.  
이 조합은 코드 일관성과 협업 효율을 극대화한다.

- ESLint + Prettier를 통한 코드 일관성 유지  
- VSCode 자동 포맷팅 및 TypeScript 지원  
- Turborepo를 통한 멀티 패키지 캐시 빌드  
- Storybook으로 UI 컴포넌트 단위 테스트  
- Husky + lint-staged로 커밋 전 검사 자동화  

> 요약 정리:  
> Next.js는 “**TypeScript + Lint + Format + Visual Docs**” 통합 개발 경험을 제공한다.  
> 초기 설정만 완료하면 프로젝트 규모가 커져도 품질 관리가 자동화된다.

> **정리:**
>
> * ESLint/Prettier → 코드 품질
> * VSCode → 일관된 IDE 환경
> * Turborepo → 빌드 캐시
> * Storybook → 컴포넌트 검증
> * Husky → 커밋 전 자동 검사
>
> 이 다섯 가지 도구는 Next.js 실무 개발의 기본 토대다.

##### 참고자료  
- [Next.js ESLint 공식 가이드](https://nextjs.org/docs/app/building-your-application/configuring/eslint)  
- [Prettier Config Docs](https://prettier.io/docs/en/configuration.html)  
- [VSCode Settings](https://code.visualstudio.com/docs/getstarted/settings)  
- [Turborepo Docs](https://turbo.build/repo/docs)  
- [Storybook Docs](https://storybook.js.org/docs/react/get-started/introduction)

---

#### 1. ESLint 설정

Next.js는 ESLint가 내장되어 있으며, `next lint` 명령으로 검사할 수 있다.

##### 설치

```bash
npm install -D eslint eslint-config-next
```

##### `.eslintrc.json`

```json
{
  "extends": ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
  "rules": {
    "react/no-unescaped-entities": "off",
    "@typescript-eslint/no-unused-vars": ["warn"]
  }
}
```

##### 실행

```bash
npm run lint
```

> Next.js 15는 ESLint 검사 결과를 빌드 단계(`next build`)에서도 자동 반영한다.

---

#### 2. Prettier 설정

Prettier는 코드 스타일을 통일하기 위한 자동 포맷터다.

##### 설치

```bash
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
```

##### `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100
}
```

##### ESLint와 통합

```json
{
  "extends": ["next/core-web-vitals", "plugin:prettier/recommended"]
}
```

> ESLint와 Prettier를 함께 설정하면 코드 품질 검사 + 자동 포맷팅이 동시에 적용된다.

---

#### 3. VSCode 설정

VSCode를 사용하면 포맷팅, 타입 검사, 코드 탐색이 자동으로 동작한다.

##### `.vscode/settings.json`

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.ts": "typescriptreact"
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

##### 추천 확장(Extensions)

| 확장명                           | 기능         |
| ----------------------------- | ---------- |
| **ESLint**                    | 코드 규칙 검사   |
| **Prettier**                  | 자동 포맷팅     |
| **Tailwind CSS IntelliSense** | 클래스 자동 완성  |
| **TypeScript Hero**           | import 정리  |
| **GitLens**                   | Git 이력 시각화 |

> `.vscode/extensions.json`에 `"recommendations"`를 추가하면 팀원 IDE 환경도 통일 가능하다.

---

#### 4. Turborepo 빌드 관리

Turborepo는 멀티 패키지(모노레포) 환경에서 **캐시 기반 빌드**를 지원한다.

##### 설치

```bash
npm install turbo --save-dev
```

##### `turbo.json`

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**"]
    },
    "lint": {},
    "test": {}
  }
}
```

##### 실행

```bash
npx turbo run build
```

> Turborepo는 CI/CD 환경에서도 **변경된 패키지만 빌드**하므로,
> 대규모 Next.js 모노레포 프로젝트에서 빌드 시간을 획기적으로 줄여준다.

---

#### 5. Storybook 구성

Storybook은 컴포넌트를 독립적으로 개발·테스트하는 도구이다.

##### 설치

```bash
npx storybook@latest init
```

##### 실행

```bash
npm run storybook
```

##### 예시

```tsx
// components/Button.tsx
export function Button({ label }) {
  return <button>{label}</button>;
}
```

```tsx
// components/Button.stories.tsx
import { Button } from "./Button";

export default { title: "Components/Button", component: Button };

export const Primary = () => <Button label="확인" />;
```

##### 구성 파일 수정 (`.storybook/main.ts`)

```ts
export default {
  stories: ["../components/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
};
```

> Storybook은 RSC 환경에서 직접 실행되지 않으므로,
> **Client Components 전용 컴포넌트** 테스트에 주로 사용한다.

---

#### 6. 커밋 훅 (Husky + lint-staged)

##### 설치

```bash
npm install -D husky lint-staged
npx husky install
```

##### `package.json`

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"]
  },
  "scripts": {
    "prepare": "husky install"
  }
}
```

##### 훅 추가

```bash
npx husky add .husky/pre-commit "npx lint-staged"
```

> 커밋 시 자동으로 코드 검사 및 포맷팅을 수행하여,
> 코드 품질 이슈가 레포지토리에 반영되지 않도록 방지한다.

---

#### 7. 결론

Next.js 15의 개발 도구 체계는 **Lint → Format → Test → Build → Preview** 로 이어지는
완전한 개발 파이프라인을 형성한다.
ESLint·Prettier·VSCode 설정으로 코드 품질을 유지하고,
Turborepo와 Storybook으로 개발 속도와 협업 효율을 높인다.


