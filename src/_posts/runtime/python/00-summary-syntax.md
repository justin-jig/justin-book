---
title: "Python 문법 요약 (Syntax Summary)"
date: 2025-10-29
---

#### 요약

- 이 문서는 Python의 **핵심 문법 요소를 빠르게 복습**하기 위한 요약 자료
- 초심자부터 실무 개발자까지 공통적으로 활용할 수 있는 **필수 구문, 제어문, 자료형, 함수, 클래스 문법**을 중심으로 정리


##### 참고자료

* [Python 공식 문서](https://docs.python.org/3/)
* [PEP 8 — Style Guide for Python Code](https://peps.python.org/pep-0008/)
* [Real Python Tutorials](https://realpython.com/)

---

### 핵심 항목 개요

| 구분 | 주요 문법 요소 | 키워드/예시 |
|------|----------------|--------------|
| **기초 구조** | 변수, 주석, 들여쓰기 | `x = 10`, `# comment` |
| **자료형** | 숫자, 문자열, 리스트, 튜플, 딕셔너리, 세트 | `int`, `str`, `list`, `dict` |
| **제어문** | 조건문, 반복문, 예외처리 | `if`, `for`, `while`, `try` |
| **함수** | 정의, 매개변수, 반환 | `def`, `lambda`, `return` |
| **클래스** | 객체지향, 상속, 캡슐화 | `class`, `__init__`, `super()` |
| **모듈** | import, 패키지, main | `import`, `from`, `if __name__ == '__main__'` |

---

## 1️. 기본 문법 구조

```python
# 변수와 출력
name = "Python"
version = 3.12
print(f"{name} v{version}")

# 주석
# 한 줄 주석
"""
여러 줄 주석 또는 docstring
"""
```

* **식별자 규칙**: 알파벳/숫자/언더스코어, 숫자로 시작 불가
* **대소문자 구분**: `Name` ≠ `name`
* **들여쓰기(Indentation)**: 공백 4칸이 권장, 블록 구분에 `{}` 대신 사용

---

## 2️. 자료형 (Data Types)

| 자료형                       | 예시                   | 특징           |
| ------------------------- | -------------------- | ------------ |
| `int`, `float`, `complex` | `10`, `3.14`, `1+2j` | 숫자형          |
| `str`                     | `"Hello"`            | 문자열, 슬라이싱 가능 |
| `list`                    | `[1, 2, 3]`          | 변경 가능, 순서 유지 |
| `tuple`                   | `(1, 2, 3)`          | 변경 불가        |
| `dict`                    | `{"a": 1, "b": 2}`   | 키-값 쌍        |
| `set`                     | `{1, 2, 3}`          | 중복 없음        |

```python
nums = [1, 2, 3]
nums.append(4)
print(nums[1:3])  # [2, 3]

user = {"name": "Alice", "age": 25}
print(user.get("age"))
```

---

## 3️. 제어문 (Control Flow)

### ▶ 조건문

```python
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "C"
```

### ▶ 반복문

```python
for i in range(5):
    print(i)

while count < 10:
    count += 1
```

* `break`, `continue`, `else`(루프 종료 시 실행) 사용 가능

---

## 4️. 함수 (Function)

```python
def add(a, b=0):
    """두 수의 합을 반환"""
    return a + b

result = add(5, 3)
```

* **가변 인자**

  ```python
  def merge(*args, **kwargs):
      print(args, kwargs)
  ```

* **람다 함수**

  ```python
  square = lambda x: x ** 2
  print(square(3))
  ```

---

## 5️. 클래스 (Object-Oriented)

```python
class User:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def greet(self):
        return f"Hello, I'm {self.name}"

class Admin(User):
    def __init__(self, name, age, role="admin"):
        super().__init__(name, age)
        self.role = role
```

* **특수 메서드** (`__init__`, `__str__`, `__repr__`, `__len__`, `__eq__`)
* **상속/오버라이딩**: `super()` 사용
* **클래스 변수 / 인스턴스 변수** 구분

---

## 6️. 예외 처리 (Error Handling)

```python
try:
    x = 10 / 0
except ZeroDivisionError as e:
    print("0으로 나눌 수 없습니다:", e)
else:
    print("성공적으로 실행됨")
finally:
    print("항상 실행")
```

* 사용자 정의 예외

  ```python
  class MyError(Exception):
      pass
  ```

---

## 7️. 모듈 & 패키지

```python
# 모듈 가져오기
import math
from datetime import datetime

print(math.sqrt(16))

# 모듈 직접 실행 여부 확인
if __name__ == "__main__":
    print("이 파일이 직접 실행되었습니다.")
```

* **패키지 구조**

  ```
  my_package/
  ├── __init__.py
  ├── module_a.py
  └── module_b.py
  ```

---

## 8️. 리스트 컴프리헨션 & 제너레이터

```python
# 리스트 컴프리헨션
squares = [x ** 2 for x in range(5)]

# 제너레이터 표현식
gen = (x ** 2 for x in range(5))
for n in gen:
    print(n)
```

* 메모리 효율적 코드 작성의 핵심 구문

---

## 9️. 주요 내장 함수 요약

| 구분  | 함수                                    | 설명           |
| --- | ------------------------------------- | ------------ |
| 컬렉션 | `len()`, `sum()`, `min()`, `max()`    | 시퀀스 길이, 합계 등 |
| 변환  | `int()`, `str()`, `list()`, `tuple()` | 타입 변환        |
| 순회  | `enumerate()`, `zip()`, `sorted()`    | 반복 편의        |
| 함수형 | `map()`, `filter()`, `reduce()`       | 고차 함수        |
| 입출력 | `input()`, `print()`, `open()`        | 표준 입출력       |

---

