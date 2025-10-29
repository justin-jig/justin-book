---
title: "객체지향 프로그래밍과 데이터클래스 (OOP & Dataclass)"
date: 2025-10-28
---

#### 요약
- 본 문서는 Python의 **객체지향 프로그래밍(OOP)** 개념과 **데이터클래스(dataclass)** 활용 방법을 다룬다.  
- 클래스 정의, 상속, 캡슐화, 다형성, 추상화 개념을 설명하고,  
  Pythonic한 데이터 구조 설계를 위한 `@dataclass` 활용법을 포함한다.  
- 목표는 **가독성·재사용성·유지보수성**을 모두 갖춘 객체 설계 능력을 확보하는 것이다.  

##### 참고자료
- [Python Classes & Objects](https://docs.python.org/3/tutorial/classes.html)
- [dataclasses — Python Docs](https://docs.python.org/3/library/dataclasses.html)
- [PEP 557 – Data Classes](https://peps.python.org/pep-0557/)

---

#### 1. 클래스 기본 구조

##### (1) 클래스 정의
```python
class User:
    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age

    def greet(self):
        return f"Hello, {self.name}!"

user = User("Ingeun", 30)
print(user.greet())  # Hello, Ingeun!
```

| 구성 요소       | 설명                    |
| ----------- | --------------------- |
| `__init__`  | 인스턴스 초기화 메서드 (생성자 역할) |
| `self`      | 현재 객체(인스턴스)를 참조       |
| `method`    | 클래스 내부의 함수            |
| `attribute` | 클래스/인스턴스 변수           |

> 💡 Python의 모든 것은 객체이며, 클래스는 객체 생성을 위한 템플릿이다.

---

#### 2. 클래스 변수와 인스턴스 변수

```python
class Counter:
    count = 0  # 클래스 변수

    def __init__(self):
        Counter.count += 1  # 모든 인스턴스가 공유
        self.id = Counter.count  # 인스턴스 변수

a = Counter()
b = Counter()
print(a.count, b.id)  # 2, 2
```

| 구분      | 선언 위치         | 공유 여부        | 예시        |
| ------- | ------------- | ------------ | --------- |
| 클래스 변수  | 클래스 블록 내부     | ✅ 모든 인스턴스 공유 | `count`   |
| 인스턴스 변수 | `__init__` 내부 | ❌ 개별 인스턴스 고유 | `self.id` |

---

#### 3. 접근 제어와 캡슐화

Python은 완전한 접근 제어자를 지원하지 않지만,
**명명 규칙(Naming Convention)** 으로 접근 수준을 표현한다.

| 구분            | 형태            | 의미                    |
| ------------- | ------------- | --------------------- |
| 공개(Public)    | `self.name`   | 외부 접근 허용              |
| 보호(Protected) | `self._name`  | 내부 사용 권장, 외부 접근 비권장   |
| 비공개(Private)  | `self.__name` | 클래스 내부 전용 (이름 맹글링 수행) |

```python
class Account:
    def __init__(self, balance: int):
        self.__balance = balance  # private

    def deposit(self, amount: int):
        self.__balance += amount

    def get_balance(self):
        return self.__balance
```

> 💡 “진짜 비공개”는 아니며, 내부적으로 `_Account__balance`로 접근 가능하다.

---

#### 4. 상속(Inheritance)

```python
class Animal:
    def speak(self):
        return "Sound"

class Dog(Animal):
    def speak(self):
        return "Woof!"

dog = Dog()
print(dog.speak())  # Woof!
```

| 특징          | 설명                            |
| ----------- | ----------------------------- |
| **상속**      | 상위 클래스의 속성과 메서드를 하위 클래스에서 재사용 |
| **오버라이딩**   | 하위 클래스에서 상위 클래스 메서드 재정의 가능    |
| **super()** | 부모 메서드 호출에 사용                 |

##### super() 예시

```python
class Employee:
    def __init__(self, name):
        self.name = name

class Manager(Employee):
    def __init__(self, name, team):
        super().__init__(name)
        self.team = team
```

---

#### 5. 다형성(Polymorphism)

* 같은 인터페이스로 다양한 동작을 수행할 수 있게 하는 개념

```python
class Shape:
    def area(self):
        raise NotImplementedError

class Circle(Shape):
    def __init__(self, r): self.r = r
    def area(self): return 3.14 * self.r ** 2

class Square(Shape):
    def __init__(self, l): self.l = l
    def area(self): return self.l ** 2

for s in [Circle(3), Square(4)]:
    print(s.area())
```

> ✅ 다형성은 “함수명은 같지만 클래스마다 다른 동작”을 수행하도록 한다.

---

#### 6. 추상화(Abstract Class)

##### (1) abc(Abstract Base Class) 예시

```python
from abc import ABC, abstractmethod

class Repository(ABC):
    @abstractmethod
    def save(self, data): pass

class FileRepository(Repository):
    def save(self, data):
        print("파일 저장:", data)

repo = FileRepository()
repo.save("example")
```

> 추상 클래스는 직접 인스턴스화할 수 없으며,
> **공통 인터페이스 정의** 용도로 사용된다.

---

#### 7. 데이터클래스 (Dataclass)

##### (1) 기본 구조

```python
from dataclasses import dataclass

@dataclass
class User:
    name: str
    age: int
```

자동으로 다음 메서드가 생성된다:

* `__init__()`
* `__repr__()`
* `__eq__()`

```python
u1 = User("Ingeun", 30)
u2 = User("Ingeun", 30)
print(u1 == u2)  # True
print(u1)        # User(name='Ingeun', age=30)
```

##### (2) 기본값 및 필드 설정

```python
from dataclasses import field

@dataclass
class Account:
    owner: str
    balance: int = 0
    tags: list[str] = field(default_factory=list)
```

> ✅ `field(default_factory=list)`는 mutable 객체의 안전한 초기화를 보장한다.

##### (3) 불변 Dataclass

```python
@dataclass(frozen=True)
class Point:
    x: int
    y: int
```

> `frozen=True` 설정 시 모든 속성은 읽기 전용이 되어 **불변 객체(Immutable)** 로 동작한다.

---

#### 8. 클래스 메서드와 정적 메서드

| 구분           | 데코레이터           | 첫 번째 인자 | 설명         |
| ------------ | --------------- | ------- | ---------- |
| **인스턴스 메서드** | 없음              | `self`  | 기본 메서드     |
| **클래스 메서드**  | `@classmethod`  | `cls`   | 클래스 변수 접근  |
| **정적 메서드**   | `@staticmethod` | 없음      | 독립 유틸리티 함수 |

```python
class Math:
    pi = 3.14

    @classmethod
    def circle_area(cls, r):
        return cls.pi * r ** 2

    @staticmethod
    def add(a, b):
        return a + b
```

---

#### 9. 결론

* Python의 클래스는 **데이터 + 동작(메서드)** 을 묶은 구조체이다.
* OOP 핵심 원칙(추상화·상속·다형성·캡슐화)을 활용하면
  복잡한 백엔드 로직을 구조적으로 분리할 수 있다.
* `@dataclass`는 **보일러플레이트 코드를 줄이고**,
  객체를 데이터 중심으로 정의할 때 가장 효율적이다.
* 클래스 설계의 일관성은 Python 백엔드 프로젝트의 **코드 품질과 확장성**을 결정한다.


