---
title: "성능 및 운영 최적화 — 이미지, 폰트, 캐싱, 프로파일링"
date: 2025-10-24
---
**Next.js 15 / React 19 기준 문서**
#### 요약

Next.js는 성능 최적화를 위해 **이미지/폰트 최적화, 캐싱 전략, Web Vitals 기반 모니터링**을 기본 제공한다.  
빌드 시 정적 분석과 런타임 캐시를 결합해 **렌더링 성능·TTFB·LCP·CLS**를 개선한다.

- `<Image>`와 `<Font>` 컴포넌트로 자산 최적화  
- CDN·Header 기반 캐싱 전략 지원  
- React Profiler 및 Next.js Web Vitals API 내장  
- 정적/동적 구분 기반 캐시 자동 관리  
- 파이프라인 성능 로깅 및 분석 툴 통합  

> 요약 정리:  
> Next.js는 프레임워크 수준에서 자산·렌더링·네트워크 성능을 자동 최적화하며,  
> 개발자는 “코드 작성만으로 성능 지표를 충족”시킬 수 있다.
> 성능 최적화는 별도의 옵션이 아닌 Next.js의 기본 동작이다.
> 각 단계별 최적화를 이해하면 대규모 앱에서도 **95점 이상의 Lighthouse 점수**를 안정적으로 유지할 수 있다.

