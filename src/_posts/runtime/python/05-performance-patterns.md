---
title: "성능 최적화 패턴 (Performance Optimization Patterns)"
date: 2025-10-28
---


#### 요약
- 본 문서는 Python에서의 **성능 최적화 전략**을 다룬다.  
- CPU 바운드(CPU-bound) vs I/O 바운드(I/O-bound) 구분, 프로파일링 도구 활용,  
  데이터 구조 선택, 병렬 처리, 벡터화 연산, C 확장 모듈 연계 등 실무형 패턴을 포함한다.  
- 목표는 “**비효율적인 코드를 찾아내고, 실행 병목을 구조적으로 제거**”하는 것이다.  

##### 참고자료
- [Python Profiling Tools](https://docs.python.org/3/library/profile.html)
- [Concurrent Futures — ThreadPoolExecutor, ProcessPoolExecutor](https://docs.python.org/3/library/concurrent.futures.html)
- [NumPy Performance Guide](https://numpy.org/doc/stable/user/absolute_beginners.html)

---

#### 1. 성능 최적화 접근 단계

| 단계 | 목적 | 대표 도구 |
|------|------|-----------|
| 1️⃣ **측정 (Measure)** | 병목지점 확인 | `cProfile`, `line_profiler` |
| 2️⃣ **분석 (Analyze)** | CPU, I/O, Memory 비율 분석 | `timeit`, `tracemalloc` |
| 3️⃣ **최적화 (Optimize)** | 알고리즘 개선, 자료구조 변경 | `NumPy`, `multiprocessing`, `asyncio` |
| 4️⃣ **검증 (Validate)** | 결과 비교 및 리그레션 방지 | Benchmark 테스트 |

> 💡 “측정 없이 최적화하지 말라(Measure before optimize)” — 성능 개선의 기본 원칙이다.

---

#### 2. CPU-bound vs I/O-bound 구분

| 유형 | 병목 원인 | 해결 접근 | 예시 |
|------|------------|------------|------|
| **CPU-bound** | 연산 집중 (계산량 많음) | 멀티프로세싱 / C 확장 | 이미지 처리, 수학 연산 |
| **I/O-bound** | 외부 대기 (파일·DB·API) | 비동기(asyncio) / 스레드풀 | 웹 요청, 파일 읽기 |

```python
# CPU-bound
[x**2 for x in range(10_000_000)]

# I/O-bound
import requests
requests.get("https://api.github.com")
```

> ⚙️ CPU-bound → **멀티프로세스**, I/O-bound → **비동기/스레드** 가 핵심 분기다.

---

#### 3. 프로파일링 기법

##### (1) 코드 실행 시간 측정

```python
import time

start = time.perf_counter()
# 코드 실행
end = time.perf_counter()
print(f"실행 시간: {end - start:.4f}초")
```

##### (2) 함수 단위 프로파일링

```python
import cProfile
import pstats

with cProfile.Profile() as pr:
    [x**2 for x in range(100000)]
pstats.Stats(pr).sort_stats("time").print_stats(5)
```

##### (3) `line_profiler` 사용

```bash
pip install line_profiler
kernprof -l -v script.py
```

> ✅ `line_profiler`는 각 코드 라인의 **실행 시간 비율**을 시각화하여 병목을 정밀 분석할 수 있다.

---

#### 4. 데이터 구조 기반 최적화

| 문제 유형    | 비효율적 구조          | 권장 구조                 | 이유            |
| -------- | ---------------- | --------------------- | ------------- |
| 순차 검색    | `list`           | `set`                 | 해시 기반 O(1) 조회 |
| 중복 제거    | `list`           | `set`, `dict`         | 고유값 자동 관리     |
| 정렬 빈도 높음 | `list.sort()` 반복 | `heapq` 또는 `bisect`   | 정렬 비용 최소화     |
| 빈도 계산    | 수동 반복            | `collections.Counter` | 내장 C 레벨 최적화   |

```python
from collections import Counter

data = ["a", "b", "a", "c", "b"]
print(Counter(data))  # {'a': 2, 'b': 2, 'c': 1}
```

---

#### 5. 루프 및 연산 최적화

| 항목       | 비효율 예시                                  | 개선 방법                         |
| -------- | --------------------------------------- | ----------------------------- |
| 루프 내 연산  | `for i in range(len(arr)): arr[i] += 1` | `map()` 또는 list comprehension |
| 조건문 반복   | if문 중첩                                  | `match` (Python 3.10+) 사용     |
| 함수 호출 과다 | 반복 함수 호출                                | 지역 변수 캐싱                      |
| 불필요한 복사  | 슬라이싱 다중 사용                              | `memoryview` 활용               |

##### 예시: 리스트 컴프리헨션

```python
# 느림
result = []
for x in range(1000000):
    result.append(x * 2)

# 빠름
result = [x * 2 for x in range(1000000)]
```

> 💡 리스트 컴프리헨션은 내부적으로 C 레벨 반복 구조를 사용하므로 훨씬 빠르다.

---

#### 6. 멀티프로세싱 / 멀티스레딩

##### (1) CPU-bound → `ProcessPoolExecutor`

```python
from concurrent.futures import ProcessPoolExecutor

def compute(x): return x**2

with ProcessPoolExecutor() as executor:
    results = list(executor.map(compute, range(10)))
print(results)
```

##### (2) I/O-bound → `ThreadPoolExecutor`

```python
from concurrent.futures import ThreadPoolExecutor
import requests

def fetch(url): return requests.get(url).status_code

urls = ["https://example.com"] * 5
with ThreadPoolExecutor() as executor:
    results = list(executor.map(fetch, urls))
print(results)
```

| 구분     | 스레드(Thread) | 프로세스(Process) |
| ------ | ----------- | ------------- |
| GIL 영향 | 받음          | 없음            |
| 공유 메모리 | O           | X             |
| 생성 비용  | 낮음          | 높음            |
| 권장 용도  | I/O 작업      | CPU 연산        |

---

#### 7. 벡터화 연산 (NumPy 기반)

Python 루프보다 C 기반 NumPy 벡터 연산이 훨씬 빠르다.

```python
import numpy as np

arr = np.arange(1_000_000)
result = arr * 2
```

| 항목    | Python for-loop | NumPy 벡터 연산   |
| ----- | --------------- | ------------- |
| 실행 방식 | Python 인터프리터 반복 | C 레벨 SIMD 벡터화 |
| 속도    | 느림 (수만 번 반복)    | 빠름 (한 번에 연산)  |

> ✅ 벡터화는 데이터 과학, 통계, ML 파이프라인에서 필수적인 성능 개선 기법이다.

---

#### 8. C 확장 모듈 / Cython / Numba

##### (1) Cython

```bash
pip install cython
```

```python
# example.pyx
def fast_square(int n):
    return n * n
```

##### (2) Numba (JIT 컴파일)

```bash
pip install numba
```

```python
from numba import njit

@njit
def compute_fast(arr):
    return [x * 2 for x in arr]
```

> ⚡ Cython/Numba는 Python 코드를 **JIT 또는 C로 컴파일**하여
> 네이티브 속도에 근접한 실행 성능을 제공한다.

---

#### 9. 메모리와 캐싱 기반 최적화

| 방법               | 설명                                   |
| ---------------- | ------------------------------------ |
| **LRU 캐시**       | 동일 입력 재계산 방지 (`functools.lru_cache`) |
| **Slot 클래스**     | `__slots__` 사용으로 인스턴스 dict 제거        |
| **배치 처리(batch)** | 데이터 일괄 연산으로 호출 비용 절감                 |
| **Lazy Loading** | 필요 시점에만 객체 로드                        |

```python
from functools import lru_cache

@lru_cache(maxsize=256)
def fib(n):
    if n < 2:
        return n
    return fib(n-1) + fib(n-2)
```

> 💡 캐시를 활용하면 CPU 연산량과 메모리 할당을 동시에 줄일 수 있다.

---

#### 10. 종합 최적화 전략

| 구분          | 주요 기법                            | 설명            |
| ----------- | -------------------------------- | ------------- |
| **연산 최적화**  | 벡터화, 컴프리헨션, 로컬 변수 캐싱             | 파이썬 레벨 최적화    |
| **동시성 제어**  | asyncio, ThreadPool, ProcessPool | I/O·CPU 분리    |
| **C 레벨 가속** | Cython, Numba                    | 계산량 많은 코드 최적화 |
| **메모리 관리**  | Generator, LRU Cache             | 공간 효율 향상      |
| **프로파일링**   | cProfile, line_profiler          | 병목 위치 식별      |

---

#### 11. 결론

* Python의 성능 병목은 대부분 **I/O 대기**와 **불필요한 루프/연산**에서 발생한다.
* `asyncio`, `ProcessPoolExecutor`, `NumPy`를 적절히 조합하면
  **고성능 I/O 및 연산 병렬화**가 가능하다.
* 최적화는 감이 아닌 데이터 기반(Profiling)으로 수행해야 하며,
  “**코드를 빠르게가 아니라 효율적으로**” 만드는 것이 핵심이다.

```

