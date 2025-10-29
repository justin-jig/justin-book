---
title: "함수 구조와 모듈 시스템 (Functions & Modules)"
date: 2025-10-28
---

**version: 1.0.0**

#### 요약
- 본 문서는 Python의 **함수(Function)** 구조와 **모듈(Module)** 시스템을 정리한다.  
- 함수의 정의, 스코프, 클로저, 람다, 가변 인자 활용법을 포함하고,  
  모듈의 import 과정과 캐싱 메커니즘까지 설명한다.  
- 목표는 “**재사용성 높은 함수 설계와 모듈화된 코드 구조 이해**”이다.  

##### 참고자료
- [Python Functions Tutorial](https://docs.python.org/3/tutorial/controlflow.html#defining-functions)
- [Python Modules & Packages](https://docs.python.org/3/tutorial/modules.html)
- [PEP 8 – Imports & Naming Conventions](https://peps.python.org/pep-0008/)

---

#### 1. 함수의 기본 구조

##### (1) 함수 정의와 호출
```python
def greet(name: str) -> str:
    return f"Hello, {name}"

print(greet("Ingeun"))
```

| 구성 요소    | 설명                          |
| -------- | --------------------------- |
| `def`    | 함수 정의 키워드                   |
| `greet`  | 함수 이름 (소문자 + snake_case 권장) |
| `name`   | 매개변수(Parameter)             |
| `-> str` | 반환 타입 힌트                    |
| `return` | 결과 반환                       |

##### (2) 함수 인자의 종류

```python
def func(a, b=2, *args, **kwargs):
    print(a, b, args, kwargs)
```

| 인자 유형  | 기호         | 설명                 |
| ------ | ---------- | ------------------ |
| 위치 인자  | `a`        | 순서 기반 전달           |
| 기본 인자  | `b=2`      | 기본값 제공             |
| 가변 인자  | `*args`    | 여러 값 묶음 전달 (tuple) |
| 키워드 인자 | `**kwargs` | 키-값 묶음 전달 (dict)   |

---

#### 2. 클로저(Closure)와 중첩 함수

##### (1) 중첩 함수 예시

```python
def outer(msg):
    def inner():
        print(f"Message: {msg}")
    return inner

fn = outer("Hello")
fn()  # Message: Hello
```

* `inner()` 함수는 외부 함수 `outer()`의 변수 `msg`를 **캡처(Closure)** 한다.
* 외부 스코프의 변수를 기억한 채로 함수 객체가 반환된다.

##### (2) 클로저의 활용

* **콜백 함수**
* **데코레이터 구현**
* **상태를 유지하는 함수형 구조**

---

#### 3. 람다(Lambda) 표현식

```python
square = lambda x: x ** 2
print(square(4))  # 16
```

| 항목     | 설명                   |
| ------ | -------------------- |
| **형태** | `lambda 매개변수: 표현식`   |
| **특징** | 익명 함수, 한 줄 표현식 전용    |
| **주의** | 복잡한 로직에는 일반 함수 사용 권장 |

람다는 **정렬 키 함수**, **고차 함수(map, filter, reduce)** 등에 자주 사용된다.

```python
nums = [3, 1, 2]
sorted_nums = sorted(nums, key=lambda x: -x)
print(sorted_nums)  # [3, 2, 1]
```

---

#### 4. 함수의 스코프와 참조

Python은 **LEGB 규칙(Local → Enclosing → Global → Built-in)** 으로 변수를 탐색한다.

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

> 💡 외부 변수를 수정하려면 `global` 또는 `nonlocal` 키워드를 사용한다.

```python
count = 0
def increment():
    global count
    count += 1
```

---

#### 5. 모듈(Module) 기본 구조

##### (1) 모듈 생성

하나의 `.py` 파일은 곧 하나의 **모듈**이다.

```python
# math_utils.py
def add(a, b): return a + b
def sub(a, b): return a - b
```

```python
# main.py
import math_utils

print(math_utils.add(3, 5))
```

##### (2) 선택적 import

```python
from math_utils import add
print(add(1, 2))
```

##### (3) 별칭(alias) 사용

```python
import math_utils as m
m.add(5, 6)
```

---

#### 6. 모듈 검색 경로와 캐싱

Python은 모듈을 import할 때 아래 순서로 검색한다.

```plaintext
1. 현재 디렉터리
2. PYTHONPATH 환경 변수
3. site-packages (패키지 설치 경로)
```

검색 경로는 다음 명령으로 확인 가능:

```python
import sys
print(sys.path)
```

##### (1) 모듈 캐싱

* Python은 import 시 모듈을 한 번만 로드하고,
  이후에는 **sys.modules** 캐시에 저장한다.

```python
import sys
import math_utils

print(sys.modules["math_utils"])
```

##### (2) 모듈 리로드

```python
import importlib
importlib.reload(math_utils)
```

> ⚙️ 캐싱은 불필요한 I/O를 줄이고 성능을 향상시키지만,
> 실시간 코드 수정 중에는 reload()로 갱신할 수 있다.

---

#### 7. 패키지(Package) 구조

##### (1) 기본 구조

```plaintext
app/
├── __init__.py
├── utils/
│   ├── __init__.py
│   └── helper.py
└── main.py
```

##### (2) 상대 경로 import

```python
from .utils.helper import say_hello
```

##### (3) `__init__.py` 역할

* 디렉터리를 패키지로 인식시킴
* 초기화 코드 또는 하위 모듈 재노출 가능

```python
# __init__.py
from .helper import say_hello
```

---

#### 8. 모듈 네임스페이스와 `__name__`

##### (1) 실행 구분

```python
if __name__ == "__main__":
    print("직접 실행")
else:
    print("모듈로 import됨")
```

| 구분         | 설명                 |
| ---------- | ------------------ |
| `__main__` | 직접 실행된 스크립트        |
| 모듈명        | 다른 모듈에서 import된 경우 |

##### (2) 활용 예시

```python
def main():
    print("실행 함수")

if __name__ == "__main__":
    main()
```

> ✅ 이는 패키지 내부 스크립트를 독립 실행 가능하게 만드는 **표준 진입점 패턴(entry point)** 이다.

---

#### 9. 결론

* 함수는 Python의 기본 실행 단위이며, **스코프와 클로저 구조**를 이해하면 재사용성이 향상된다.
* 모듈은 코드의 물리적 분리 단위이자 **실행 시 캐시되는 독립 공간**이다.
* `__init__.py`와 `__name__` 패턴을 적절히 활용하면
  유지보수성과 테스트 효율이 모두 향상된다.
* 함수와 모듈 설계는 Python 백엔드 프로젝트의 **가장 기본적인 구조적 토대**이다.

