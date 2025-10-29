---
title: "Python 프로젝트 구조 및 패키지 설계 (Package Structure Guide)"
date: 2025-10-28
---

#### 요약
- 본 문서는 Python 백엔드 프로젝트의 **표준 디렉터리 구조와 패키지 구성 원칙**을 다룬다.  
- Python의 모듈 구조, `__init__.py`, import 경로, 패키지 네이밍 규칙을 포함한다.  
- 목표는 **확장성과 유지보수성이 높은 프로젝트 구조**를 정의하는 것이다.  

##### 참고자료
- [Python Packaging Guide](https://packaging.python.org/en/latest/tutorials/packaging-projects/)
- [PEP 8 – Style Guide for Python Code](https://peps.python.org/pep-0008/)
- [Real Python – Structuring Your Project](https://realpython.com/python-application-layouts/)

---

#### 1. 개요
Python은 자유로운 스크립트 언어이지만,  
백엔드 서비스 수준의 프로젝트에서는 **명확한 디렉터리 계층 구조**가 필수적이다.  

구조화된 설계는 다음과 같은 장점을 가진다.

| 항목 | 설명 |
|------|------|
| **가독성** | 모듈 역할이 명확해져 코드 탐색이 용이 |
| **확장성** | 기능별로 디렉터리를 독립시켜 변경 영향 최소화 |
| **배포 용이성** | setup.py 또는 pyproject.toml 구성 시 명확한 경로 지정 가능 |
| **테스트 단순화** | 모듈 단위 테스트가 구조적으로 구분됨 |

---

#### 2. 기본 프로젝트 디렉터리 구조 예시

```plaintext
backend-service/
├── src/
│   ├── app/                      # 핵심 비즈니스 로직
│   │   ├── __init__.py
│   │   ├── config.py             # 환경 변수, 설정 관리
│   │   ├── models/               # 데이터 모델 계층
│   │   ├── services/             # 서비스/비즈니스 로직 계층
│   │   ├── repository/           # 데이터 접근 계층 (DAO)
│   │   ├── utils/                # 공통 유틸리티 함수
│   │   └── exceptions/           # 사용자 정의 예외
│   └── main.py                   # 엔트리 포인트
│
├── tests/                        # 단위 및 통합 테스트
│   ├── __init__.py
│   └── test_app.py
│
├── .venv/                        # 가상환경 (Git 제외)
├── requirements.txt              # 의존성 목록
├── pyproject.toml or setup.py    # 패키징 메타 정보
├── .gitignore
└── README.md
```

> 💡 `src/` 구조는 대규모 프로젝트에서 import 충돌을 방지하고,
> 명확한 **패키지 경로 관리**를 가능하게 한다.

---

#### 3. 모듈과 패키지의 차이

| 구분                | 정의                      | 예시                         |
| ----------------- | ----------------------- | -------------------------- |
| **모듈 (Module)**   | 단일 `.py` 파일             | `config.py`, `utils.py`    |
| **패키지 (Package)** | `__init__.py`를 포함한 디렉터리 | `services/`, `repository/` |

패키지는 내부적으로 여러 모듈을 그룹화하여 재사용성과 구조적 일관성을 높인다.

---

#### 4. import 구조 설계

##### (1) 상대경로 vs 절대경로

```python
# 상대경로
from .config import Settings

# 절대경로
from app.config import Settings
```

| 구분       | 장점                | 단점              |
| -------- | ----------------- | --------------- |
| **상대경로** | 짧고 간결함            | 유지보수 시 경로 혼동 가능 |
| **절대경로** | 명확하고 IDE 자동완성에 유리 | 경로 길이가 길어질 수 있음 |

> 권장 방식: **절대경로 import**
>
> * 대규모 서비스에서는 IDE·LSP 지원이 우수하며, 리팩터링 시 오류 위험이 적다.

---

#### 5. 환경 변수 및 설정 파일 구조

```plaintext
app/
├── config/
│   ├── __init__.py
│   ├── settings.py
│   └── env_loader.py
```

```python
# settings.py
import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DB_URL = os.getenv("DATABASE_URL")
    DEBUG = os.getenv("DEBUG", "false").lower() == "true"
```

> 📘 `dotenv`를 활용하면 `.env` 파일을 쉽게 로드하여
> 코드 내에 민감 정보를 직접 포함하지 않아도 된다.

---

#### 6. 예외 및 유틸리티 계층 설계

```plaintext
app/
├── exceptions/
│   ├── __init__.py
│   └── custom_exceptions.py
├── utils/
│   ├── __init__.py
│   └── date_utils.py
```

```python
# custom_exceptions.py
class ValidationError(Exception):
    """입력 검증 오류"""
    pass
```

> 💡 모든 예외는 **공통 상위 예외 클래스(BaseError)** 를 두고 계층화하면
> 에러 핸들링 및 로깅 처리가 일관된다.

---

#### 7. 패키징을 위한 설정 파일 예시

##### (1) pyproject.toml

```toml
[build-system]
requires = ["setuptools", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "backend-service"
version = "1.0.0"
description = "Python backend service"
authors = [{name="Ingeun Jeong", email="example@email.com"}]
dependencies = [
    "fastapi",
    "uvicorn"
]
```

##### (2) setup.cfg (대안)

```ini
[metadata]
name = backend-service
version = 1.0.0
description = Python backend service

[options]
packages = find:
python_requires = >=3.10
```

> 패키징 설정은 배포 및 테스트 자동화 과정에서
> **의존성 정의와 경로 참조를 명확히 하는 핵심 요소**이다.

---

#### 8. 결론

* 명확한 **src 기반 디렉터리 구조**는 import 충돌을 방지하고 유지보수를 단순화한다.
* 모든 디렉터리는 `__init__.py`를 포함하여 명시적으로 패키지화한다.
* 설정, 예외, 유틸, 서비스 로직을 계층별로 분리하면
  코드 품질과 협업 효율성이 모두 향상된다.
* 구조의 일관성은 Python 백엔드 프로젝트의 **확장성과 안정성의 기반**이다.
