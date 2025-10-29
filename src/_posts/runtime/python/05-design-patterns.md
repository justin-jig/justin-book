---
title: "디자인 패턴 — 객체지향 기반 구조 재사용 (Design Patterns in Python)"
date: 2025-10-28
---

**version: 1.0.0**

#### 요약
- 본 문서는 Python 환경에서 자주 사용되는 **객체지향 설계 패턴(Design Patterns)** 을 다룬다.  
- GoF(Design Patterns, 1994)에서 제시한 고전적 패턴을 Pythonic 방식으로 재해석하고,  
  각 패턴의 구조, 사용 의도, 실무 예시를 함께 제시한다.  
- 목표는 “**패턴을 단순히 구현하는 것**이 아니라,  
  **패턴을 선택·조합·단순화할 수 있는 사고 능력**을 갖추는 것”이다.  

##### 참고자료
- [Refactoring.Guru — Design Patterns in Python](https://refactoring.guru/design-patterns/python)
- [GoF: Design Patterns (Gamma et al., 1994)](https://en.wikipedia.org/wiki/Design_Patterns)
- [Architecture Patterns with Python (Percival & Gregory)](https://www.oreilly.com/library/view/architecture-patterns-with/9781492052197/)
- [Python Patterns Guide (Real Python)](https://realpython.com/python-design-patterns/)

---

#### 1. 디자인 패턴의 분류

| 구분 | 목적 | 예시 |
|------|------|------|
| **생성 패턴 (Creational)** | 객체 생성 과정을 추상화 | Factory, Singleton, Builder |
| **구조 패턴 (Structural)** | 클래스/객체의 관계를 단순화 | Adapter, Facade, Proxy |
| **행위 패턴 (Behavioral)** | 객체 간의 협력과 의사소통 정의 | Strategy, Observer, Command |

> 💡 Python은 동적 언어로서, 클래스보다 **함수와 클로저로 패턴을 간결하게 표현**할 수 있다.

---

#### 2. Factory Pattern — 객체 생성 캡슐화

##### (1) 개념
- 객체 생성을 서브클래스나 별도 함수로 위임하여 **유연한 인스턴스 생성 구조**를 제공한다.  
- “**어떤 객체를 만들지 모를 때, 공장(factory)이 대신 판단**한다.”

##### (2) 예시
```python
class ShapeFactory:
    def create_shape(self, shape_type: str):
        if shape_type == "circle":
            return Circle()
        elif shape_type == "square":
            return Square()
        raise ValueError("Invalid shape type")

class Circle: pass
class Square: pass

factory = ShapeFactory()
shape = factory.create_shape("circle")
print(type(shape))  # <class '__main__.Circle'>
```

> ✅ Factory는 “조건문으로 분기되는 객체 생성을 한곳에 모은다”는 점에서 유지보수성을 높인다.

##### (3) Pythonic 대체

```python
def shape_factory(shape_type: str):
    shapes = {"circle": Circle, "square": Square}
    return shapes[shape_type]()
```

> 💡 Python에서는 클래스를 일급 객체로 다룰 수 있으므로, Factory 함수를 단순화할 수 있다.

---

#### 3. Singleton Pattern — 전역 인스턴스 보장

##### (1) 개념

* 애플리케이션 전체에서 단 하나의 인스턴스만 존재하도록 제한한다.
* 설정, 로깅, 데이터베이스 연결 객체에 자주 사용된다.

##### (2) 예시

```python
class Singleton:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super().__new__(cls)
        return cls._instance
```

##### (3) Pythonic 접근 — 데코레이터 활용

```python
def singleton(cls):
    instances = {}
    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    return get_instance

@singleton
class Config:
    pass
```

> ✅ Python에서는 “모듈 단위”가 이미 싱글톤이므로,
> 전역 설정은 **모듈 자체로 관리하는 것이 더 자연스러운 방법**이다.

---

#### 4. Strategy Pattern — 알고리즘 교체 가능 구조

##### (1) 개념

* 특정 동작(알고리즘)을 런타임에 교체할 수 있게 한다.
* 조건문 대신 **함수나 객체를 주입하여 동작을 바꾸는 방식**이다.

##### (2) 예시

```python
from typing import Callable

class PaymentProcessor:
    def __init__(self, strategy: Callable):
        self.strategy = strategy

    def pay(self, amount):
        return self.strategy(amount)

def pay_credit(amount): return f"💳 {amount}원 카드 결제"
def pay_cash(amount): return f"💵 {amount}원 현금 결제"

processor = PaymentProcessor(pay_credit)
print(processor.pay(10000))
processor.strategy = pay_cash
print(processor.pay(10000))
```

> 💡 Python에서는 Strategy를 클래스보다 **함수형 인터페이스로 표현**하는 것이 간결하다.

---

#### 5. Observer Pattern — 이벤트 기반 반응 구조

##### (1) 개념

* 한 객체의 상태 변화가 다른 객체에 자동으로 전달되는 구조.
* GUI, 데이터 스트림, 이벤트 기반 서비스에서 자주 사용된다.

##### (2) 예시

```python
class Subject:
    def __init__(self):
        self._observers = []

    def attach(self, observer):
        self._observers.append(observer)

    def notify(self, data):
        for obs in self._observers:
            obs.update(data)

class Observer:
    def update(self, data):
        print(f"🔔 데이터 변경 감지: {data}")

subject = Subject()
observer = Observer()
subject.attach(observer)
subject.notify("New Event")
```

##### (3) Pythonic 접근 — 콜백 / asyncio.Queue

```python
import asyncio

async def observer(queue):
    while True:
        data = await queue.get()
        print(f"[Observer] {data}")

async def main():
    q = asyncio.Queue()
    asyncio.create_task(observer(q))
    await q.put("비동기 이벤트 발생")

asyncio.run(main())
```

> ✅ Observer는 asyncio 환경에서 “Event-driven Queue”로 자연스럽게 표현된다.

---

#### 6. Adapter Pattern — 인터페이스 호환성 확보

##### (1) 개념

* 서로 다른 인터페이스를 가진 객체를 **통일된 방식으로 변환(Adapter)** 하는 패턴이다.
* 외부 라이브러리나 레거시 코드 통합 시 유용하다.

##### (2) 예시

```python
class OldPrinter:
    def print_text(self, msg): print(f"[OLD] {msg}")

class NewPrinter:
    def print(self, msg): print(f"[NEW] {msg}")

class PrinterAdapter:
    def __init__(self, adaptee):
        self.adaptee = adaptee

    def print(self, msg):
        if hasattr(self.adaptee, "print_text"):
            return self.adaptee.print_text(msg)
        return self.adaptee.print(msg)

printer = PrinterAdapter(OldPrinter())
printer.print("Hello")
printer = PrinterAdapter(NewPrinter())
printer.print("Hello")
```

> 💡 Adapter는 “외부 라이브러리의 인터페이스를 내부 코드 표준에 맞추는” 핵심 도구이다.

---

#### 7. Facade Pattern — 복잡한 서브시스템 단순화

##### (1) 개념

* 여러 하위 모듈을 하나의 단순한 API로 감싼다.
* “**단일 진입점**”을 제공하여 복잡한 서브 시스템 접근을 단순화한다.

##### (2) 예시

```python
class DB:
    def connect(self): print("DB 연결 완료")

class Cache:
    def initialize(self): print("캐시 준비 완료")

class ServerFacade:
    def __init__(self):
        self.db = DB()
        self.cache = Cache()

    def start(self):
        self.db.connect()
        self.cache.initialize()
        print("서버 구동 완료 ✅")

server = ServerFacade()
server.start()
```

> ✅ Facade는 모듈 초기화, 서버 부팅, 복잡한 초기 로직을 간결하게 관리하는 대표적 구조다.

---

#### 8. Command Pattern — 요청 캡슐화

##### (1) 개념

* 명령(요청)을 객체로 캡슐화하여 큐에 저장하거나 취소/재실행할 수 있는 구조.

##### (2) 예시

```python
class Command:
    def execute(self): pass

class PrintCommand(Command):
    def __init__(self, msg): self.msg = msg
    def execute(self): print(self.msg)

class Invoker:
    def __init__(self):
        self.history = []

    def run(self, cmd):
        self.history.append(cmd)
        cmd.execute()

invoker = Invoker()
invoker.run(PrintCommand("Hello"))
invoker.run(PrintCommand("World"))
```

> 💡 Command 패턴은 “이력 기반 작업 관리(Undo/Redo, Job Queue)”에 자주 활용된다.

---

#### 9. 종합 비교표

| 패턴        | 핵심 목적      | Pythonic 대체     |
| --------- | ---------- | --------------- |
| Factory   | 객체 생성 캡슐화  | dict + callable |
| Singleton | 전역 인스턴스 제한 | 모듈 or decorator |
| Strategy  | 알고리즘 교체 가능 | 함수 주입           |
| Observer  | 이벤트 반응형 구조 | asyncio.Queue   |
| Adapter   | 인터페이스 호환   | Duck Typing     |
| Facade    | 복잡도 은닉     | 초기화 Wrapper     |
| Command   | 요청 캡슐화     | 큐 기반 Job 구조     |

---

#### 10. 결론

* Python의 설계 패턴은 “**클래스 구조보다 동작의 일관성**”에 중점을 둔다.
* 동적 타이핑, 함수형 특성, 일급 객체 덕분에 대부분의 패턴을 **간결하게 표현**할 수 있다.
* 패턴을 암기하는 것이 아니라, “**언제 어떤 구조를 선택해야 하는가**”를 이해하는 것이 핵심이다.

> 🎯 **핵심 문장:**
> “패턴은 복잡성을 감추는 기술이 아니라, 복잡성을 설명하는 언어다.”

