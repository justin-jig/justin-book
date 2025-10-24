---
title: " ubuntu nvidia-install"
date: 2025-10-16
---

버전 : Ubuntu 24.04 /
Ubuntu 24.04 / 25.04 HWE 커널(6.8.x 이상) 사용 시, nvidia-dkms-575 패키지 가장 안정적.

### 최근(2024‑2025) 주요 이슈  
| 발생 시점       | 이슈 요약                                               | 해결 / 회피책                                                                                                |
| ----------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **2025-06** | **Driver 575.57.08** – Hopper (sub-rev 3) GPU 부팅 실패 | VBIOS 최신(≥ 96.00.68.xx)으로 업데이트. 드라이버 575.57.12 이상 또는 서버 브랜치( `nvidia-driver-575-server` ) 사용 권장.        |
| **2025-05** | **CUDA 12.9.0 → 12.9.1** FP8 메모리 오류 패치              | CUDA 12.9.1 업데이트 권장 (`sudo apt install cuda-toolkit-12-9`) 후 드라이버 버전 호환성 확인.                            |
| **2025-03** | 커널 6.8.x 업데이트 후 **DKMS 모듈 재빌드 실패**                  | `sudo dkms autoinstall -m nvidia -v 575.xx` 실행 또는 커널 헤더 재설치(`linux-headers-$(uname -r)`) 후 재부팅.         |
| **2025-02** | `nvidia-smi` 불안정 (재부팅 후 모듈 미적재)                     | 550 이하 버전 → **575** 드라이버로 업데이트. `sudo apt install nvidia-driver-575`.                                   |
| **2024-12** | Wayland 세션 전환 시 화면 Freeze 또는 로그인 루프                 | GNOME 세션 로그인 시 Xorg 선택 또는 `sudo apt install xserver-xorg` 설치 후 Xorg 고정.                                 |
| **2024-11** | Secure Boot 활성화 시 드라이버 모듈 로드 실패                     | Secure Boot OFF 또는 MOK 서명 진행(`sudo mokutil --import 키.der`).                                            |
| **2024-09** | **CUDA 12.6 + Driver 550** 조합에서 NVENC/NVDEC 비활성     | Driver ≥ 550.78 업데이트 또는 CUDA 12.7 이상 사용.                                                                |
| **2024-07** | Ubuntu 24.04 업데이트 후 `nouveau` 충돌 발생                 | `/etc/modprobe.d/blacklist-nouveau.conf` 추가 및 `update-initramfs -u` 후 재부팅.                              |
| **2024-05** | Docker 컨테이너 내 GPU 미인식 (`nvidia-container-cli` 에러)   | `nvidia-container-toolkit` 재설치 및 `/etc/nvidia-container-runtime/config.toml` 내 `no-cgroups = false` 확인. |

