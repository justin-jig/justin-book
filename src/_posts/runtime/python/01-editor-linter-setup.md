---
title: "에디터 및 린터 환경 설정 (Editor & Linter Setup)"
date: 2025-10-28
---

#### 요약
- 본 문서는 Python 백엔드 개발 환경에서 **일관된 코드 스타일, 자동 포맷팅, 정적 분석 환경**을 구축하는 방법을 다룬다.  
- VSCode를 기준으로 **Black**, **isort**, **Pylint**, **Mypy** 등의 대표 도구를 설정하는 절차를 포함한다.  
- 목표는 “**코드 품질 자동화 + 스타일 표준화 + 오류 조기 검출**”이다.  

##### 참고자료
- [Black Formatter 공식 문서](https://black.readthedocs.io/en/stable/)
- [Pylint 공식 문서](https://pylint.pycqa.org/)
- [Mypy 공식 문서](https://mypy.readthedocs.io/en/stable/)
- [VSCode Python Extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python)

---

#### 1. 개요
Python은 자유도가 높은 언어이기 때문에  
**코드 스타일 불일치**, **미사용 변수**, **타입 불일치** 등의 문제가 자주 발생한다.  

이를 예방하기 위해 다음 네 가지 자동화 툴을 함께 사용하는 것을 권장한다.

| 도구 | 역할 | 주요 목적 |
|------|------|-----------|
| **Black** | 코드 자동 포맷팅 | 스타일 일관성 유지 |
| **isort** | import 정렬 | 모듈 정렬 표준화 |
| **Pylint** | 코드 정적 분석 | 문법·구조적 오류 탐지 |
| **Mypy** | 타입 힌트 검사 | 타입 안정성 확보 |

---

#### 2. VSCode 기본 설정

##### (1) 필수 확장 프로그램
| 확장명 | 설명 |
|--------|------|
| **Python** (`ms-python.python`) | Python 코드 실행 및 디버깅 |
| **Pylance** (`ms-python.vscode-pylance`) | IntelliSense 및 타입 분석 |
| **Black Formatter** (`ms-python.black-formatter`) | 자동 코드 포매터 |
| **isort** (`ms-python.isort`) | import 정렬 자동화 |

##### (2) `settings.json` 예시
```json
{
    "python.defaultInterpreterPath": ".venv/bin/python",
    "python.analysis.typeCheckingMode": "strict",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.organizeImports": true,
        "source.fixAll": true
    },
    "[python]": {
        "editor.defaultFormatter": "ms-python.black-formatter"
    }
}
```

> 💡 `formatOnSave` 옵션을 활성화하면 저장 시 자동으로 Black + isort가 적용된다.

---

#### 3. Black 설정 (코드 포맷터)

##### (1) 설치

```bash
pip install black
```

##### (2) 실행

```bash
black src/
```

##### (3) pyproject.toml 설정

```toml
[tool.black]
line-length = 100
target-version = ["py312"]
skip-string-normalization = true
```

| 옵션                          | 설명           |
| --------------------------- | ------------ |
| `line-length`               | 한 줄 최대 길이    |
| `target-version`            | Python 버전 지정 |
| `skip-string-normalization` | 작은따옴표 유지 옵션  |

---

#### 4. isort 설정 (Import 정렬기)

##### (1) 설치

```bash
pip install isort
```

##### (2) 실행

```bash
isort src/
```

##### (3) 설정 예시

```toml
[tool.isort]
profile = "black"
line_length = 100
known_first_party = ["app"]
```

> 💡 Black과 isort를 함께 사용할 때는 반드시 `profile = "black"`으로 맞춰야
> 포맷 충돌이 발생하지 않는다.

---

#### 5. Pylint 설정 (정적 코드 분석기)

##### (1) 설치

```bash
pip install pylint
```

##### (2) 실행

```bash
pylint src/
```

##### (3) `.pylintrc` 기본 설정

```ini
[MASTER]
ignore = migrations, tests
max-line-length = 100

[MESSAGES CONTROL]
disable = C0114, C0115, C0116  # Docstring 관련 경고 비활성화
```

| 메시지 코드 | 설명               |
| ------ | ---------------- |
| C0114  | 모듈 Docstring 누락  |
| C0115  | 클래스 Docstring 누락 |
| C0116  | 함수 Docstring 누락  |

> 💡 팀 내에서 문서화 기준이 따로 있을 경우 Docstring 관련 경고를 끌 수 있다.

---

#### 6. Mypy 설정 (정적 타입 검사기)

##### (1) 설치

```bash
pip install mypy
```

##### (2) 실행

```bash
mypy src/
```

##### (3) 설정 예시

```ini
[mypy]
python_version = 3.12
disallow_untyped_defs = True
ignore_missing_imports = True
warn_unused_ignores = True
strict_optional = True
```

> ✅ `disallow_untyped_defs = True` 옵션은 모든 함수 정의에 타입 힌트를 강제한다.

---

#### 7. 린터/포매터 통합 자동화 예시

##### (1) pre-commit 훅 설치

```bash
pip install pre-commit
pre-commit install
```

##### (2) `.pre-commit-config.yaml` 예시

```yaml
repos:
  - repo: https://github.com/psf/black
    rev: 24.4.2
    hooks:
      - id: black
  - repo: https://github.com/pycqa/isort
    rev: 5.13.2
    hooks:
      - id: isort
  - repo: https://github.com/pycqa/pylint
    rev: v3.2.3
    hooks:
      - id: pylint
```

> 💡 커밋 시 자동으로 코드 포맷과 린트 검사를 수행하여,
> PR 이전 단계에서 코드 품질을 보장할 수 있다.

---

#### 8. 결론

* **Black + isort + Pylint + Mypy** 조합은 Python 백엔드 표준 품질 관리 도구 세트다.
* VSCode와의 통합으로 저장 시 자동 포맷 및 오류 검출이 가능하다.
* 린터와 타입 체크는 단순한 형식 규제가 아니라,
  **코드의 신뢰성과 유지보수성 확보 수단**으로 활용해야 한다.

