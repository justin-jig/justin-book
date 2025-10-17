---
title: "javasciprt performance"
date: 2025-10-17
---


#### 성능 분석 절차 요약 (실무용)

| 단계      | 도구          | 주요 분석 포인트         |
| ------- | ----------- | ----------------- |
| **1단계** | Performance | JS 실행 / 렌더링 병목    |
| **2단계** | Lighthouse  | 종합 점수 / 개선 제안     |
| **3단계** | Memory      | 누수 / 클로저 / DOM 잔류 |
| **4단계** | Network     | 응답 속도 / 캐시 정책     |
| **5단계** | Coverage    | 미사용 코드 탐색         |

---
#### 핵심 요약

| 범주       | 주요 포인트                | 설명                |
| -------- | --------------------- | ----------------- |
| **코드**   | 반복 최소, 캐싱             | 연산 비용 줄이기         |
| **렌더링**  | DOM 변경 최소             | Reflow/Repaint 방지 |
| **비동기**  | 병렬 처리                 | Promise.all 활용    |
| **메모리**  | GC 친화적                | WeakMap, null 초기화 |
| **네트워크** | 캐시, 압축                | CDN, Lazy load    |
| **분석 툴** | DevTools / Lighthouse | 병목 원인 시각화         |

---

#  JavaScript 성능 최적화 & 분석 가이드 

## 1. 엔진 레벨 성능 이해

### V8 엔진 구조

자바스크립트는 **인터프리터 + JIT 컴파일러** 구조로 동작한다.
V8 엔진의 주요 흐름은 다음과 같다.

```
소스 코드
 └─ 파싱(Parsing) → AST 생성
     └─ Ignition (바이트코드 인터프리터)
         └─ TurboFan (JIT 최적화, 네이티브 코드)
```

* **Ignition**: 빠른 시작, 느린 실행
* **TurboFan**: 반복 호출되는 코드를 기계어로 변환
* 코드가 일정 횟수 이상 실행되면 JIT 컴파일러가 최적화 수행
  → 실행 횟수가 많을수록 점점 빨라지는 구조다.

---

## 2. 코드 레벨 최적화

### 반복문

반복문 내에서 연산/속성 접근은 최소화한다.

```js
const len = arr.length;
for (let i = 0; i < len; i++) console.log(arr[i]);
```

### 객체 복사

스프레드 연산자는 비용이 크므로 빈번히 사용하지 않는다.

```js
// ❌ 매번 새 객체 생성
const newObj = { ...oldObj, a: 1 };

// ✅ 필요할 때만 업데이트
oldObj.a = 1;
```

### 클로저와 스코프

불필요한 클로저는 GC가 해제하지 못해 메모리 사용량을 증가시킨다.

---

## 3. 렌더링 성능 최적화

### Reflow / Repaint 최소화

DOM 변경은 묶어서 처리한다.
가능하면 **Virtual DOM / DocumentFragment** 를 활용한다.

| 단계            | 의미       | 발생 조건                |
| ------------- | -------- | -------------------- |
| **Reflow**    | 레이아웃 계산  | DOM 구조·크기 변경         |
| **Repaint**   | 픽셀 다시 그림 | 색상·배경 변경             |
| **Composite** | GPU 합성   | transform, opacity 등 |

```js
// ❌ 강제 reflow 반복
div.style.width = div.offsetWidth + 10 + "px";

// ✅ 캐싱 후 한 번만 변경
const width = div.offsetWidth;
div.style.width = width + 10 + "px";
```

---

## 4. 비동기 처리 성능

### Promise 병렬 처리

```js
await Promise.all([fetchA(), fetchB(), fetchC()]);
```

### async/await 주의

짧은 코드에서 `await`는 오히려 오버헤드가 된다.
동기 로직에는 사용하지 않는다.

---

## 5. 메모리 관리 & 가비지 컬렉션

### Mark and Sweep 원리

1. Root에서 참조 가능한 객체에 mark 표시
2. 도달 불가능한 객체 해제(sweep)

### 메모리 누수 원인

* 전역 변수 유지
* 이벤트 리스너 해제 누락
* 클로저 남용
* 캐시 누적 (Map, 배열)

```js
// ❌ 누수 예시
function leak() {
  const big = new Array(100000).fill(0);
  window.ref = () => console.log(big);
}
```

**해결책**

* 참조 해제: `ref = null`
* WeakMap / WeakSet 사용
* 이벤트 해제 습관화

---

## 6. 데이터 구조 선택

| 구조      | 탐색   | 삽입   | 삭제    | 특징      |
| ------- | ---- | ---- | ----- | ------- |
| Array   | O(n) | O(n) | O(n)  | 순서 유지   |
| Set     | O(1) | O(1) | O(1)  | 중복 없음   |
| Map     | O(1) | O(1) | O(1)  | 키-값 구조  |
| WeakMap | O(1) | O(1) | 자동 GC | 메모리 효율적 |

---

## 7. 네트워크 & 이벤트 성능

### Debounce / Throttle

```js
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
```

* **Debounce**: 입력 종료 후 실행 (검색창 등)
* **Throttle**: 일정 주기마다 실행 (스크롤 이벤트 등)

### 캐싱

* `Cache-Control`, `ETag` 헤더 활용
* `IndexedDB` / `localStorage` 로 데이터 캐시

---

## 8. 엔진 친화 코드 스타일

