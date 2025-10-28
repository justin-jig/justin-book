---
title: "Python 설치 가이드 (Installation Guide)"
date: 2025-10-28
---


#### 요약
- 본 문서는 **Python 백엔드 개발 환경 구축의 출발점**으로,  
  시스템에 Python을 설치하고, 프로젝트 단위로 독립된 실행 환경을 구성하는 방법을 다룬다.  
- 운영체제별 설치 명령, 권장 버전 관리 방식(pyenv), 가상환경(venv) 생성 절차를 포함한다.  
- 모든 설치 과정은 **실제 백엔드 서비스 환경(개발/테스트/배포)** 과 동일한 버전 일관성을 유지하는 것을 목표로 한다.  

##### 참고자료
- [Python Downloads](https://www.python.org/downloads/)
- [pyenv GitHub Repository](https://github.com/pyenv/pyenv)
- [Python venv Documentation](https://docs.python.org/3/library/venv.html)

---

#### 1. Python 설치 개요
Python은 OS에 따라 기본 버전이 다르며,  
실무에서는 **프로젝트별로 명확한 버전 관리(pyenv)** 를 통해 호환성을 유지하는 것이 중요하다.

| 환경 | 설명 |
|------|------|
| **System Python** | OS에 기본 포함된 Python (예: macOS, Ubuntu) |
| **User-installed Python** | 사용자가 직접 설치한 버전 (권장) |
| **pyenv 관리 버전** | 여러 버전을 공존시키고 프로젝트별로 지정 가능 |

---

#### 2. OS별 설치 절차

##### (1) macOS
```bash
# Homebrew 설치 (없을 경우)
bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Python 최신 버전 설치
brew install python

# 버전 확인
python3 --version
```

##### (2) Ubuntu / Debian 계열

```bash
sudo apt update
sudo apt install -y python3 python3-pip python3-venv
python3 --version
```

##### (3) Windows

1. [python.org/downloads](https://www.python.org/downloads/) 에서 설치 파일 다운로드
2. 설치 시 **“Add Python to PATH”** 체크박스 반드시 활성화
3. PowerShell에서 버전 확인:

   ```powershell
   python --version
   ```

---

#### 3. pyenv를 이용한 버전 관리

##### (1) pyenv 설치

```bash
# Ubuntu 예시
curl https://pyenv.run | bash
```

설치 후, 다음 라인을 shell 초기화 파일(`~/.bashrc` 또는 `~/.zshrc`)에 추가한다.

```bash
export PATH="$HOME/.pyenv/bin:$PATH"
eval "$(pyenv init -)"
```

##### (2) Python 버전 설치

```bash
pyenv install 3.12.4
pyenv global 3.12.4
python --version
```

##### (3) 프로젝트별 버전 고정

프로젝트 루트에 `.python-version` 파일이 자동 생성된다.

```bash
cd ~/project/backend
pyenv local 3.12.4
```

---

#### 4. pip 및 패키지 관리 기본

| 명령                                | 설명             |
| --------------------------------- | -------------- |
| `pip install package`             | 패키지 설치         |
| `pip list`                        | 설치된 목록 확인      |
| `pip freeze > requirements.txt`   | 현재 환경 패키지 내보내기 |
| `pip install -r requirements.txt` | 동일 환경 재현       |

패키지 관리 시 **requirements.txt** 또는 **Poetry** 사용을 권장한다.

---

#### 5. venv를 이용한 가상환경 생성

```bash
# 가상환경 생성
python -m venv .venv

# 가상환경 활성화
source .venv/bin/activate     # macOS/Linux
.\.venv\Scripts\activate      # Windows PowerShell

# 가상환경 비활성화
deactivate
```

가상환경을 프로젝트 루트에 `.venv`로 생성해두면 IDE(VSCode, PyCharm)에서 자동 인식된다.

---

#### 6. 환경 검증 및 초기 설정 체크리스트

| 항목        | 확인 명령              | 정상 결과 예시                          |
| --------- | ------------------ | --------------------------------- |
| Python 버전 | `python --version` | 3.12.4                            |
| pip 버전    | `pip --version`    | pip 24.0                          |
| 가상환경      | `which python`     | ~/.venv/bin/python                |
| pyenv 적용  | `pyenv version`    | 3.12.4 (set by ~/.python-version) |

---

#### 7. 결론

* Python 설치는 **“전역 버전 관리(pyenv)” + “프로젝트별 격리(venv)”** 조합이 가장 안정적이다.
* 이를 통해 OS, 팀, 배포 환경 간의 버전 차이로 인한 충돌을 최소화할 수 있다.
* 이후 단계에서는 `02-venv-and-pyenv.md` 에서 버전·가상환경 관리 심화 구성을 다룬다.

---