---
title: "비동기 패턴 — 이벤트 루프 기반 병렬 처리 구조 (Async Patterns in Python)"
date: 2025-10-28
---

#### 요약
- 본 문서는 Python의 **비동기(Asynchronous) 설계 패턴**을 체계적으로 다룬다.  
- `asyncio`를 중심으로 **Producer–Consumer, Reactor, Pipeline, Task Queue, Fan-out/Fan-in** 구조를  
  실무 코드 수준으로 설명한다.  
- 목표는 “**단일 스레드 환경에서 동시성(concurrency)을 극대화하는 설계 원리**”를 이해하는 것이다.  

##### 참고자료
- [Python asyncio — 공식 문서](https://docs.python.org/3/library/asyncio.html)
- [Asyncio Patterns — Real Python](https://realpython.com/async-io-python/)
- [Trio & AnyIO Concurrency Design](https://trio.readthedocs.io/en/stable/)
- [PEP 492 — Coroutines with async and await](https://peps.python.org/pep-0492/)

---

#### 1. Python 비동기의 철학

| 항목 | 설명 |
|------|------|
| **병렬성 (Parallelism)** | 여러 CPU 코어에서 동시에 실행 (Thread/Process) |
| **동시성 (Concurrency)** | 하나의 스레드가 I/O 대기 동안 다른 작업 처리 |
| **async/await 모델** | 이벤트 루프(Event Loop)를 기반으로 협력형 스케줄링 수행 |
| **GIL 영향** | CPU 연산은 병렬 불가하지만, I/O-bound는 효과적 처리 가능 |

> ✅ “Python의 비동기 패턴은 멀티코어 분산이 아니라, **I/O 효율화**를 위한 전략이다.”

---

#### 2. 기본 구조 — async / await

```python
import asyncio

async def task(name, sec):
    print(f"{name} 시작")
    await asyncio.sleep(sec)
    print(f"{name} 종료")

async def main():
    await asyncio.gather(
        task("A", 2),
        task("B", 1),
    )

asyncio.run(main())
```

> 💡 `await`는 **비동기 중단점(suspension point)** 으로,
> 다른 coroutine이 실행될 수 있도록 제어권을 이벤트 루프에 반환한다.

---

#### 3. Producer–Consumer 패턴

##### (1) 개념

* 생산자(Producer)는 데이터를 생성하고,
* 소비자(Consumer)는 이를 소비한다.
* 두 역할은 `asyncio.Queue`로 연결되어 **비동기 파이프라인**을 구성한다.

##### (2) 예시

```python
import asyncio

async def producer(queue):
    for i in range(3):
        await asyncio.sleep(1)
        await queue.put(f"item-{i}")
        print(f"🟢 Produced: item-{i}")

async def consumer(queue):
    while True:
        item = await queue.get()
        if item is None:
            break
        print(f"🔵 Consumed: {item}")
        queue.task_done()

async def main():
    q = asyncio.Queue()
    await asyncio.gather(producer(q), consumer(q))
    await q.put(None)  # 종료 신호

asyncio.run(main())
```

> ✅ `asyncio.Queue`는 **스레드 안전**하며,
> 생산자-소비자 간 동기화를 자동으로 보장한다.

---

#### 4. Reactor 패턴 — 이벤트 중심 분배 구조

##### (1) 개념

* 이벤트 루프가 입력 이벤트를 감지하고 적절한 핸들러로 전달한다.
* 웹소켓, 네트워크 서버, 실시간 스트림 처리에 적합하다.

##### (2) 예시 (단순 Reactor)

```python
import asyncio

async def handle_event(event_type):
    print(f"🚦 이벤트 처리 중: {event_type}")
    await asyncio.sleep(1)

async def reactor():
    events = ["connect", "message", "disconnect"]
    for e in events:
        await handle_event(e)

asyncio.run(reactor())
```

> 💡 Reactor 패턴은 “**Event → Handler**” 구조로,
> Django Channels, FastAPI WebSocket, Kafka Consumer Loop 등에 적용된다.

---

#### 5. Task Queue 패턴

##### (1) 개념

* 비동기 작업을 큐에 쌓고, 일정 수의 Worker가 병렬로 처리한다.
* 작업의 분산과 처리 속도 제어에 활용된다.

##### (2) 예시

```python
import asyncio
import random

async def worker(name, queue):
    while True:
        task = await queue.get()
        if task is None:
            break
        print(f"⚙️ {name} 처리 중: {task}")
        await asyncio.sleep(random.uniform(0.5, 1.5))
        queue.task_done()

async def main():
    queue = asyncio.Queue()
    for i in range(10):
        await queue.put(f"Job-{i}")

    workers = [asyncio.create_task(worker(f"Worker-{n}", queue)) for n in range(3)]
    await queue.join()

    for _ in workers:
        await queue.put(None)

asyncio.run(main())
```

> ✅ Task Queue는 Celery, RQ, Dramatiq 등 분산 큐 시스템의 기본 개념이다.

---

#### 6. Fan-out / Fan-in 패턴

##### (1) 개념

* Fan-out: 하나의 이벤트를 여러 Task로 분산 처리
* Fan-in: 여러 Task 결과를 하나로 병합

##### (2) 예시

```python
import asyncio

async def fetch_data(url):
    await asyncio.sleep(1)
    return f"Fetched {url}"

async def main():
    urls = [f"url-{i}" for i in range(3)]
    results = await asyncio.gather(*(fetch_data(u) for u in urls))
    print(results)

asyncio.run(main())
```

> ✅ `asyncio.gather()`는 Fan-out/Fan-in의 기본 표현이며,
> **비동기 데이터 수집과 병합**의 핵심이다.

---

#### 7. Async Pipeline — Coroutine 기반 데이터 스트림

```python
import asyncio

async def read_data():
    for i in range(3):
        await asyncio.sleep(1)
        yield f"data-{i}"

async def process_data(stream):
    async for item in stream:
        print(f"🔧 처리 중: {item}")

async def main():
    await process_data(read_data())

asyncio.run(main())
```

> 💡 `async for`는 비동기 제너레이터를 순회하며,
> 실시간 로그 스트림·ETL 파이프라인·소켓 데이터 수신에 활용된다.

---

#### 8. Timeout, Semaphore, Cancellation 패턴

| 항목               | 목적          | 예시                                  |
| ---------------- | ----------- | ----------------------------------- |
| **Timeout**      | 작업 제한 시간 제어 | `asyncio.wait_for(task, timeout=3)` |
| **Semaphore**    | 동시 실행 제한    | `asyncio.Semaphore(5)`              |
| **Cancellation** | 실행 중인 작업 취소 | `task.cancel()`                     |

```python
async def limited_task(name, sem):
    async with sem:
        print(f"{name} 실행 중")
        await asyncio.sleep(1)
```

> ⚙️ 제한, 시간 관리, 취소 로직은 **운영 환경에서 필수적인 안정성 제어 장치**다.

---

#### 9. 구조적 패턴: Async + Pipeline + Queue 결합

```python
import asyncio

async def producer(queue):
    for i in range(5):
        await asyncio.sleep(0.3)
        await queue.put(f"item-{i}")
    await queue.put(None)

async def processor(queue_in, queue_out):
    while True:
        item = await queue_in.get()
        if item is None:
            await queue_out.put(None)
            break
        await asyncio.sleep(0.5)
        await queue_out.put(item.upper())

async def consumer(queue):
    while True:
        item = await queue.get()
        if item is None:
            break
        print(f"✅ 결과: {item}")

async def main():
    q1, q2 = asyncio.Queue(), asyncio.Queue()
    await asyncio.gather(
        producer(q1),
        processor(q1, q2),
        consumer(q2)
    )

asyncio.run(main())
```

> ✅ 이 구조는 **데이터 스트림 파이프라인 + 큐 기반 비동기 처리**의 실무형 조합이다.

---

#### 10. 결론

* Python의 `asyncio`는 “**단일 스레드, 다중 작업**”을 위한 고급 이벤트 시스템이다.
* Producer–Consumer, Reactor, Pipeline, Task Queue 패턴은
  웹소켓, ETL, IoT, 로그 수집, LLM Request Stream 등 다양한 실무 환경에 직접 적용된다.
* 비동기 코드는 “빠르게 실행하는 코드”가 아니라 “**대기 시간을 효율적으로 분배하는 코드**”이다.

> 🎯 **핵심 문장:**
> “Python 비동기의 본질은 병렬이 아니라, 기다림을 설계하는 기술이다.”
