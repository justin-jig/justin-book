---
title: "javasciprt event"
date: 2025-10-17
---

#### 요약

| 구분                             | 설명                      |
| ------------------------------ | ----------------------- |
| **캡처링(Capturing)**             | 상위 요소 → 하위 요소로 전파       |
| **타깃(Target)**                 | 이벤트 실제 발생 지점            |
| **버블링(Bubbling)**              | 하위 요소 → 상위 요소로 전파       |
| **이벤트 위임**                     | 부모 요소에서 하위 요소 이벤트 통합 처리 |
| **event.target**               | 이벤트 발생한 실제 요소           |
| **event.currentTarget**        | 리스너가 바인딩된 요소            |
| **stopPropagation()**          | 상위 전파 차단                |
| **stopImmediatePropagation()** | 다른 리스너까지 실행 차단          |

---
#### 📚 참고 문서

| 문서                                 | 링크                                                                                                                                                             |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MDN Web Docs - Event               | [https://developer.mozilla.org/ko/docs/Web/API/Event](https://developer.mozilla.org/ko/docs/Web/API/Event)                                                     |
| MDN - Event bubbling and capturing | [https://developer.mozilla.org/ko/docs/Learn/JavaScript/Building_blocks/Events](https://developer.mozilla.org/ko/docs/Learn/JavaScript/Building_blocks/Events) |
| W3C DOM Level 3 Events Spec        | [https://www.w3.org/TR/DOM-Level-3-Events/](https://www.w3.org/TR/DOM-Level-3-Events/)                                                                         |
| JavaScript.info - Event Bubbling   | [https://javascript.info/bubbling-and-capturing](https://javascript.info/bubbling-and-capturing)                                                               |

---


# JavaScript 이벤트 시스템 정리

## 1. 이벤트(Event)란?

**이벤트(Event)**는
사용자나 브라우저가 발생시키는 **상호작용 또는 동작 신호**이다.
클릭(click), 키 입력(keydown), 스크롤(scroll), 포커스(focus), 로드(load) 등 다양한 형태가 존재한다.

자바스크립트는 이러한 이벤트를 **이벤트 리스너(Event Listener)**를 통해 감지하고,
감지된 이벤트에 따라 동작을 수행하는 **이벤트 기반(reactive) 프로그래밍 모델**을 가진다.

```
[Capturing Phase] ↓
window → document → html → body → parent → child(target)
                         ↑
       [Bubbling Phase] ←
```

---

## 2. 이벤트 흐름(Event Flow)

표준 DOM(Event Model)에 따르면, 이벤트는 **3단계 흐름**을 가진다.

| 단계                               | 설명                                         |
| -------------------------------- | ------------------------------------------ |
| **1️⃣ 캡처링 단계 (Capturing Phase)** | 이벤트가 최상위(root) 요소에서 시작해 **하위 요소로 전파**되는 단계 |
| **2️⃣ 타깃 단계 (Target Phase)**     | 이벤트가 실제 **대상 요소(Target Element)**에 도달하는 단계 |
| **3️⃣ 버블링 단계 (Bubbling Phase)**  | 이벤트가 **상위 요소로 다시 전파**되는 단계                 |

> 이벤트는 기본적으로 **버블링 단계**에서 동작하지만,
> `addEventListener`의 세 번째 인자를 `true`로 설정하면 **캡처링 단계**에서 감지할 수 있다.

---

## 3. 이벤트 버블링 (Event Bubbling)

이벤트가 하위 요소에서 발생했을 때,
그 이벤트가 상위 요소로 **계층적으로 전파되는 현상**을 말한다.

```html
<form onclick="alert('FORM')">
  <div onclick="alert('DIV')">
    <p onclick="alert('P')">P</p>
  </div>
</form>
```

* 위 예제에서 `p` 요소를 클릭하면 → **P → DIV → FORM** 순서로 이벤트가 전파된다.
* 이는 DOM 구조상 부모 요소로 이벤트가 버블링되기 때문이다.

> ⚠️ 장점: 상위 요소에서 하위 요소의 이벤트를 한 번에 관리 가능
> ⚠️ 단점: 의도치 않은 이벤트 중복 실행 가능

---

## 4. 이벤트 위임 (Event Delegation)

**이벤트 위임**은 다수의 하위 요소 각각에 리스너를 등록하는 대신,
**공통 상위 요소(부모 요소)** 하나에만 이벤트 리스너를 등록하는 방식이다.

```html
<ul id="parent-list">
  <li id="post-1">Item 1</li>
  <li id="post-2">Item 2</li>
  <li id="post-3">Item 3</li>
</ul>

<script>
document.getElementById("parent-list").addEventListener("click", function(e) {
  if (e.target && e.target.nodeName === "LI") {
    console.log("List item", e.target.id, "was clicked!");
  }
});
</script>
```

**장점**

1. 메모리 사용량 감소 (리스너 1개로 다수의 자식 관리)
2. 동적으로 추가된 요소도 자동으로 이벤트 처리 가능
3. 유지보수성과 성능 향상

---

## 5. 이벤트 객체 (Event Object)

이벤트 발생 시 브라우저는 자동으로 `event` 객체를 생성하며,
이 객체에는 이벤트 관련 정보가 포함된다.

| 프로퍼티                  | 설명                                   |
| --------------------- | ------------------------------------ |
| `event.target`        | 이벤트가 실제로 발생한 요소                      |
| `event.currentTarget` | 이벤트 핸들러가 등록된 현재 요소                   |
| `event.eventPhase`    | 이벤트의 현재 단계 (1: 캡처링 / 2: 타깃 / 3: 버블링) |
| `event.type`          | 발생한 이벤트 종류 (예: `click`, `keydown`)   |
| `event.timeStamp`     | 이벤트 발생 시각(ms 단위)                     |

> `target`은 “실제 클릭된 곳”,
> `currentTarget`은 “리스너가 붙어 있는 곳”을 의미한다.

---

## 6. 이벤트 전파 제어

이벤트 흐름은 기본적으로 상·하위 요소로 전파되지만,
특정 상황에서는 전파를 막아야 할 때가 있다.

| 메서드                                    | 설명                       |
| -------------------------------------- | ------------------------ |
| **`event.stopPropagation()`**          | 상위 요소로의 버블링만 차단          |
| **`event.stopImmediatePropagation()`** | 동일 요소 내의 다른 핸들러까지 모두 차단  |
| **`event.preventDefault()`**           | 기본 동작(예: 링크 이동, 폼 제출) 차단 |

```js
element.addEventListener("click", (e) => {
  e.stopPropagation();   // 상위 전파 차단
  e.preventDefault();    // 기본 이벤트 방지
});
```

> 예: `<a href="#">`를 클릭해도 페이지 이동이 발생하지 않게 함

---

## 7. 이벤트 리스너 관리

### 등록

```js
element.addEventListener("click", handler, useCapture);
```

* `useCapture` → `true`이면 **캡처링 단계**, `false`이면 **버블링 단계**에서 감지
* 동일 요소에 여러 개의 리스너 등록 가능

### 제거

```js
element.removeEventListener("click", handler);
```

* 등록할 때 사용한 **함수 참조**가 동일해야 제거 가능

---

## 8. 이벤트 관련 고급 개념

| 개념                    | 설명                                                                       |
| --------------------- | ------------------------------------------------------------------------ |
| **Passive Event**     | `addEventListener("scroll", handler, { passive: true })` 사용 시, 스크롤 성능 향상 |
| **Once 옵션**           | `{ once: true }` 설정 시 이벤트 1회만 실행 후 자동 제거                                 |
| **CustomEvent**       | `new CustomEvent("myevent", { detail: { ... }})` 로 사용자 정의 이벤트 생성 가능      |
| **Dispatching Event** | `element.dispatchEvent(customEvent)` 으로 직접 이벤트 발생 가능                     |

---