참고 링크
- [Graphics Driver PPA](https://launchpad.net/~graphics-drivers)
- [NVIDIA 공식 드라이버 설치 가이드](https://docs.nvidia.com/datacenter/tesla/driver-installation-guide)
- [NVIDIA Developer Forum](https://forums.developer.nvidia.com/)
  

## 1. 개요
- Ubuntu 24.04에서는 커널 6.8 이상에서 안정적인 NVIDIA GPU 동작을 위해 다음이 필수입니다:
  - DKMS 모듈 자동 재컴파일 지원
  - Secure Boot 대응 
  - Nouveau 커널 모듈 비활성화
- `.run` 설치 방식과 APT 기반 설치는 **혼용 불가**하다
- **드라이버 → 재부팅 → CUDA Toolkit** 순으로 설치한다. (_혼용 설치 금지: APT ↔ `.run`_)
- Ubuntu 24.04에서는 커널 6.8 이후 **DKMS 재빌드**·**Secure Boot MOK**·**Wayland 대응**이 필수 고려 사항이다.  
- `.run` 인스톨러는 **완전히 self‑contained**라 네트워크가 없는 환경에서도 동작한다.


---

## 2. 사전 준비
NVIDIA 드라이버를 설치하기 전 반드시 아래 항목을 사전 준비해야 한다.


### A. 커널 헤더 및 빌드 도구 설치

- **목적**: NVIDIA 드라이버는 현재 커널에 맞춰 모듈을 빌드해야 하므로, 필수 개발 도구와 헤더 설치가 필요합니다.
- **필요 패키지**: `build-essential`, `dkms`, `linux-headers-$(uname -r)`

#### 온라인 환경
```bash
sudo apt update
sudo apt install build-essential dkms linux-headers-$(uname -r)
```

#### 폐쇄망/USB 환경
1. 위 패키지들을 `.deb` 파일로 다운로드
2. USB를 통해 대상 서버로 복사
3. 다음 명령으로 일괄 설치:
```bash
sudo dpkg -i *.deb
```
> 💡 **DKMS**는 커널 업데이트 후에도 NVIDIA 모듈을 자동 재빌드해주는 도구로, 반드시 설치해야 합니다.

---

### B. Nouveau 드라이버 비활성화

- **목적**: 기본으로 활성화된 오픈소스 Nouveau 드라이버는 NVIDIA 공식 드라이버와 충돌하므로 사전에 비활성화 필요

#### 설정 명령어
```bash
sudo tee /etc/modprobe.d/blacklist-nouveau.conf <<'EOF'
blacklist nouveau
options nouveau modeset=0
EOF
sudo update-initramfs -u
```

#### 적용 확인
```bash
lsmod | grep nouveau
```
> 재부팅 후 위 명령의 출력이 **없다면 비활성화 성공**입니다.

---

### C. Secure Boot 상태 확인

- **확인 명령어**:
```bash
sudo mokutil --sb-state
```

- **Secure Boot가 ON일 경우**:
  - BIOS 설정에서 Secure Boot 비활성화
  - 또는 드라이버 설치 후 MOK 등록 과정을 통해 서명 필요

---

### D. BIOS 그래픽 설정 (데스크탑 한정)

- **권장 설정**: BIOS에서 **Discrete Graphics** 모드 활성화
  - 내장 GPU(iGPU) 대신 외장 GPU(NVIDIA)를 주로 사용하도록 설정
  - 설치 시 충돌 방지 및 성능 최적화 목적

---


### 3. 온라인 설치 절차

#### A. 기존 NVIDIA/CUDA 제거 (선택)
```bash
sudo apt autoremove --purge 'nvidia*' 'cuda*'
```

#### B. 드라이버 설치
```bash
sudo add-apt-repository ppa:graphics-drivers/ppa -y
sudo apt update
sudo apt install nvidia-driver-575 nvidia-dkms-575
```

#### C. 설치 확인
```bash
nvidia-smi
```

---

### 4. 폐쇄망 설치 절차 (.run 기반)

#### A. 온라인 환경에서 `.run` 파일 다운로드
```bash
wget https://us.download.nvidia.com/tesla/575.57.08/NVIDIA-Linux-x86_64-575.57.08.run
sha256sum NVIDIA-Linux-x86_64-575.57.08.run
```

#### B. 오프라인 환경에서 설치
```bash
chmod +x NVIDIA-Linux-x86_64-575.57.08.run
sudo ./NVIDIA-Linux-x86_64-575.57.08.run \
     --silent \
     --no-cc-version-check
```

#### ✅ 꼭 알아야 할 NVIDIA 드라이버 설치 옵션 요약

##### 1. `--silent`
- **설명**: 설치를 무인 모드로 자동 실행
- **사용 이유**: 설치 과정 중 사용자 입력 없이 자동화 가능 (스크립트에 적합)

##### 2. `--dkms`
- **설명**: 커널 모듈을 DKMS 방식으로 설치
- **사용 이유**: 커널 업데이트 시 모듈을 자동으로 재빌드해서 재설치 필요 없음

##### 3. `--no-cc-version-check`
- **설명**: 커널을 컴파일한 GCC 버전과 현재 버전이 달라도 무시하고 설치 진행
- **사용 이유**: 컴파일러 버전 충돌로 인한 설치 실패 방지

##### 4. `--no-opengl-files`
- **설명**: NVIDIA OpenGL 파일 생략
- **사용 이유**: 시스템에 설치된 Mesa 등 기존 OpenGL 구성과의 충돌 방지

##### 5. `--no-precompiled-interface`
- **설명**: NVIDIA가 제공한 미리 빌드된 커널 인터페이스를 사용하지 않고 새로 컴파일
- **사용 이유**: 특정 커널 환경에서 호환성 문제 방지

##### 6. `--no-distro-scripts` *(선택)*
- **설명**: 배포판별 추가 스크립트를 실행하지 않음
- **사용 이유**: 설치 과정 중 불필요한 자동 설정을 방지하고 순수 드라이버만 설치할 경우

---

##### 🎨 OpenGL이란?

**OpenGL (Open Graphics Library)** 는 2D 및 3D 그래픽을 위한 **표준 API**입니다. 다양한 운영체제와 하드웨어에서 작동하며, GPU를 이용해 화면에 도형, 텍스처, 효과 등을 렌더링할 수 있게 해줍니다.

##### NVIDIA 드라이버와의 관계
- NVIDIA 드라이버는 OpenGL을 가속화하는 **자체 라이브러리(libGL)** 를 함께 제공합니다.
- 그러나 **Ubuntu 등 리눅스 배포판은 기본적으로 Mesa**라는 오픈소스 OpenGL 구현체를 사용합니다.
- 이 둘이 충돌하면 **화면 깨짐, 로그인 루프, X 서버 실패** 등의 문제가 발생할 수 있습니다.

> 그래서 OpenGL 파일 설치 여부는 환경에 따라 신중히 선택해야 합니다.

---

#### 🔧 환경별 NVIDIA 설치 옵션 추천

##### ✅ 폐쇄망 환경

- 대부분 서버 또는 데스크탑에서 **X11/GUI 없이 CUDA 용도**로 사용
- Mesa 충돌 회피, 불필요한 기능 제거를 위해 아래 옵션 권장

```bash
sudo ./NVIDIA-Linux-xxx.run \
    --silent \
    --dkms \
    --no-cc-version-check \
    --no-opengl-files \
    --no-precompiled-interface
```

> ⚠️ `--no-opengl-files`를 꼭 넣어서 GUI 관련 충돌 방지  
> ✅ GUI 없는 서버라면 OpenGL 자체가 필요 없음

---

#### ✅ 온라인 환경 (데스크탑/GUI 사용)

- GNOME, KDE 등의 데스크탑 환경이 있으며, **OpenGL 렌더링이 필요**한 경우

```bash
sudo ./NVIDIA-Linux-xxx.run \
    --silent \
    --dkms \
    --no-cc-version-check \
    --no-precompiled-interface
```

> ✅ 이 경우에는 **`--no-opengl-files`를 제외**하여 NVIDIA의 고성능 OpenGL을 그대로 사용  
> ❗ Mesa 라이브러리와 충돌 방지 위해 `/etc/X11/xorg.conf` 등을 수동 설정할 수도 있음

---

#### ✅ 결론 요약

| 환경 구분       | OpenGL 필요 여부 | `--no-opengl-files` 사용 | 설치 예시 특징 |
|--------------|----------------|----------------------|----------------|
| 서버/폐쇄망     | ❌ 필요 없음        | ✅ 사용                  | 충돌 방지 및 최소 설치 |
| 데스크탑/GUI    | ✅ 필요 있음        | ❌ 사용 안 함             | 고성능 그래픽 가속 활용 |

---

## 5. 설치 후 검증
```bash
nvidia-smi
```

---


## 6. 문제 해결 체크리스트  
| 증상 | 원인·대응 |  
|------|-----------|  
| `nvidia-smi` 오류<br> (“couldn't communicate…”) | 드라이버 모듈 미적재 → `sudo dmesg | grep -i nvidia` 확인. Secure Boot 서명 여부 점검. citeturn0search1 |  
| Wayland·TTY 전환 시 Freeze | 555/570/575 드라이버 + Wayland 결합 버그 → Xorg 전환 또는 550계열로 다운그레이드. |  
| DKMS 빌드 실패 | 커널 6.9+ 헤더 버전 부재 → `apt install linux-headers-$(uname -r)` 재설치 후 `dkms install`.|  
| 모듈 서명 요구 | `sudo update-secureboot-policy --enroll-key` → 재부팅 후 MOK Enroll.|  

---
