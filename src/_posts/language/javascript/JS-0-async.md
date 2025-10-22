---
title: "javasciprt async"
date: 2025-10-17
---

#### 요약표

| 구분              | 키워드                  | 반환값             | 특징               | 주요 목적         |
| --------------- | -------------------- | --------------- | ---------------- | ------------- |
| **Promise**     | `new Promise`        | Promise         | 상태 기반 비동기 제어     | 비동기 결과 관리     |
| **Iterator**    | `Symbol.iterator`    | `{value, done}` | 반복 상태 제어         | 순회 구조 통합      |
| **Generator**   | `function*`, `yield` | Iterator        | 실행 중단·재개 가능      | 지연 평가, 커스텀 반복 |
| **Async/Await** | `async`, `await`     | Promise         | Promise 기반 동기 표현 | 가독성 좋은 비동기 처리 |



## 플로우

<div style="text-align: center;">

```mermaid
%%{init: {
  "theme": "default",
  "flowchart": {
    "htmlLabels": true,
    "curve": "basis",
    "nodeSpacing": 20,
    "rankSpacing": 40,
    "padding": 2
  }
}}%%
flowchart TD
  A["🧩 동기 코드 실행<br/>(Call Stack)"]
  B{"🧭 Stack 비었나?"}
  C["🌀 Microtask 큐 비우기<br/>(Promise.then, queueMicrotask...)"]
  D{"🎨 렌더 필요?"}
  E["🖥️ 렌더링<br/>(레이아웃·페인트)"]
  F["🎞️ requestAnimationFrame<br/>콜백 실행"]
  G["⏰ Macrotask 실행<br/>(setTimeout 등)"]

  A --> B
  B -- "아니오" --> A
  B -- "예" --> C
  C --> D
  D -- "예" --> E
  D -- "아니오" --> F
  E --> F
  F --> G
  G --> B

 ```
 </div>

# 📘 JavaScript 비동기와 반복 구조 정리

## 1. Promise

### 개념

Promise는 **비동기 작업의 결과를 다루는 객체**이다.
아직 완료되지 않은 작업이 미래에 완료되면 그 결과값을 반환하거나, 실패하면 오류를 전달한다.
세 가지 상태를 가진다.

| 상태            | 의미              |
| ------------- | --------------- |
| **pending**   | 수행 중            |
| **fulfilled** | 성공 (resolve 호출) |
| **rejected**  | 실패 (reject 호출)  |

### 사용 원리

Promise는 **콜백 지옥(callback hell)** 문제를 해결하기 위해 등장했다.
비동기 작업이 완료되면 `.then()` 또는 `.catch()`로 결과를 받는다.
Promise 체이닝으로 여러 비동기 작업을 순서대로 연결할 수 있다.

```js
const promise = new Promise((resolve, reject) => {
  const success = true;
  if (success) resolve("성공");
  else reject("실패");
});

promise
  .then(result => console.log(result))   // "성공"
  .catch(error => console.error(error))  // 실패 시 처리
  .finally(() => console.log("끝"));
```

### 요약

* 비동기 작업을 객체화해서 관리한다.
* 콜백보다 가독성이 좋다.
* `.then`, `.catch`, `.finally`로 흐름 제어가 가능하다.

---

## 2. 이터레이션 (Iteration)

### 개념

이터레이션은 **반복 가능한 구조**를 뜻한다.
배열, 문자열, Map, Set 등이 모두 **이터러블(iterable)**이다.
이터러블은 내부적으로 `Symbol.iterator`를 구현한 객체이다.

### 동작 원리

이터러블 객체는 `for...of` 구문이나 전개 연산자(`...`)로 반복할 수 있다.
반복 시 내부적으로 `iterator.next()` 메서드를 호출하여 값을 순차적으로 반환한다.

```js
const arr = [10, 20, 30];
for (const num of arr) {
  console.log(num);
}
```

`arr[Symbol.iterator]()`는 이터레이터(iterator)를 반환하며, 이 이터레이터는 `{ value, done }` 객체를 반환하는 `next()` 메서드를 가진다.

