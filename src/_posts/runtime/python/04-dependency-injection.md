---
title: "의존성 주입(Dependency Injection)과 IoC 설계 (Dependency Injection & Inversion of Control)"
date: 2025-10-28
---

#### 요약
- 본 문서는 Python 백엔드 애플리케이션에서 **의존성 주입(Dependency Injection, DI)** 과  
  **제어의 역전(Inversion of Control, IoC)** 개념을 다룬다.  
- “객체 간 결합도를 줄이고 테스트 가능한 구조”를 만드는 실무형 DI 패턴을  
  클래스, 함수, 데코레이터, 컨테이너 기반으로 모두 소개한다.  
- 목표는 “**명시적인 의존성 관리로 유지보수성과 테스트 효율을 높이는 구조 설계**”이다.

##### 참고자료
- [FastAPI Dependency Injection Docs](https://fastapi.tiangolo.com/tutorial/dependencies/)
- [Python Dependency Injector Library](https://python-dependency-injector.ets-labs.org/)
- [Clean Architecture — Robert C. Martin](https://www.oreilly.com/library/view/clean-architecture/9780134494272/)
- [SOLID Principles in Python — Real Python](https://realpython.com/solid-principles-python/)

---

#### 1. DI(Dependency Injection)란?

| 항목 | 설명 |
|------|------|
| **의존성(Dependency)** | 클래스나 함수가 내부에서 직접 사용하는 외부 객체 |
| **주입(Injection)** | 외부에서 필요한 객체를 전달받는 행위 |
| **IoC(Inversion of Control)** | 객체 생성·제어 권한을 외부(컨테이너, 프레임워크)에 위임 |

> ✅ “의존성 주입”은 단순한 코드 패턴이 아니라,  
> **객체 간 결합을 제어하는 설계 철학**이다.

---

#### 2. 직접 의존 vs 주입된 의존

##### (1) 직접 의존 (Bad)
```python
class UserService:
    def __init__(self):
        self.db = Database()  # 직접 생성 → 강한 결합
```

##### (2) 의존성 주입 (Good)

```python
class UserService:
    def __init__(self, db):
        self.db = db
```

> 💡 테스트, Mock 교체, 다형성 확장에 유리하다.
> "내부에서 생성하지 말고, **필요한 것을 외부로부터 받아라**."

---

#### 3. 함수형 DI — 인자 주입 방식

```python
def get_user(repo, user_id):
    return repo.find(user_id)

class MemoryRepo:
    def find(self, uid): return {"id": uid, "name": "Ingeun"}

repo = MemoryRepo()
user = get_user(repo, 1)
print(user)
```

> ✅ 함수형 스타일 DI는 간단한 데이터 처리, API 라우트, 헬퍼 함수에 적합하다.
> Python의 **일급 함수** 특성과 잘 어울린다.

---

#### 4. 클래스 기반 DI — 생성자 주입(Constructor Injection)

```python
class Repository:
    def get(self): return "DB Connection"

class Service:
    def __init__(self, repository: Repository):
        self.repo = repository

    def process(self):
        print(f"데이터 가져오기: {self.repo.get()}")

service = Service(Repository())
service.process()
```

> ✅ 가장 일반적이며 명확한 주입 방법.
> 인스턴스 간 의존 관계를 **타입 힌트와 함께 명시적으로 관리**할 수 있다.

---

#### 5. Lazy Injection — 지연 주입

##### (1) 개념

* 실행 시점에 필요한 의존성을 동적으로 주입한다.
* 메모리 절약 및 순환 참조 방지에 유리하다.

##### (2) 예시

```python
class Database:
    def connect(self): print("DB 연결 완료")

class Service:
    def __init__(self):
        self._db = None

    @property
    def db(self):
        if self._db is None:
            self._db = Database()  # 최초 접근 시 생성
        return self._db

service = Service()
service.db.connect()
```

> 💡 Lazy Injection은 **초기화 비용이 큰 객체(DB, Client 등)** 에서 자주 사용된다.

---

#### 6. 데코레이터 기반 DI — 함수 단위 의존성 주입

```python
def inject(repo):
    def decorator(func):
        def wrapper(*args, **kwargs):
            return func(repo, *args, **kwargs)
        return wrapper
    return decorator

class Repo:
    def find_all(self): return ["A", "B", "C"]

@inject(Repo())
def list_items(repo):
    return repo.find_all()

print(list_items())  # ['A', 'B', 'C']
```

> ✅ FastAPI의 의존성 시스템도 이 구조를 확장한 형태이다.
> (라우트 핸들러 함수 인자에 주입된 dependency callable)

---

#### 7. IoC Container — 중앙 집중 관리 구조

##### (1) 컨테이너 개념

* 의존 객체를 **컨테이너에 등록(등록/해제/조회)** 하여 중앙에서 관리.
* 인스턴스 생명주기, 스코프, 테스트 교체 용이.

##### (2) 간단한 예시

```python
class Container:
    registry = {}

    @classmethod
    def register(cls, name, obj):
        cls.registry[name] = obj

    @classmethod
    def resolve(cls, name):
        return cls.registry[name]

# 등록
Container.register("db", lambda: "DB Connection")
Container.register("repo", lambda: f"Using {Container.resolve('db')()}")

# 사용
print(Container.resolve("repo")())
```

> ✅ IoC 컨테이너는 서비스 수십 개 이상으로 확장될 때 유용하다.
> (예: **dependency-injector**, **injector**, **wired** 등 라이브러리)

---

#### 8. Mock Injection — 테스트 친화적 구조

##### (1) 예시

```python
class DB:
    def get_user(self, uid): return {"id": uid, "name": "ProdUser"}

class MockDB:
    def get_user(self, uid): return {"id": uid, "name": "MockUser"}

class UserService:
    def __init__(self, db):
        self.db = db

def test_user_service():
    mock_service = UserService(MockDB())
    assert mock_service.db.get_user(1)["name"] == "MockUser"
```

> ✅ 외부 의존성(DB, API, Redis 등)을 격리시켜
> **단위 테스트 속도와 신뢰도**를 높인다.

---

#### 9. DI + Factory + Decorator 결합 구조

```python
from functools import wraps

def inject_factory(factory):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            dep = factory()
            return func(dep, *args, **kwargs)
        return wrapper
    return decorator

def db_factory():
    class DB: 
        def query(self): return "Query Executed"
    return DB()

@inject_factory(db_factory)
def run_query(db):
    print(db.query())

run_query()
```

> ✅ 의존성 주입 + 팩토리 결합은
> **테스트 가능한 인프라 서비스 관리 구조**를 만드는 핵심이다.

---

#### 10. 결론

* DI는 코드의 단순화가 아니라 **관계의 명시화**를 위한 도구이다.
* “생성(Factory)”와 “사용(Service)”의 책임을 분리함으로써
  유지보수성, 테스트성, 확장성이 비약적으로 향상된다.
* Python은 정적 DI 프레임워크보다 **함수형 주입 + 데코레이터 패턴**이 더 자연스럽다.
* 대규모 프로젝트에서는 IoC Container 기반 구조가 **Clean Architecture** 의 핵심 축이 된다.

> 🎯 **핵심 문장:**
> “의존성 주입은 코드를 줄이는 기술이 아니라, 결합도를 설계하는 기술이다.”
