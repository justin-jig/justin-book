---
title: "메모리 관리와 성능 최적화 (Memory Management & Optimization)"
date: 2025-10-28
---


#### 요약
- 본 문서는 Python의 **메모리 관리 구조와 최적화 원리**를 설명한다.  
- 객체의 **참조 카운팅(Reference Counting)**, **가비지 컬렉션(Garbage Collection)**,  
  **순환 참조(Circular Reference)**, **메모리 프로파일링 기법**을 다룬다.  
- 또한 **데이터 구조 선택과 메모리 효율화**를 위한 실무적 가이드라인을 포함한다.  
- 목표는 “**Python 메모리 동작을 정확히 이해하고, 누수 없는 안정적 코드 작성**”이다.  

##### 참고자료
- [Python Memory Management — 공식 문서](https://docs.python.org/3/c-api/memory.html)
- [gc — Garbage Collector Interface](https://docs.python.org/3/library/gc.html)
- [tracemalloc — Memory Tracking](https://docs.python.org/3/library/tracemalloc.html)

---

#### 1. Python 메모리 구조 개요

Python은 **자동 메모리 관리(Automatic Memory Management)** 구조를 갖는다.  
즉, 객체가 더 이상 참조되지 않으면 자동으로 해제된다.

| 영역 | 설명 |
|------|------|
| **Heap** | 모든 객체(변수, 리스트, 클래스 등)가 저장되는 공간 |
| **Stack** | 함수 호출 시 로컬 변수·프레임 저장 |
| **Intern Pool** | 짧은 문자열·정수 등 캐시(재사용)되는 상수 값 |
| **Reference Table** | 객체와 참조 카운트 관리용 내부 구조 |

> ⚙️ Python은 “값”이 아닌 “객체의 참조(reference)”를 변수에 저장한다.

---

#### 2. 참조 카운팅(Reference Counting)

모든 객체는 **참조 횟수(refcount)** 를 가지고 있으며,  
참조가 0이 되면 즉시 메모리에서 해제된다.

```python
import sys

a = [1, 2, 3]
b = a
print(sys.getrefcount(a))  # 3 (a, b, getrefcount 내부)
del b
print(sys.getrefcount(a))  # 2
```

> ✅ `sys.getrefcount(obj)` 함수는 현재 객체의 참조 횟수를 반환한다.
> (내부에서 추가 참조가 발생하므로 실제 수보다 +1 높게 출력된다.)

---

#### 3. 가비지 컬렉션(Garbage Collection, GC)

참조 카운팅만으로는 **순환 참조(Circular Reference)** 를 해결할 수 없다.
이를 위해 Python은 **GC 모듈**을 통해 주기적으로 객체 그래프를 검사한다.

```python
import gc
gc.collect()  # 수동 실행
```

| 함수                 | 설명                |
| ------------------ | ----------------- |
| `gc.collect()`     | 즉시 가비지 컬렉션 수행     |
| `gc.get_stats()`   | 현재 GC 상태 통계 반환    |
| `gc.get_objects()` | GC 관리 중인 객체 목록 조회 |

> 💡 순환 참조는 두 객체가 서로를 참조하여 참조 카운트가 0이 되지 않는 상태를 의미한다.

---

#### 4. 순환 참조 예시 및 해결

##### (1) 순환 참조 문제

```python
class Node:
    def __init__(self):
        self.ref = None

a = Node()
b = Node()
a.ref = b
b.ref = a
```

이 경우 `a`와 `b`는 서로를 참조하므로 GC가 개입하지 않으면 해제되지 않는다.

##### (2) 해결 방법 ① — `weakref` 사용

```python
import weakref

class Node:
    def __init__(self):
        self.ref = None

a = Node()
b = Node()
a.ref = weakref.ref(b)
b.ref = weakref.ref(a)
```

> ✅ `weakref`는 참조하되 참조 카운트를 증가시키지 않는다.
> 따라서 순환 참조 문제를 방지할 수 있다.

##### (3) 해결 방법 ② — 컨텍스트 종료 시 명시적 해제

```python
del a
del b
gc.collect()
```

---

#### 5. 객체 할당 최적화

Python은 소규모 객체(특히 정수, 문자열)에 대해 **메모리 풀(Memory Pool)** 을 사용한다.

| 범주                | 최적화 방식               | 설명                  |
| ----------------- | -------------------- | ------------------- |
| **정수 캐시**         | `[-5 ~ 256]` 범위는 재사용 | 반복적으로 새 객체를 생성하지 않음 |
| **문자열 Interning** | 동일 문자열은 동일 객체로 저장    | `is` 비교 가능          |
| **리스트 버퍼링**       | 내부적으로 여유 슬롯을 확보      | 반복 append 시 성능 향상   |

```python
a = 100
b = 100
print(a is b)  # True (정수 캐싱)
```

> ⚡ CPython의 `PyMalloc`은 작은 객체를 효율적으로 재사용하여 할당 비용을 줄인다.

---

#### 6. 메모리 누수 탐지

##### (1) tracemalloc 사용

```python
import tracemalloc

tracemalloc.start()

# 테스트 코드
x = [i for i in range(100000)]

snapshot = tracemalloc.take_snapshot()
top_stats = snapshot.statistics('lineno')

for stat in top_stats[:3]:
    print(stat)
```

출력:

```
/app/main.py:5: size=8.0 MiB, count=100000
```

##### (2) objgraph를 이용한 참조 관계 분석

```bash
pip install objgraph
```

```python
import objgraph
objgraph.show_most_common_types()
objgraph.show_backrefs([x], filename='graph.png')
```

> ✅ 메모리 누수가 의심되는 객체의 **참조 경로 시각화**가 가능하다.

---

#### 7. 메모리 효율적 데이터 구조 선택

| 목적         | 비효율적 구조       | 권장 구조                                         |
| ---------- | ------------- | --------------------------------------------- |
| 고정 크기 배열   | `list`        | `array.array`, `numpy.ndarray`                |
| 키-값 매핑     | `dict` (큰 키셋) | `collections.defaultdict`, `MappingProxyType` |
| 대량 문자열 결합  | `+=` 반복       | `"".join(list)`                               |
| 순차 데이터 스트림 | `list`        | `generator`                                   |

예시:

```python
# 문자열 연결 비효율
result = ""
for s in ["A", "B", "C"]:
    result += s   # 매번 새 객체 생성

# 효율적 방식
result = "".join(["A", "B", "C"])
```

---

#### 8. 메모리 최적화 패턴

| 기법               | 설명                               |
| ---------------- | -------------------------------- |
| **Generator 사용** | Lazy evaluation으로 불필요한 메모리 점유 방지 |
| **del 키워드 활용**   | 불필요한 객체 즉시 제거                    |
| **slot 클래스 사용**  | `__slots__` 정의로 인스턴스 dict 제거     |
| **데이터 구조 변환**    | list → tuple (불변 구조로 캐시 효율 증가)   |

##### 예시: `__slots__`

```python
class Point:
    __slots__ = ("x", "y")
    def __init__(self, x, y):
        self.x = x
        self.y = y
```

> ✅ `__slots__`는 수천 개 인스턴스가 생성될 때 메모리 사용량을 크게 절감한다.

---

#### 9. 실무 메모리 관리 전략

| 항목              | 권장 사항                                       |
| --------------- | ------------------------------------------- |
| **대용량 데이터 처리**  | Generator, Iterator 사용                      |
| **파일/DB 연결 관리** | `with` 문으로 명시적 자원 해제                        |
| **주기적 GC 제어**   | CPU 부하가 큰 경우 `gc.disable()` 후 특정 시점에만 수동 호출 |
| **캐시 관리**       | `functools.lru_cache()` 로 재사용성 높이기          |
| **프로파일링**       | `tracemalloc`, `memory_profiler` 병행 사용      |

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def heavy_func(x):
    ...
```

---

#### 10. 결론

* Python은 **참조 기반 메모리 관리 + GC 기반 회수 메커니즘**을 사용한다.
* 순환 참조는 `weakref` 또는 명시적 해제 패턴으로 방지할 수 있다.
* 작은 객체 캐싱과 `__slots__`, Generator 활용은 **메모리 효율을 극대화**한다.
* 메모리 동작 원리를 이해하면, **성능·안정성·자원 관리** 측면에서 한층 높은 품질의 코드를 작성할 수 있다.
