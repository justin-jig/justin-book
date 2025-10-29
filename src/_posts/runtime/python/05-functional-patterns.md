---
title: "함수형 패턴 — 일급 함수와 불변성 기반 설계 (Functional Patterns in Python)"
date: 2025-10-28
---

#### 요약
- 본 문서는 Python의 **함수형 프로그래밍(Functional Programming)** 개념과  
  이를 실무 설계 패턴으로 적용하는 방법을 다룬다.  
- **일급 함수, 클로저, 고차 함수, 데코레이터, 불변성, 파이프라인 구조** 등을 중심으로  
  명령형 코드에서 선언형 코드로 전환하는 사고법을 제시한다.  
- 목표는 “**상태 의존성을 최소화하고, 데이터 흐름 중심으로 설계하는 능력**”을 확보하는 것이다.  

##### 참고자료
- [Functional Programming HOWTO — Python Docs](https://docs.python.org/3/howto/functional.html)
- [Fluent Python (Luciano Ramalho)](https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/)
- [Real Python — Functional Programming in Python](https://realpython.com/python-functional-programming/)
- [PEP 318 — Decorators for Functions and Methods](https://peps.python.org/pep-0318/)

---

#### 1. 함수형 프로그래밍의 핵심 개념

| 개념 | 설명 | Python 예시 |
|------|------|-------------|
| **일급 함수 (First-Class Function)** | 함수를 값처럼 전달·저장·리턴할 수 있음 | `map`, `filter`, `sorted(key=func)` |
| **고차 함수 (Higher-Order Function)** | 함수를 인자로 받거나 반환함 | `functools.reduce` |
| **불변성 (Immutability)** | 상태 변경 없이 새로운 값을 생성 | `tuple`, `frozenset` |
| **순수 함수 (Pure Function)** | 부작용(side effect)이 없음 | 입력 → 출력만 결정 |
| **선언형 코드** | “무엇을”에 집중, “어떻게”는 추상화 | comprehension, lambda |

> ✅ Python은 완전한 함수형 언어는 아니지만,  
> 함수형 사고를 통해 **의존성 줄이기 + 재사용성 높이기**가 가능하다.

---

#### 2. 일급 함수 (First-Class Function)

Python의 함수는 일급 객체이므로, 변수에 저장하거나 인자로 전달할 수 있다.

```python
def greet(name): 
    return f"Hello, {name}"

def run(func, arg):
    return func(arg)

print(run(greet, "Ingeun"))  # Hello, Ingeun
```

> 💡 “함수를 값처럼 다루는 것”이 함수형 설계의 출발점이다.

---

#### 3. 클로저(Closure)

함수가 **자신이 정의된 환경(lexical scope)** 을 기억하여,
해당 변수를 외부 스코프에서 접근하지 않고도 참조할 수 있게 한다.

```python
def counter():
    count = 0
    def increment():
        nonlocal count
        count += 1
        return count
    return increment

count_fn = counter()
print(count_fn())  # 1
print(count_fn())  # 2
```

> ✅ 클로저는 “상태를 은닉하면서 유지”하는 간결한 방법이다.
> 객체지향의 인스턴스 변수를 함수 단위로 표현한 형태라고 볼 수 있다.

---

#### 4. 고차 함수 (Higher-Order Function)

##### (1) 기본 예시

```python
def multiply(factor):
    def inner(x):
        return x * factor
    return inner

double = multiply(2)
print(double(5))  # 10
```

##### (2) 내장 고차 함수

| 함수                       | 역할                     |
| ------------------------ | ---------------------- |
| `map(func, iterable)`    | 요소 변환                  |
| `filter(func, iterable)` | 조건 필터링                 |
| `reduce(func, seq)`      | 누적 연산 (from functools) |

```python
from functools import reduce

nums = [1, 2, 3, 4]
print(reduce(lambda a, b: a + b, nums))  # 10
```

> 💡 고차 함수는 “함수를 조합하여 데이터 흐름을 만드는 구조”를 가능하게 한다.

---

#### 5. 데코레이터 (Decorator)

##### (1) 기본 구조

```python
def logger(func):
    def wrapper(*args, **kwargs):
        print(f"[LOG] 실행: {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@logger
def greet(name):
    print(f"Hello, {name}")

greet("Ingeun")
```

> ✅ 데코레이터는 **함수 실행 전·후의 부가기능을 모듈화**할 때 유용하다.

##### (2) 다중 데코레이터

```python
def timer(func):
    import time
    def wrapper(*a, **kw):
        start = time.time()
        result = func(*a, **kw)
        print(f"⏱ {time.time() - start:.3f}s")
        return result
    return wrapper

@logger
@timer
def slow_task():
    for _ in range(3): pass

slow_task()
```

> ⚙️ 데코레이터는 **AOP(관점 지향 프로그래밍)** 의 핵심 구현 방식으로,
> 로깅·트랜잭션·성능 계측·권한 검증에 사용된다.

---

#### 6. 불변성 (Immutability) 과 데이터 안정성

##### (1) 가변 구조의 문제

```python
arr = [1, 2, 3]
alias = arr
alias.append(4)
print(arr)  # [1, 2, 3, 4]  ← 원본도 변경됨
```

##### (2) 불변 구조의 장점

```python
arr = (1, 2, 3)
new_arr = arr + (4,)
print(arr)      # (1, 2, 3)
print(new_arr)  # (1, 2, 3, 4)
```

> ✅ 불변 데이터는 **병렬 환경에서 안전하고 디버깅이 용이**하다.

##### (3) 실무적 활용

* `frozenset`, `namedtuple`, `dataclasses(frozen=True)`
* 멀티스레드 환경에서 공유 데이터 보호
* 불변 데이터 기반 캐시 (`functools.lru_cache`)

---

#### 7. 파이프라인(Pipeline) 패턴

##### (1) 개념

* 여러 함수를 **데이터 처리 체인으로 연결**하는 방식.
* 데이터 스트림 처리, ETL, 비동기 파이프라인에 활용된다.

##### (2) 구현 예시

```python
def pipe(data, *funcs):
    for f in funcs:
        data = f(data)
    return data

def clean(text): return text.strip().lower()
def tokenize(text): return text.split()
def unique(tokens): return list(set(tokens))

result = pipe(" Hello Python Hello ", clean, tokenize, unique)
print(result)  # ['hello', 'python']
```

> 💡 Pipeline은 “**데이터 → 함수 → 함수 → 결과**” 구조를 선언적으로 표현한다.

##### (3) Generator 기반 Lazy Pipeline

```python
def read_lines(file):
    with open(file) as f:
        for line in f:
            yield line.strip()

def filter_data(lines):
    for line in lines:
        if "ERROR" in line:
            yield line

for log in filter_data(read_lines("app.log")):
    print(log)
```

> ✅ Lazy pipeline은 대용량 로그 처리, 실시간 스트림 필터링에서 강력하다.

---

#### 8. 함수형 설계의 장점과 주의점

| 항목          | 장점                 | 주의점           |
| ----------- | ------------------ | ------------- |
| **상태 의존도**  | 낮음 (Pure Function) | 컨텍스트 공유 어려움   |
| **테스트 용이성** | 동일 입력 → 동일 출력      | 외부 I/O 다루기 복잡 |
| **병렬 처리**   | 안전성 높음             | 메모리 복제 비용 증가  |
| **코드 간결성**  | 명령형 대비 짧음          | 초보자 가독성 저하 가능 |

> ⚖️ 함수형 패턴은 **“복잡성을 단순화”하되, 추상화 남용은 피해야 한다.**

---

#### 9. 함수형 프로그래밍 + 객체지향 결합

Python은 OOP와 FP를 혼합할 수 있다.

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Order:
    price: int
    qty: int

def calc_total(order: Order) -> int:
    return order.price * order.qty

orders = [Order(100, 2), Order(200, 3)]
total = sum(map(calc_total, orders))
print(total)  # 800
```

> ✅ FP는 **데이터 불변성과 명령 최소화**,
> OOP는 **행동 추상화와 구조적 일관성**을 담당한다.

---

#### 10. 결론

* 함수형 설계는 “**어떻게 실행할까**”보다 “**어떤 변환을 할까**”에 집중한다.
* `일급 함수 → 클로저 → 데코레이터 → 파이프라인`으로 이어지는 패턴은
  **비동기, 데이터 처리, 테스트 구조 설계의 기반**이 된다.
* Python의 함수형 패턴은 복잡도를 줄이고 코드의 예측 가능성을 극대화한다.

> 🎯 **핵심 문장:**
> “함수형 프로그래밍은 코드를 짧게 쓰는 기술이 아니라, 부작용을 줄이는 사고방식이다.”