| 항목      | 권장 방식                       |
| ------- | --------------------------- |
| 상수      | `const` 사용                  |
| 객체 생성   | 리터럴 `{}`                    |
| 배열 생성   | `[]`, 크기 고정시 `new Array(n)` |
| 문자열 결합  | 템플릿 리터럴 `` `${}` ``         |
| JSON 처리 | `JSON.parse/stringify`      |
| DOM 접근  | 캐싱 후 재사용                    |
| 이벤트 처리  | Event Delegation            |

---

## 9. JS 이벤트 루프 & 태스크 순서

```
Call Stack → Microtask Queue → Macrotask Queue
```

* **Microtask**: Promise, MutationObserver
* **Macrotask**: setTimeout, I/O

```js
console.log("1");
setTimeout(() => console.log("2"));
Promise.resolve().then(() => console.log("3"));
console.log("4");
// 결과: 1 → 4 → 3 → 2
```

---

## 10. 모듈 및 빌드 성능

| 전략                 | 설명                     |
| ------------------ | ---------------------- |
| **Tree Shaking**   | 사용되지 않는 코드 제거 (ESM 기반) |
| **Lazy Loading**   | 필요한 시점에 모듈 동적 import   |
| **Code Splitting** | 큰 번들을 기능별로 분할          |
| **Minify/Uglify**  | 불필요한 공백/주석 제거          |

```js
const module = await import("./chart.js");
```

---

# 🧭 성능 분석 단계별 DevTools 활용

## 1. Performance 탭 (렌더링/CPU 분석)

**목적:** 브라우저에서 발생하는 모든 연산과 렌더링 비용을 시각적으로 분석한다.

### 절차

1. DevTools 열기 (F12 → Performance)
2. "Record" 클릭 후 페이지 동작 수행
3. "Stop" → 타임라인 분석

   * **Main**: JS 실행 시간
   * **Rendering**: Reflow/Repaint
   * **GPU**: 합성 단계
   * **Frames**: FPS 확인 (초당 60프레임 유지가 목표)

### 주요 지표

| 지표            | 의미              |
| ------------- | --------------- |
| **Scripting** | JS 실행 시간        |
| **Rendering** | 스타일 계산 + Layout |
| **Painting**  | 픽셀 그리기          |
| **Idle**      | 대기 시간           |

> **Tip:** 긴 파란색(스크립트 실행)이 많다면 JS 병목,
> 긴 녹색(Rendering)은 DOM 업데이트 과다를 의미한다.

---

## 2. Lighthouse (종합 성능 리포트)

**목적:** 페이지 성능, 접근성, SEO를 자동 점수화
→ 실제 사용자 기준(Core Web Vitals)에 맞춘 최적화 포인트 제시

### 실행 방법

1. DevTools → Lighthouse 탭
2. 카테고리 선택: Performance / Best Practices / SEO
3. “Analyze page load” 실행

### 주요 지표

| 항목                                 | 의미             |
| ---------------------------------- | -------------- |
| **LCP (Largest Contentful Paint)** | 주요 콘텐츠 로딩 속도   |
| **FID (First Input Delay)**        | 사용자 입력 반응성     |
| **CLS (Cumulative Layout Shift)**  | 시각적 안정성        |
| **TTI (Time to Interactive)**      | 완전한 상호작용 가능 시점 |

→ 성능 90점 이상을 목표로 한다.

**추천 조치**

* 이미지 lazy-loading
* JS 번들 크기 축소
* 캐시 정책 개선 (`Cache-Control`)
* Critical CSS 인라인화

---

## 3. Memory 탭 (메모리 누수 분석)

**목적:** 메모리 증가 추이를 추적하고 누수 원인 탐색

### 절차

1. DevTools → Memory 탭
2. **Heap Snapshot** 촬영

   * 불필요한 객체, detach된 DOM, 클로저 점검
3. GC 후 다시 Snapshot → 비교 분석

   * “Retained Size”가 큰 객체는 누수 의심 대상

### 참고 지표

| 유형                      | 설명              |
| ----------------------- | --------------- |
| **Heap Snapshot**       | 전체 메모리 상태 스냅샷   |
| **Allocation sampling** | 할당 빈도/위치 추적     |
| **Garbage collection**  | 사용 안 된 객체 해제 확인 |

**누수 원인 예시**

```js
document.querySelector("#btn").addEventListener("click", () => {
  console.log(document.querySelector("#app")); // DOM 참조 유지
});
```

> DOM이 제거되어도 이벤트 리스너가 남아 있으면 GC 불가

---

## 4. Network 탭 (로딩 성능)

**목적:** 리소스 요청/응답 속도 및 병목 구간 확인

### 확인 항목

| 항목                    | 의미          |
| --------------------- | ----------- |
| **TTFB**              | 서버 첫 응답 시간  |
| **Content Download**  | 리소스 전송 시간   |
| **Blocking/Queueing** | 요청 대기       |
| **Initiator**         | 요청을 발생시킨 코드 |
| **Size/Time**         | 전송량, 소요 시간  |

**최적화 팁**

* gzip/brotli 압축 사용
* CDN을 통한 정적 리소스 제공
* HTTP/2 다중 요청 활용

---

## 5. Coverage 탭 (코드 사용률 분석)

**목적:** 실제로 사용되지 않는 JS/CSS 파일을 식별
→ Tree shaking 효율 검증

### 사용법

1. DevTools → Coverage 탭
2. "Reload" 클릭
3. 각 스크립트의 사용률(%) 확인

   * 빨간색: 미사용 코드
   * 초록색: 실행된 코드

> 사용률이 낮은 모듈은 Lazy load 또는 코드 분할 대상이다.

---
