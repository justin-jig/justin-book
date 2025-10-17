---
title: "javasciprt overview"
date: 2025-10-17
---

### 📘 요약

> 자바스크립트는 웹의 ‘언어’에서 시작해,
> 오늘날에는 **클라우드, AI, IoT까지 아우르는 범용 프로그래밍 언어**로 진화했다.
> ECMA 표준화를 통해 매년 개선되고 있으며, V8과 같은 고성능 엔진의 등장으로
> 브라우저를 넘어 서버, 모바일, 임베디드 환경에서도 핵심 언어로 자리 잡았다.

---

# 🌍 JavaScript Overview

## 1. 탄생 배경

자바스크립트(JavaScript)는 **1995년 넷스케이프 커뮤니케이션즈(Netscape Communications)**가
웹페이지에 **동적 기능을 추가하기 위해 개발한 경량 스크립트 언어**이다.

* **개발자:** 브렌던 아이크(Brendan Eich)
* **초기 이름:** Mocha → LiveScript → JavaScript (1996년 12월 최종 명명)
* **목적:** HTML과 CSS만으로는 부족했던 **브라우저 내 상호작용 기능** 구현
* **특징:** 브라우저에서 직접 실행되는 인터프리터 언어, 플랫폼 독립적

---

## 2. 역사적 흐름

초창기 자바스크립트는 HTML 페이지 내 보조적인 역할에 머물렀지만,
AJAX, SPA, Node.js 등 기술 발전을 통해 오늘날에는 **프론트엔드·백엔드·모바일·IoT까지 확장된 범용 언어**로 발전했다.

| 시기        | 주요 변화                         | 특징                                          |
| --------- | ----------------------------- | ------------------------------------------- |
| 1995      | Netscape Navigator 2.0        | Mocha → LiveScript → JavaScript             |
| 1996      | Microsoft JScript (IE 3.0 탑재) | 표준화 필요성 대두                                  |
| 1997      | ECMA-262 표준 확정 (ES1)          | ECMAScript 1 공개                             |
| 2009      | ES5 등장                        | JSON, Strict Mode 도입                        |
| 2015      | ES6(ES2015)                   | 클래스, 모듈, 화살표함수, Promise 등 대규모 개정            |
| 2017~2020 | ES7~ES11                      | async/await, optional chaining, BigInt 등 추가 |

> ⚙️ *Rendering Flow*
>
> * **SSR(Server Side Rendering):** 서버에서 HTML 생성 후 전달
> * **CSR(Client Side Rendering):** 브라우저가 JS를 실행해 DOM 렌더링

---

## 3. 표준화 과정 (ECMAScript)

| 버전              | 연도                                                 | 주요 특징 |
| --------------- | -------------------------------------------------- | ----- |
| **ES1 (1997)**  | 최초 표준                                              |       |
| **ES3 (1999)**  | 정규표현식, try/catch                                   |       |
| **ES5 (2009)**  | JSON, Strict mode, Array 고차 함수                     |       |
| **ES6 (2015)**  | 클래스, 모듈(import/export), 화살표 함수, let/const, Promise |       |
| **ES7 (2016)**  | `**` 연산자, `includes()`                             |       |
| **ES8 (2017)**  | async/await                                        |       |
| **ES9 (2018)**  | Object spread, async generator                     |       |
| **ES10 (2019)** | flat/flatMap, optional catch                       |       |
| **ES11 (2020)** | BigInt, globalThis, null 병합, 옵셔널 체이닝               |       |

---

## 4. 주요 자바스크립트 엔진

| 엔진명                        | 제작사/특징             | 비고                          |
| -------------------------- | ------------------ | --------------------------- |
| **V8**                     | Google             | Chrome, Node.js 기반, JIT 컴파일 |
| **SpiderMonkey**           | Mozilla            | 최초의 JS 엔진, Firefox 사용       |
| **JavaScriptCore (Nitro)** | Apple              | Safari, WebKit 기반           |
| **Chakra (JScript9)**      | Microsoft          | IE11, Edge(구버전) 사용          |
| **Rhino**                  | Mozilla Foundation | 자바 기반 엔진                    |
| **Nashorn**                | Oracle             | JVM 내장형 JS 엔진               |
| **JerryScript**            | Samsung            | IoT 기기용 초경량 엔진              |

---

## 5. 자바스크립트 기반 구조

| 구분                              | 설명                                         |
| ------------------------------- | ------------------------------------------ |
| **DOM (Document Object Model)** | HTML 문서 구조를 객체로 표현                         |
| **BOM (Browser Object Model)**  | 브라우저 자체 제어(window, history 등)              |
| **Canvas / SVG**                | 2D/3D 그래픽, 벡터 그래픽 처리                       |
| **XMLHttpRequest / fetch**      | 서버와의 비동기 통신 (AJAX)                         |
| **Web Storage**                 | localStorage, sessionStorage (브라우저 영구 저장소) |
| **Web Worker**                  | 백그라운드 스레드 실행                               |
| **Web Components**              | 커스텀 엘리먼트 기반 재사용 가능한 UI 구성                  |

---

## 6. 자바스크립트의 영향과 확장

| 분야          | 대표 기술                    |
| ----------- | ------------------------ |
| **프론트엔드**   | React, Vue.js, Angular   |
| **백엔드**     | Node.js, Express, NestJS |
| **모바일**     | React Native, Ionic      |
| **데스크탑**    | Electron                 |
| **머신러닝/AI** | TensorFlow.js            |
| **게임/그래픽**  | Three.js, Babylon.js     |
| **IoT**     | JerryScript, Espruino    |

---

## 7. 공식 문서 및 참고 사이트

| 구분                                 | 링크                                                                                                                                                             |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ECMAScript 공식 표준 (ECMA-262)**    | [https://ecma-international.org/publications-and-standards/standards/ecma-262/](https://ecma-international.org/publications-and-standards/standards/ecma-262/) |
| **MDN Web Docs (Mozilla)**         | [https://developer.mozilla.org/ko/docs/Web/JavaScript](https://developer.mozilla.org/ko/docs/Web/JavaScript)                                                   |
| **W3C Web APIs**                   | [https://www.w3.org/TR/DOM-Level-3-Core/](https://www.w3.org/TR/DOM-Level-3-Core/)                                                                             |
| **Node.js 공식문서**                   | [https://nodejs.org/docs/latest/api/](https://nodejs.org/docs/latest/api/)                                                                                     |
| **TC39 GitHub (ECMAScript 제안 관리)** | [https://github.com/tc39/proposals](https://github.com/tc39/proposals)                                                                                         |
| **Can I use** (브라우저 호환성)           | [https://caniuse.com](https://caniuse.com)                                                                                                                     |
| **JavaScript Info 튜토리얼**           | [https://javascript.info](https://javascript.info)                                                                                                             |

---
