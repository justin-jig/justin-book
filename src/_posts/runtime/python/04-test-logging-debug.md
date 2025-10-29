---
title: "테스트 로그 및 디버깅 환경 설정 (Test Logging & Debug Setup)"
date: 2025-10-28
---
#### 요약
- 본 문서는 Python 백엔드 개발 환경에서 **테스트 실행 중 로그 출력 및 디버깅 환경을 구성하는 방법**을 다룬다.  
- Pytest, logging, dotenv, VSCode Debugger 등의 도구를 사용해  
  **실행 흐름 추적, 에러 재현, 환경 분리 테스트**를 수행할 수 있는 설정 방안을 제시한다.  
- 목표는 “**테스트 중 내부 상태를 명확히 기록하고, 문제를 빠르게 재현할 수 있는 환경**”을 구축하는 것이다.  

##### 참고자료
- [Python logging — 공식 문서](https://docs.python.org/3/library/logging.html)
- [Pytest 공식 문서](https://docs.pytest.org/en/stable/)
- [VSCode Debugging Guide](https://code.visualstudio.com/docs/python/debugging)

---

#### 1. 개요
Python 백엔드 테스트 환경에서는 단순한 결과 검증 외에도  
**실행 흐름, 변수 상태, 예외 발생 시점**을 기록하는 것이 중요하다.  

이를 위해 다음 세 가지 도구를 함께 사용한다.

| 구성 요소 | 역할 | 설명 |
|------------|------|------|
| **logging 모듈** | 실행 로그 출력 | DEBUG ~ ERROR 레벨 기록 |
| **pytest -s 옵션** | stdout 유지 | 테스트 중 print/log 표시 |
| **VSCode Debugger** | 중단점 디버깅 | 특정 함수/변수 상태 추적 |

---

#### 2. 테스트 환경 분리

테스트 실행 시 운영 환경 변수와 충돌을 방지하기 위해  
`.env.test` 파일을 별도로 구성한다.

```bash
# .env.test
DATABASE_URL=sqlite:///test.db
DEBUG=True
LOG_LEVEL=DEBUG
```

Python 코드에서 환경 변수를 로드한다:

```python
from dotenv import load_dotenv
load_dotenv(".env.test")
```

> 💡 테스트 환경에서는 실제 DB, API Key 등을 절대 사용하지 않는다.
> Mock 또는 SQLite 등 경량 스토리지를 이용한다.

---

#### 3. 기본 로깅 설정

##### (1) logging 기본 구성

```python
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.FileHandler("logs/test.log", encoding="utf-8"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger("test_logger")
logger.debug("테스트 로그 초기화 완료")
```

| 옵션              | 설명                                            |
| --------------- | --------------------------------------------- |
| `level`         | 로그 레벨 (DEBUG, INFO, WARNING, ERROR, CRITICAL) |
| `format`        | 출력 형식 정의                                      |
| `FileHandler`   | 파일로 로그 저장                                     |
| `StreamHandler` | 콘솔 출력                                         |

> 💡 테스트 중 발생한 로그를 파일로 저장해두면
> CI 환경에서 실패 원인을 재현하기 쉽다.

---

#### 4. Pytest에서 로그 출력 및 유지

##### (1) Pytest 실행 명령

```bash
pytest -v -s
```

| 옵션   | 설명                           |
| ---- | ---------------------------- |
| `-v` | 테스트 상세 로그 출력                 |
| `-s` | stdout 유지 (print/log 메시지 표시) |

##### (2) Pytest에서 로깅 통합

```python
import logging

def test_sample(caplog):
    logger = logging.getLogger("pytest")
    logger.info("테스트 시작")
    assert 1 + 1 == 2
    logger.info("테스트 완료")

    assert "테스트 시작" in caplog.text
```

> ✅ `caplog`은 Pytest 내장 fixture로,
> 테스트 실행 중 발생한 로그를 수집하고 검증할 수 있다.

---

#### 5. 디버깅 환경 설정 (VSCode)

##### (1) `.vscode/launch.json` 예시

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python: Test Debug",
            "type": "python",
            "request": "launch",
            "program": "${workspaceFolder}/src/main.py",
            "console": "integratedTerminal",
            "envFile": "${workspaceFolder}/.env.test",
            "justMyCode": true
        }
    ]
}
```

##### (2) 디버깅 시 유용한 단축키

| 단축키        | 기능                  |
| ---------- | ------------------- |
| `F5`       | 디버깅 시작              |
| `F9`       | 중단점 설정/해제           |
| `F10`      | 한 줄 실행(Step Over)   |
| `F11`      | 함수 내부 진입(Step Into) |
| `Shift+F5` | 디버깅 종료              |

---

#### 6. 에러 재현 패턴 (로그 기반 디버깅)

테스트 시 **입력 값 + 함수명 + 출력 값**을 함께 기록하면
문제가 발생했을 때 빠르게 원인을 추적할 수 있다.

```python
def divide(a, b):
    logger = logging.getLogger("calc")
    logger.debug(f"입력값: a={a}, b={b}")
    try:
        result = a / b
        logger.debug(f"결과: {result}")
        return result
    except ZeroDivisionError as e:
        logger.error(f"0으로 나눗셈 발생: {e}")
        raise
```

> ⚠️ 단, 실제 운영 환경에서는 `DEBUG` 로그를 출력하지 않고,
> 테스트 환경에서만 활성화한다.

---

#### 7. 테스트 로그 파일 구조 예시

```plaintext
logs/
├── test.log               # 전체 테스트 실행 로그
├── unit/                  # 단위 테스트별 로그
│   ├── test_user.log
│   ├── test_order.log
│   └── test_payment.log
└── debug/                 # 디버깅 단계 상세 로그
    └── variable_dump.log
```

> 💡 테스트 로그를 기능 단위로 분리해두면
> CI 실패 시 특정 테스트만 재실행할 수 있다.

---

#### 8. 결론

* 테스트 시 로그 기록은 단순한 출력이 아니라, **재현성과 신뢰성 확보 수단**이다.
* `logging + Pytest + caplog + VSCode Debugger` 조합은
  테스트 단계에서 발생할 수 있는 모든 예외를 추적 가능하게 한다.
* 테스트 로그는 문제의 원인을 빠르게 파악하고
  코드 수정 이후의 정상 동작을 검증하는 **핵심 근거 자료**가 된다.

