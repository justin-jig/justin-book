---
title: "Python 문법 구조 및 데이터 타입 (Syntax & Data Types)"
date: 2025-10-28
---

#### 요약
- 본 문서는 Python 언어의 기본 문법 구조와 **데이터 타입 시스템의 작동 방식**을 설명한다.  
- 변수 선언, 스코프, 불변(Immutable)과 가변(Mutable) 객체,  
  그리고 Python의 **동적 타이핑(Dynamic Typing)** 및 **타입 힌트(Type Hint)** 시스템을 다룬다.  
- 목표는 **실무에서 안전하고 예측 가능한 코드 작성**을 위한 타입 이해와 활용 능력을 확보하는 것이다.

##### 참고자료
- [Python 공식 문서 – Data Model](https://docs.python.org/3/reference/datamodel.html)
- [PEP 484 – Type Hints](https://peps.python.org/pep-0484/)
- [Real Python – Variables and Data Types](https://realpython.com/python-data-types/)

---

#### 1. Python 문법 개요

Python은 **들여쓰기(Indentation)** 로 블록을 구분하며,  
세미콜론(;) 대신 줄바꿈으로 문장을 구분한다.

##### (1) 코드 구조 예시
```python
def greet(name):
    if name:
        print(f"Hello, {name}")
    else:
        print("Hello, World")
```

##### (2) 주요 문법 특징

| 항목              | 설명                            |
| --------------- | ----------------------------- |
| **공백 기반 문법**    | 들여쓰기로 블록 정의 (4 spaces 권장)     |
| **세미콜론 불필요**    | 줄 단위 문장 구분                    |
| **명시적 Self 전달** | 클래스 메서드 첫 인수로 `self` 필요       |
| **Duck Typing** | 타입보다 “동작(Behavior)” 중심의 타입 판정 |

---

#### 2. 변수와 이름 바인딩

Python에서 변수는 **값을 저장하는 상자가 아니라, 객체에 대한 참조(reference)** 다.

```python
x = [1, 2, 3]
y = x
y.append(4)

print(x)  # [1, 2, 3, 4]
```

> 💡 `x`와 `y`는 같은 객체를 참조한다.
> Python은 항상 **객체 단위로 메모리를 관리**하고, 변수는 “이름(label)” 역할만 수행한다.

##### (1) id()와 is 연산자

```python
a = [1, 2]
b = a
c = [1, 2]

print(a is b)  # True
print(a is c)  # False
```

* `is` → 동일 객체 여부 (참조 비교)
* `==` → 값 비교 (동등성)

---

#### 3. 불변(Immutable) vs 가변(Mutable)

| 구분            | 타입                                | 특징                    |
| ------------- | --------------------------------- | --------------------- |
| **Immutable** | int, float, str, tuple, frozenset | 값 변경 불가 (새 객체 생성)     |
| **Mutable**   | list, dict, set                   | 내부 값 수정 가능 (동일 객체 유지) |

##### (1) Immutable 예시

```python
a = "hello"
b = a
a += " world"
print(a, b)  # hello world, hello
```

##### (2) Mutable 예시

```python
x = [1, 2, 3]
y = x
x.append(4)
print(x, y)  # [1,2,3,4], [1,2,3,4]
```

> ⚠️ 가변 객체를 함수 인자로 전달할 때는
> 원본이 변경될 수 있으므로 주의해야 한다.

---

#### 4. 스코프(Scope)와 이름 탐색 규칙 (LEGB)

Python은 변수를 찾을 때 다음 순서로 탐색한다.

| 순서                | 영역          | 예시              |
| ----------------- | ----------- | --------------- |
| **L (Local)**     | 함수 내부 지역 변수 | `x` in function |
| **E (Enclosing)** | 중첩 함수 외부 변수 | `nonlocal`      |
| **G (Global)**    | 모듈 전역 변수    | `global x`      |
| **B (Built-in)**  | 내장 이름 공간    | `len`, `print`  |

##### (1) 예시

```python
x = "global"

def outer():
    x = "enclosing"
    def inner():
        x = "local"
        print(x)
    inner()

outer()  # 출력: local
```

> 💡 Python의 스코프 탐색 규칙은 “가장 가까운 범위부터 탐색”하는 구조다.

---

#### 5. 데이터 타입 분류 요약

| 분류                  | 타입                    | 설명          |
| ------------------- | --------------------- | ----------- |
| **기본형 (Primitive)** | int, float, bool, str | 기본 연산 수행 가능 |
| **시퀀스형 (Sequence)** | list, tuple, range    | 순서가 있는 데이터  |
| **매핑형 (Mapping)**   | dict                  | 키-값 구조      |
| **집합형 (Set)**       | set, frozenset        | 중복 없는 집합 연산 |
| **NoneType**        | None                  | 값 없음 표현     |

##### 예시

```python
nums = [1, 2, 3]
user = {"name": "Ingeun", "age": 29}
flags = {True, False}
```

---

#### 6. 동적 타이핑(Dynamic Typing)

Python은 변수를 선언할 때 타입을 명시하지 않는다.
대신, 실행 시점에 객체의 타입이 결정된다.

```python
x = 10      # int
x = "text"  # str
x = [1, 2]  # list
```

> ⚠️ 이러한 특성은 유연하지만,
> 대규모 프로젝트에서는 **타입 오류를 사전에 감지하기 어렵다.**

---

#### 7. 타입 힌트(Type Hint) 및 정적 검사

##### (1) 함수 예시

```python
def add(x: int, y: int) -> int:
    return x + y
```

##### (2) 타입 별칭

```python
UserID = int

def get_user(id: UserID) -> dict:
    ...
```

##### (3) 컬렉션 타입

```python
from typing import List, Dict

users: List[str] = ["Alice", "Bob"]
data: Dict[str, int] = {"x": 1, "y": 2}
```

##### (4) Optional & Union

```python
from typing import Optional, Union

def parse(value: Union[int, str]) -> str:
    return str(value)

def find_user(id: int) -> Optional[str]:
    ...
```

> 💡 타입 힌트는 **Mypy, Pyright, Pylance** 등의 정적 분석기에서 검증할 수 있다.

---

#### 8. 타입 힌트의 런타임 동작

* 타입 힌트는 **컴파일 타임 제약이 아닌, 메타데이터**다.
* 실행 시 실제 타입 검증은 수행되지 않는다.

```python
def add(x: int, y: int) -> int:
    return str(x + y)  # 런타임에서는 오류 없음
```

> ⚠️ 타입 불일치가 있어도 Python은 실행 오류를 발생시키지 않는다.
> 따라서 **정적 검사 도구와 함께 사용**해야 한다.

---

#### 9. 결론

* Python은 **동적 타입 기반의 객체 참조 언어**이며, 변수는 이름(label)에 불과하다.
* 불변/가변 객체의 차이를 이해하면 **함수 인자 전달과 메모리 관리**를 더 정확히 다룰 수 있다.
* 타입 힌트를 활용하면 동적 언어의 한계를 보완하고,
  대규모 백엔드 코드에서도 **안전성과 유지보수성**을 확보할 수 있다.
