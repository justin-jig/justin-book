---
title: "의존성 및 패키지 관리 (Dependency Management)"
date: 2025-10-28
---


#### 요약
- 본 문서는 Python 프로젝트에서 **패키지 의존성을 효율적으로 관리하고 재현성 있는 환경을 유지하는 방법**을 다룬다.  
- `pip`, `requirements.txt`, `Poetry`, `pip-tools` 등의 대표적인 도구를 비교하며,  
  실무에서 안정적이고 자동화된 패키지 관리 전략을 제시한다.  
- 목표는 “**환경 일관성 + 배포 안정성 + 협업 호환성**” 확보이다.  

##### 참고자료
- [Python Packaging User Guide](https://packaging.python.org/en/latest/)
- [Poetry 공식 문서](https://python-poetry.org/docs/)
- [pip-tools GitHub](https://github.com/jazzband/pip-tools)

---

#### 1. 개요
Python의 의존성 관리는 단순히 패키지를 설치하는 것 이상이다.  
서로 다른 패키지 버전이 충돌하거나, 운영 환경과 개발 환경의 버전이 달라질 경우  
서비스가 정상 동작하지 않는 경우가 많다.  

이를 방지하기 위해 다음 세 가지 원칙을 따른다.

1. **의존성 명시화:** requirements.txt 또는 pyproject.toml로 버전 고정  
2. **환경 격리:** venv나 Poetry 가상환경을 사용  
3. **동일 환경 재현:** 의존성 파일을 기반으로 일관된 설치 수행  

---

#### 2. pip 기본 패키지 관리

##### (1) 패키지 설치
```bash
pip install requests
pip install fastapi==0.115.0
```

##### (2) 현재 설치 목록 확인

```bash
pip list
```

##### (3) 패키지 제거

```bash
pip uninstall requests
```

##### (4) 패키지 버전 고정 파일 생성

```bash
pip freeze > requirements.txt
```

##### (5) 동일 환경 복원

```bash
pip install -r requirements.txt
```

| 명령                 | 역할              | 비고            |
| ------------------ | --------------- | ------------- |
| `pip install`      | 패키지 설치          | PyPI에서 다운로드   |
| `pip freeze`       | 현재 환경 패키지 목록 출력 | 버전 포함         |
| `requirements.txt` | 의존성 정의 파일       | 협업 및 배포 표준 포맷 |

---

#### 3. Poetry를 이용한 고급 의존성 관리

##### (1) Poetry 설치

```bash
curl -sSL https://install.python-poetry.org | python3 -
```

##### (2) 프로젝트 초기화

```bash
poetry init
# 또는
poetry new backend-service
```

##### (3) 의존성 추가 및 제거

```bash
poetry add fastapi uvicorn
poetry remove requests
```

##### (4) 의존성 파일 구조

```plaintext
pyproject.toml      # 선언적 메타 정보 및 패키지 목록
poetry.lock         # 고정된 버전 잠금 파일 (환경 재현)
```

##### (5) 설치 및 실행

```bash
poetry install
poetry shell
```

| 파일                 | 역할                    |
| ------------------ | --------------------- |
| **pyproject.toml** | 의존성 및 빌드 설정을 선언적으로 정의 |
| **poetry.lock**    | 버전 고정 및 동일 환경 재현 보장   |

> 💡 **Poetry**는 `pip + venv + requirements.txt` 를 모두 통합한 방식으로,
> 복잡한 의존성 충돌을 자동으로 해결하고, 버전 호환성을 유지한다.

---

#### 4. pip-tools를 이용한 버전 고정 관리

##### (1) 설치

```bash
pip install pip-tools
```

##### (2) requirements.in → requirements.txt 변환

```bash
# 선언적 의존성 정의
echo "fastapi" > requirements.in
echo "uvicorn" >> requirements.in

# 의존성 해석 및 고정 파일 생성
pip-compile
```

결과:

```plaintext
# requirements.txt
fastapi==0.115.0
uvicorn==0.30.3
```

##### (3) 설치

```bash
pip install -r requirements.txt
```

> ✅ pip-tools는 **CI 환경**이나 **대규모 팀 협업**에서 reproducible build를 보장한다.

---

#### 5. 환경별 requirements 파일 분리 전략

| 파일명                     | 용도     | 설명                  |
| ----------------------- | ------ | ------------------- |
| `requirements.txt`      | 기본 의존성 | 필수 실행 환경            |
| `requirements-dev.txt`  | 개발 전용  | lint, test, debug 등 |
| `requirements-prod.txt` | 배포 전용  | 성능·보안 검증 패키지        |

##### 예시

```plaintext
# requirements-dev.txt
-r requirements.txt
pytest
black
mypy
```

설치 명령:

```bash
pip install -r requirements-dev.txt
```

---

#### 6. 버전 충돌 해결 가이드

| 증상                              | 원인           | 해결책                             |
| ------------------------------- | ------------ | ------------------------------- |
| `pkg_resources.VersionConflict` | 동일 패키지 중복 설치 | `pip uninstall <pkg>` 후 재설치     |
| `DependencyResolutionError`     | 종속성 불일치      | `pip check` 또는 Poetry 의존성 재해석   |
| `ModuleNotFoundError`           | 가상환경 미활성화    | `source .venv/bin/activate` 재확인 |
| `Incompatible Python Version`   | Python 버전 차이 | `pyenv local` 로 버전 지정           |

---

#### 7. 결론

* `pip`은 기본이지만, **Poetry 또는 pip-tools**를 사용하면 훨씬 안정적인 버전 관리가 가능하다.
* 실무에서는 `pyenv + venv + Poetry` 조합이 가장 널리 쓰이며,
  배포 환경에서도 동일 버전이 재현된다.
* 패키지 관리의 핵심은 **명시적 버전 고정**과 **환경 격리**이다.
  이를 통해 협업, 테스트, 배포의 모든 단계에서 예측 가능한 동작을 보장할 수 있다.
