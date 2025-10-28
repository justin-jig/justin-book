---
title: "예외 처리와 로깅 시스템 (Error Handling & Logging)"
date: 2025-10-28
---

#### 요약
- 본 문서는 Python의 **예외 처리 구조(Exception Handling)** 와 **로깅(logging)** 시스템을 통합적으로 설명한다.  
- `try-except-finally` 구문, 사용자 정의 예외, 로깅 레벨 관리, 포맷 설정, 핸들러 구성법을 포함한다.  
- 목표는 **안정적인 오류 처리 흐름과 진단 가능한 로그 체계 구축**이다.  

##### 참고자료
- [Python Exception Handling](https://docs.python.org/3/tutorial/errors.html)
- [logging — Python Docs](https://docs.python.org/3/library/logging.html)
- [Best Practices for Logging](https://realpython.com/python-logging/)

---

#### 1. 예외 처리 기본 구조

Python의 예외(Exception)는 프로그램 실행 중 발생하는 오류를 제어하기 위한 구조이다.  
예외는 프로그램을 비정상 종료시키는 대신, **예측 가능한 흐름으로 전환**시킨다.

```python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("0으로 나눌 수 없습니다.")
finally:
    print("종료 처리")
```

출력:

```
0으로 나눌 수 없습니다.
종료 처리
```

| 블록        | 설명                    |
| --------- | --------------------- |
| `try`     | 예외 발생 가능 코드 실행        |
| `except`  | 예외 발생 시 처리 로직 수행      |
| `else`    | 예외 없을 때만 실행           |
| `finally` | 항상 실행되는 블록 (리소스 정리 등) |

---

#### 2. 주요 내장 예외 클래스

| 예외                  | 설명                |
| ------------------- | ----------------- |
| `ValueError`        | 잘못된 값 전달          |
| `TypeError`         | 잘못된 자료형 사용        |
| `KeyError`          | 존재하지 않는 딕셔너리 키 접근 |
| `IndexError`        | 인덱스 범위 초과         |
| `FileNotFoundError` | 파일 경로 오류          |
| `ZeroDivisionError` | 0으로 나누기 시도        |
| `RuntimeError`      | 실행 중 일반 오류        |

> 💡 `Exception`은 모든 사용자 정의 예외의 기본 클래스이며,
> 특정 상황에 맞게 상속하여 예외를 세분화할 수 있다.

---

#### 3. 사용자 정의 예외 (Custom Exception)

```python
class ValidationError(Exception):
    """입력 검증 오류"""
    def __init__(self, field: str, message: str):
        super().__init__(f"[{field}] {message}")

def validate_age(age: int):
    if age < 0:
        raise ValidationError("age", "음수는 허용되지 않습니다.")
```

```python
try:
    validate_age(-1)
except ValidationError as e:
    print(e)
```

출력:

```
[age] 음수는 허용되지 않습니다.
```

> ✅ 커스텀 예외를 정의하면
> **로깅 및 에러 메시지 포맷을 일관성 있게 관리**할 수 있다.

---

#### 4. 예외 체이닝(Exception Chaining)

Python은 내부적으로 발생한 예외를 새로운 예외와 연결하여
**원인 예외(cause)** 를 함께 표시할 수 있다.

```python
try:
    int("abc")
except ValueError as e:
    raise RuntimeError("변환 실패") from e
```

출력:

```
RuntimeError: 변환 실패
ValueError: invalid literal for int() with base 10: 'abc'
```

> 💡 `raise ... from e` 패턴은
> “원인 예외 → 결과 예외” 관계를 명확히 하여 디버깅에 유용하다.

---

#### 5. 로깅 기본 구조

`logging` 모듈은 Python의 표준 로그 시스템이다.
기본 사용법은 다음과 같다.

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

logging.info("서버 시작")
logging.error("예외 발생")
```

출력 예시:

```
2025-10-28 12:30:11 [INFO] 서버 시작
2025-10-28 12:30:11 [ERROR] 예외 발생
```

---

#### 6. 로그 레벨별 구분

| 레벨         | 상수명 | 사용 목적            |
| ---------- | --- | ---------------- |
| `DEBUG`    | 10  | 상세 진단용 (개발 단계)   |
| `INFO`     | 20  | 정상 동작 정보         |
| `WARNING`  | 30  | 잠재적 문제 경고        |
| `ERROR`    | 40  | 실행 오류 (예외 처리 필요) |
| `CRITICAL` | 50  | 시스템 중단 수준 오류     |

> 💡 실무에서는 **DEBUG** 로그는 로컬/개발 환경에서만 사용하고,
> 운영 환경에서는 **INFO 이상** 로그만 출력한다.

---

#### 7. 파일 및 스트림 핸들러 구성

```python
import logging

logger = logging.getLogger("app")
logger.setLevel(logging.DEBUG)

formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(name)s: %(message)s")

# 콘솔 출력 핸들러
stream_handler = logging.StreamHandler()
stream_handler.setFormatter(formatter)

# 파일 저장 핸들러
file_handler = logging.FileHandler("logs/app.log", encoding="utf-8")
file_handler.setFormatter(formatter)

logger.addHandler(stream_handler)
logger.addHandler(file_handler)

logger.info("로그 초기화 완료")
```

> ✅ `logger`를 직접 생성하면 여러 모듈에서 공통 포맷과 레벨을 공유할 수 있다.

---

#### 8. 로깅과 예외 처리 통합

```python
import logging

logger = logging.getLogger("app")

def process_data(data: str):
    try:
        if not data:
            raise ValueError("데이터가 비어있습니다.")
        return data.upper()
    except Exception as e:
        logger.exception(f"데이터 처리 중 오류: {e}")
```

출력:

```
ERROR:app:데이터 처리 중 오류: 데이터가 비어있습니다.
Traceback (most recent call last):
  ...
```

> 💡 `logger.exception()`은 예외 스택 트레이스를 자동으로 포함한다.
> 테스트, CI/CD, 운영 환경 모두에서 유용하다.

---

#### 9. 로그 출력 형식 예시

```plaintext
%(asctime)s  로그 발생 시각
%(levelname)s  로그 레벨
%(name)s       로거 이름
%(filename)s   실행 파일명
%(lineno)d     로그 발생 라인
%(message)s    실제 로그 메시지
```

##### 예시 포맷

```python
"%(asctime)s [%(levelname)s] %(filename)s:%(lineno)d → %(message)s"
```

---

#### 10. 로깅 모범 사례

| 항목               | 권장 방식                                     |
| ---------------- | ----------------------------------------- |
| **로그 레벨 관리**     | 환경변수(`LOG_LEVEL`)로 설정                     |
| **파일 분리**        | `access.log`, `error.log` 등 기능별 분리        |
| **순환 로그**        | `logging.handlers.RotatingFileHandler` 활용 |
| **구조화 로그(JSON)** | ELK, Loki, Promtail 연동 대비                 |
| **민감정보 필터링**     | 계정/비밀번호/토큰은 마스킹 처리                        |

```python
from logging.handlers import RotatingFileHandler

handler = RotatingFileHandler(
    "logs/app.log", maxBytes=5_000_000, backupCount=5, encoding="utf-8"
)
```

---

#### 11. 결론

* 예외 처리는 **프로그램 안정성의 핵심 메커니즘**이며,
  로깅은 이를 **진단 가능한 형태로 시각화**한다.
* `try-except-finally`를 적절히 사용하고,
  `logging` 모듈로 일관된 포맷과 레벨을 유지해야 한다.
* 로깅 체계가 잘 설계된 백엔드는
  장애 발생 시 원인을 빠르게 파악할 수 있으며,
  **운영 효율성과 신뢰성을 동시에 확보**할 수 있다.