```js
const iterator = arr[Symbol.iterator]();
console.log(iterator.next()); // { value: 10, done: false }
```

### 요약

* **이터러블(iterable)**: 반복 가능한 객체
* **이터레이터(iterator)**: 순회 상태를 관리하는 객체
* `Symbol.iterator`가 핵심 인터페이스이다.

---

## 3. 제너레이터 (Generator)

### 개념

제너레이터는 **함수 실행을 중단하고 재개할 수 있는 함수**이다.
`function*` 키워드를 사용하며, `yield`로 값을 하나씩 반환한다.

```js
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}
const g = gen();
console.log(g.next()); // { value: 1, done: false }
console.log(g.next()); // { value: 2, done: false }
```

### 동작 원리

제너레이터 함수는 호출 시 즉시 실행되지 않고, **이터레이터 객체**를 반환한다.
`next()`가 호출될 때마다 `yield`를 만날 때까지 실행되고 멈춘다.
필요한 시점에 값을 하나씩 계산할 수 있기 때문에 **지연 평가(lazy evaluation)** 가 가능하다.

### `yield`를 통한 값 주고받기

`yield`는 단순히 값을 내보내는 역할뿐 아니라, 외부에서 값을 다시 받아올 수도 있다.

```js
function* counter() {
  let count = 0;
  while (true) {
    const reset = yield count++;
    if (reset) count = 0;
  }
}
const c = counter();
console.log(c.next().value);  // 0
console.log(c.next().value);  // 1
console.log(c.next(true).value); // 0 (reset)
```

### 요약

* 실행 중단과 재개가 가능한 함수이다.
* 이터레이터를 반환한다.
* 비동기 제어 흐름과 궁합이 좋다.

---

## 4. Async / Await

### 개념

`async`와 `await`는 **Promise 기반 비동기 코드를 동기처럼 작성**하게 해준다.
`async` 함수는 항상 **Promise를 반환**하며, 내부에서 `await`를 사용해 비동기 결과를 기다릴 수 있다.

```js
async function fetchData() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  const data = await res.json();
  console.log(data);
}
fetchData();
```

### 동작 원리

1. `async` 함수는 자동으로 Promise를 반환한다.
2. `await`는 Promise가 완료될 때까지 실행을 일시 중단한다.
3. 완료되면 그 결과값을 반환한다.
4. 예외가 발생하면 `try...catch`로 처리한다.

```js
async function test() {
  try {
    const data = await Promise.resolve("성공");
    console.log(data);
  } catch (err) {
    console.error(err);
  } finally {
    console.log("끝");
  }
}
test();
```

### 요약

* `async` 함수는 Promise를 반환한다.
* `await`는 Promise가 완료될 때까지 기다린다.
* 코드 흐름이 동기처럼 보이지만 내부적으로는 비동기이다.

---

## 5. 제너레이터 vs Async 함수

| 구분    | 제너레이터                | Async 함수                          |
| ----- | -------------------- | --------------------------------- |
| 반환값   | 이터레이터                | Promise                           |
| 중단/재개 | 가능 (`yield`)         | 불가 (`await`는 일시 중단)               |
| 실행 방식 | 수동 (`next()` 호출 필요)  | 자동 (`await`로 중단, Promise 완료 시 재개) |
| 주 사용처 | 반복 처리, 데이터 스트림       | 비동기 로직 제어                         |
| 표현 방식 | `function*`, `yield` | `async`, `await`                  |

---

## 6. 동작 플로우 요약

```mermaid
flowchart TD
    A[Promise 생성] --> B[비동기 작업 실행]
    B --> C{성공/실패?}
    C -->|resolve| D[fulfilled → then() 실행]
    C -->|reject| E[rejected → catch() 실행]
    D --> F[finally() 호출 후 종료]
    E --> F

    subgraph "Async/Await 흐름"
        G[async 함수 호출] --> H[await Promise 대기]
        H --> I[Promise resolve 시 다음 코드 실행]
        I --> J[try/catch로 예외 처리]
    end
```

---
