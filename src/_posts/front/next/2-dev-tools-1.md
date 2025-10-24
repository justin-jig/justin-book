---
title: "개발 도구(Dev Tools) — ESLint, TypeScript, VSCode, Debugging"
date: 2025-10-24
---
**Next.js 15 / React 19**

#### 요약
Next.js는 **TypeScript, ESLint, Prettier, VSCode Debugging**을 완전 통합한 개발 환경을 제공한다.  
정적 분석, 코드 포맷팅, 런타임 디버깅까지 모두 기본 지원되어  
대규모 팀 개발에서도 일관된 코드 품질을 유지할 수 있다.

- TypeScript 기본 내장 (tsconfig 자동 생성)  
- ESLint + Prettier 통합 규칙 제공  
- VSCode 디버깅 및 런처 구성  
- 환경 변수 자동 인텔리센스(`.env.local`)  
- `next lint` / `next dev` 개발 통합 명령  

> 요약 정리:  
> Next.js 15는 “**설정 없는(Zero-config) 타입 안정성 + 품질 관리 환경**”을 기본 제공한다.

> **정리:**
>
> * TypeScript → 타입 안정성
> * ESLint + Prettier → 품질 + 스타일
> * VSCode Debug → 개발 효율
> * GitHub Actions → 팀 협업 품질 보증
>
> 즉, Next.js는 “Zero Config + Strict Quality”의 이상적인 개발 환경을 완성했다.

##### 참고자료  
- [TypeScript Integration](https://nextjs.org/docs/app/building-your-application/configuring/typescript)  
- [ESLint 설정](https://nextjs.org/docs/app/building-your-application/configuring/eslint)  
- [VSCode Debugging](https://nextjs.org/docs/app/building-your-application/configuring/debugging)  
- [Prettier 공식 문서](https://prettier.io/docs/en/index.html)  
- [환경 변수 IntelliSense](https://code.visualstudio.com/docs/editor/intellisense)

---

#### 1. TypeScript 설정

Next.js 15는 프로젝트 생성 시 자동으로 `tsconfig.json`을 생성하고,  
React 19 타입 시스템에 맞게 최적화한다.

##### 예시: tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@app/*": ["./app/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

> `strict: true` 옵션은 React Server Components 환경에서도 안전한 타입 검증을 보장한다.

---

#### 2. ESLint 구성

Next.js는 ESLint를 기본 내장하며,
`next lint` 명령으로 자동 검사 및 수정이 가능하다.

##### 설치 및 실행

```bash
npm install -D eslint eslint-config-next
npm run lint
```

##### `.eslintrc.json` 예시

```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "@next/next/no-img-element": "off",
    "react/jsx-key": "warn",
    "no-console": "warn",
    "semi": ["error", "always"]
  }
}
```

##### ESLint + Prettier 통합

```bash
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
```

```json
{
  "extends": ["next/core-web-vitals", "plugin:prettier/recommended"]
}
```

> ESLint는 코드 품질(문법/구조)을,
> Prettier는 코드 포맷(스타일)을 담당한다.
> 두 도구를 함께 사용하면 충돌 없이 일관된 형식이 유지된다.

---

#### 3. Prettier 설정

`.prettierrc` 예시:

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

##### VSCode 저장 시 자동 포맷

`.vscode/settings.json`

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": ["javascript", "typescript", "typescriptreact"]
}
```

> VSCode에서 저장 시 자동 포맷 + ESLint 검증을 동시에 수행할 수 있다.

---

#### 4. VSCode Debugging 구성

Next.js 15는 Node 기반 서버 실행이므로 VSCode 디버깅을 직접 지원한다.

##### `.vscode/launch.json`

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Next.js Debug",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "port": 9229,
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

> `npm run dev` 명령으로 실행된 서버에 디버거가 자동 연결된다.
> 브라우저 네트워크 탭과 함께 사용하면 SSR/RSC 디버깅이 용이하다.

---

#### 5. 환경 변수 IntelliSense

VSCode는 `.env.local` 파일을 자동 인식하여
`process.env` 접근 시 인텔리센스를 제공한다.

##### 예시

`.env.local`

```
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=postgres://user:pass@localhost:5432/db
```

코드에서:

```ts
console.log(process.env.NEXT_PUBLIC_API_URL);
```

> 클라이언트에서 접근 가능한 변수는 반드시 `NEXT_PUBLIC_` 접두사가 있어야 한다.
> 그렇지 않으면 RSC 빌드 시 에러가 발생한다.

---

#### 6. 디버깅 팁

| 상황               | 원인                     | 해결 방법                                |
| ---------------- | ---------------------- | ------------------------------------ |
| Server Action 오류 | Edge 런타임에서 Node API 호출 | `export const runtime = "nodejs"` 설정 |
| import 에러        | 경로 별칭 불일치              | `tsconfig.json`과 `eslint`의 paths 동기화 |
| 포맷 안됨            | Prettier 확장 미설치        | VSCode → Extensions에서 `Prettier` 설치  |
| RSC 디버깅          | use client 경계 불명확      | 컴포넌트 상단 `"use client"` 추가            |

---

#### 7. CI 환경에서의 정적 분석

GitHub Actions 예시 (`.github/workflows/lint.yml`)

```yaml
name: Lint Check
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
```

> 빌드 전에 ESLint 검사를 통과하지 못하면 자동으로 배포가 차단된다.

---

#### 8. 결론

Next.js 15는 “**개발 생산성과 코드 품질을 동시에 확보**”하는 환경을 기본 제공한다.
TypeScript, ESLint, Prettier, VSCode 통합 설정은
별도 설정 없이 즉시 사용 가능하며, CI 파이프라인에도 쉽게 연동된다.