##### 참고자료  
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)  
- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)  
- [Web Vitals](https://nextjs.org/docs/app/building-your-application/optimizing/monitoring)  
- [Caching Strategies](https://nextjs.org/docs/app/building-your-application/optimizing/caching)  
- [React Profiler](https://react.dev/reference/react/Profiler)

---

#### 1. 이미지 최적화 (Image Optimization)

Next.js의 `<Image>` 컴포넌트는 **자동 리사이징, 포맷 변환, Lazy Loading**을 제공한다.

##### 예시

```tsx
import Image from "next/image";

export default function Profile() {
  return (
    <Image
      src="/images/avatar.png"
      alt="Profile"
      width={200}
      height={200}
      priority
    />
  );
}
```

| 속성                   | 설명                      |
| -------------------- | ----------------------- |
| `src`                | 이미지 경로 (로컬/원격 모두 지원)    |
| `width`, `height`    | 레이아웃 시 필수 (CLS 방지)      |
| `priority`           | Above-the-fold 영역 우선 로드 |
| `placeholder="blur"` | 블러 로딩 효과                |
| `quality`            | 압축률 (기본 75)             |

##### 외부 이미지 도메인 허용

`next.config.js` 예시:

```js
module.exports = {
  images: {
    domains: ["cdn.example.com", "images.unsplash.com"],
  },
};
```

> 이미지 최적화는 **빌드 시가 아니라 요청 시 서버에서 동적 변환**된다.
> 배포 환경에서는 CDN 또는 Vercel Image Optimization Layer를 활용해야 한다.

---

#### 2. 폰트 최적화 (Font Optimization)

Next.js 15에서는 **`next/font`** 패키지가 기본 내장되어
Google Fonts, Local Fonts를 모두 빌드 타임에 자동 최적화한다.

##### Google Fonts

```tsx
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }) {
  return <div className={inter.className}>{children}</div>;
}
```

##### Local Fonts

```tsx
import localFont from "next/font/local";
const myFont = localFont({ src: "./MyFont.woff2" });
```

| 항목            | 설명                             |
| ------------- | ------------------------------ |
| **자동 서브셋 생성** | 사용 문자만 포함                      |
| **FOIT 방지**   | CSS `font-display: swap` 기본 적용 |
| **빌드 시 로컬화**  | 폰트 다운로드 불필요                    |

> Next.js 15부터는 `<link href="https://fonts.googleapis.com...">` 방식이 권장되지 않는다.
> 대신 `next/font`로 로컬 번들링하는 것이 SEO·성능 모두 유리하다.

---

#### 3. 캐싱 전략 (Caching Strategies)

Next.js는 **HTTP 헤더 + fetch 캐시 + ISR 재검증**을 결합하여 캐시를 관리한다.

| 캐시 계층       | 위치         | 설명                        |
| ----------- | ---------- | ------------------------- |
| **브라우저 캐시** | 클라이언트      | `Cache-Control` 헤더에 의한 캐싱 |
| **CDN 캐시**  | 엣지 노드      | 정적 파일 자동 캐싱               |
| **서버 캐시**   | Node 런타임   | fetch / revalidate 기반 캐싱  |
| **데이터 캐시**  | DB/Redis 등 | 개발자 구성 영역                 |

##### Header 기반 제어 예시

```ts
export async function GET() {
  return new Response("ok", {
    headers: {
      "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
    },
  });
}
```

##### Static vs Dynamic

| 유형                | 특징           | 캐시 가능성              |
| ----------------- | ------------ | ------------------- |
| **Static Route**  | 빌드 시 HTML 생성 | ✅ 영구 캐시             |
| **ISR Route**     | 주기적 재생성      | ✅ 재검증 주기 반영         |
| **Dynamic Route** | 런타임 실행       | ❌ 캐시 비활성 (no-store) |

> 캐싱 전략의 목표는 “서버 부하를 줄이면서, 데이터 최신성을 유지”하는 것이다.

---

#### 4. 성능 분석 (Profiling & Analytics)

##### React Profiler

React Profiler를 통해 컴포넌트 렌더링 시간을 시각적으로 분석할 수 있다.

```tsx
import { Profiler } from "react";

export default function App() {
  const callback = (id, phase, actualDuration) =>
    console.log(`${id} (${phase}): ${actualDuration}ms`);

  return (
    <Profiler id="Main" onRender={callback}>
      <Page />
    </Profiler>
  );
}
```

##### Web Vitals 측정

Next.js는 `next/script` 기반으로 Google Analytics 또는 자체 Web Vitals를 수집할 수 있다.

```tsx
export function reportWebVitals(metric) {
  console.log(metric);
}
```

| 지표       | 설명                                   |
| -------- | ------------------------------------ |
| **LCP**  | Largest Contentful Paint (콘텐츠 표시 속도) |
| **FID**  | First Input Delay (반응성)              |
| **CLS**  | Cumulative Layout Shift (레이아웃 안정성)   |
| **TTFB** | Time To First Byte (응답 지연)           |

> Web Vitals 데이터는 Vercel Analytics 또는 Lighthouse에서도 동일한 기준으로 수집된다.

---

#### 5. 파이프라인 최적화

빌드 및 배포 파이프라인에서 성능을 유지하기 위한 주요 지침:

| 영역        | 전략             | 설명                          |
| --------- | -------------- | --------------------------- |
| **이미지**   | CDN 활용         | Image Optimization Layer 구성 |
| **폰트**    | Local Bundle   | Google Fonts 직접 포함          |
| **캐시**    | Tag 기반 재검증     | revalidateTag()로 최소 범위 무효화  |
| **로깅**    | Web Vitals     | TTFB, LCP 수집 및 경고 알림        |
| **프로파일링** | React Profiler | 병목 구간 분석                    |

```mermaid
flowchart LR
  A["빌드 (next build)"] --> B["정적 분석 (tree-shaking)"]
  B --> C["자산 최적화 (이미지/폰트)"]
  C --> D["캐시 레이어 적용"]
  D --> E["Web Vitals 모니터링"]
```

---

#### 6. 운영 모니터링 (Ops)

Next.js는 성능 지표를 **CI/CD 및 모니터링 도구**와 통합 가능하다.

* **Vercel Analytics**: 기본 Web Vitals 수집
* **Datadog / NewRelic / Sentry**: 외부 모니터링 연동
* **Lighthouse CI**: 성능 기준 자동 검증

##### 예시: Sentry 통합

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

> 배포 시점마다 자동으로 성능/에러 데이터를 수집하여
> LCP, FID, 오류율을 트래킹할 수 있다.

---

#### 7. 결론

Next.js 15는 “**빌드부터 배포까지 자동 성능 최적화**”를 지향한다.
이미지·폰트 최적화, 캐시 관리, Web Vitals 측정이 모두 내장되어
개발자는 성능 튜닝에 집중하지 않아도 된다.



