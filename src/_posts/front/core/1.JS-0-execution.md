---
title: "javasciprt Execution"
date: 2025-10-17
---

### 요약표

| 범주    | 핵심 포인트                |
| ----- | --------------------- |
| 실행 흐름 | 파싱 → 선언 수집(호이스팅) → 실행 |
| 컨텍스트  | 전역/함수별 독립 공간, 스택으로 관리 |
| 스코프   | 선언 위치 기준 렉시컬 스코프      |
| 호이스팅  | 선언만 위로, TDZ 주의        |
| this  | 호출 방식 따라 결정, 화살표는 상속  |
| 클로저   | 외부 변수 기억·상태 유지        |
| 클래스   | 프로토타입 기반 상속           |

---

#  JavaScript 동작 원리 —

## 1️⃣ 실행 컨텍스트 (Execution Context)

### ▪ 개념

* **JS 코드가 실행되는 환경 정보 묶음**
* 코드가 실행될 때마다 새 컨텍스트가 생성되어 스택(Call Stack)으로 관리됨

### ▪ 종류

| 구분            | 설명                            |
| ------------- | ----------------------------- |
| **전역 컨텍스트**   | 프로그램 시작 시 1개 생성 (앱 종료 시까지 유지) |
| **함수 컨텍스트**   | 함수 호출 시마다 새로 생성               |
| **eval 컨텍스트** | `eval()` 실행 시 임시 생성 (거의 사용 X) |

### ▪ 구성요소

| 구성요소                     | 역할                           |
| ------------------------ | ---------------------------- |
| **Variable Environment** | `var`, 함수 선언 저장 (초기화 포함)     |
| **Lexical Environment**  | `let`, `const`, 외부 스코프 참조 구조 |
| **This Binding**         | 현재 실행 주체(`this`) 정보          |

---

## 2️⃣ 실행 컨텍스트 스택 (Call Stack)

```
[ Global EC ]
[ foo EC ]      ← foo 실행 중
[ bar EC ]      ← bar 실행 중 (Top)
```

* **LIFO 구조**로 관리
* 함수 종료 시 `pop`, 새로운 함수 호출 시 `push`

---

## 3️⃣ 호이스팅 (Hoisting)

> 실행 전, 선언을 메모리에 미리 등록하는 과정
> “선언은 위로 끌어올려지고, 초기화는 실제 실행 시점에”

### ▪ var / let / const / function / class 비교

| 선언 방식           | 호이스팅         | 초기화 시점         | TDZ 발생 | 호출 가능 시점   |
| --------------- | ------------ | -------------- | ------ | ---------- |
| `var`           | ✅            | undefined로 초기화 | ❌      | 선언 전 가능    |
| `let` / `const` | ✅ (선언만)      | 선언문 도달 시       | ✅      | 선언 후 가능    |
| `function`      | ✅ (전체 함수 등록) | 즉시             | ❌      | 선언 전 호출 가능 |
| `class`         | ✅ (선언만)      | 선언문 도달 시       | ✅      | 선언 후만 가능   |

```js
console.log(a); // undefined
var a = 1;

console.log(b); // ❌ ReferenceError
let b = 2;

foo(); // ✅ 함수 선언문은 호출 가능
function foo() {}

new C(); // ❌ ReferenceError
class C {}
```

---

## 4️⃣ 스코프 (Scope)

> 식별자(변수, 함수)가 접근 가능한 유효 범위

### ▪ 종류

| 스코프        | 설명                           |
| ---------- | ---------------------------- |
| **전역 스코프** | 프로그램 전체에서 접근 가능              |
| **함수 스코프** | 함수 내부만 유효 (`var`)            |
| **블록 스코프** | `{}` 내부만 유효 (`let`, `const`) |

```js
if (true) {
  var v = 1;
  let l = 2;
}
console.log(v); // 1
console.log(l); // ❌ ReferenceError
```

---

## 5️⃣ 렉시컬 환경 (Lexical Environment)

> “**어디서 선언되었는가**”로 스코프가 결정된다 (호출 위치 X)

```js
let x = 10;
function foo() { console.log(x); } // 전역 x 사용
function bar() {
  let x = 20;
  foo(); // 10 (정의된 위치 기준)
}
bar();
```

* 함수는 생성 시점의 **외부 스코프 참조(Outer)** 정보를 함께 저장한다.

---

## 6️⃣ 스코프 체인 (Scope Chain)

> 변수 탐색 시 JS가 따르는 경로:
> **현재 스코프 → 상위 스코프 → 전역 스코프**

```js
let a = 1;
function outer() {
  let b = 2;
  function inner() {
    let c = 3;
    console.log(a + b + c);
  }
  inner(); // 6
}
outer();
```

---

## 7️⃣ 클로저 (Closure)

> 함수가 선언될 당시의 **외부 렉시컬 환경을 기억**하여,
> 외부 함수 종료 후에도 그 변수에 접근할 수 있는 구조.

```js
function outer() {
  let counter = 0;
  return function() {
    counter++;
    console.log(counter);
  };
}
const countUp = outer();
countUp(); // 1
countUp(); // 2
```

### ▪ 특징

* 외부 스코프 변수 유지 (상태 저장)
* 데이터 은닉 가능 (private 변수)
* 필요 이상 클로저는 GC 방해 가능 → 참조 해제 필요

---

## 8️⃣ this 바인딩 (This Binding)

> 함수 호출 방식에 따라 `this` 값이 결정된다.

| 호출 방식                     | this 값              |
| ------------------------- | ------------------- |
| 전역 실행 (비엄격)               | `window` / `global` |
| 전역 실행 (엄격)                | `undefined`         |
| 메서드 호출                    | 점(`.`) 앞 객체         |
| 생성자 호출 (`new`)            | 새 인스턴스              |
| `call` / `apply` / `bind` | 명시 지정 객체            |
| 화살표 함수                    | 상위 스코프의 this 상속     |

```js
const obj = {
  name: "Ingeun",
  normal() { console.log(this.name); },
  arrow: () => console.log(this.name)
};
obj.normal(); // "Ingeun"
obj.arrow();  // undefined (전역 this)
```

---

## 9️⃣ 클래스와 프로토타입

> JS 클래스는 문법적 설탕(Syntactic Sugar)으로
> 실제로는 **프로토타입 기반 상속** 구조를 가진다.

```js
class A { say() { console.log("hi"); } }
class B extends A {}
new B().say(); // hi
```

* 메서드는 클래스 본체가 아니라 **프로토타입 객체에 저장**
* 하위 클래스(`extends`)는 상위 프로토타입을 체인으로 연결

---

