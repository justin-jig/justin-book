---
title: " ubuntu nvidia-cuda-install"
date: 2025-10-16
---
버전 : Ubuntu 24.04 /

참고 링크
- [CUDA Toolkit 공식 설치 문서](https://docs.nvidia.com/cuda/)
- [CUDA 버전별 다운로드](https://developer.nvidia.com/cuda-toolkit-archive)
- [CUDA Toolkit Archive](https://developer.nvidia.com/cuda-toolkit-archive)
- [CUDA Linux Installation](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/) 
- [CUDA Toolkit 아카이브](https://developer.nvidia.com/cuda-toolkit-archive)


| 버전                         | 릴리스 날짜                                   | 비고                        |
| -------------------------- | ---------------------------------------- | ------------------------- |
| **12.9 Update 1 (12.9.1)** | 2025-06-09 ([NVIDIA Docs][1])            | 공식 릴리스 노트 상 날짜 표시         |
| **12.9.0**                 | 2025-05 (월일 미확인) ([NVIDIA Developer][2]) | 아카이브 페이지에 “May 2025”로 표시됨 |
| **12.8.0**                 | 2025-01-24 ([nvidia.github.io][3])       | CUDA Python 문서 기준         |
| 기타 이전 버전                   | —                                        | 공식 발표 날짜가 일괄 정리되어 있지 않음   |


---

# ✅ CUDA Toolkit 12.9.1 설치 가이드 

## 1. 개요

CUDA Toolkit은 **LLM · 딥러닝 모델 학습 및 추론 서버에 필수**입니다.
반드시 **NVIDIA 드라이버 설치 후 CUDA 설치**해야 하며,
**설치 방식(APT vs Run)을 혼용하면 안 됩니다.**

지원 설치 방식:

* ✅ **Keyring + APT 저장소 (보안 및 자동 업데이트 권장)**
* ✅ **로컬 `.deb` 설치 (폐쇄망 / 반오프라인 환경)**
* ✅ **`.run` 파일 직접 설치 (완전 자급자족 환경)**
* ✅ **Docker CUDA 런타임 컨테이너 (격리형)**

---

## 2. 설치 방식 비교

| 방식                | 장점             | 단점               |
| ----------------- | -------------- | ---------------- |
| **APT 저장소**       | 자동 업데이트 간편     | 인터넷 필요           |
| **Keyring + APT** | ✅ 보안 서명, 버전 고정 | keyring 설치 필요    |
| **로컬 `.deb`**     | 폐쇄망 대응         | 설치 파일 용량 큼       |
| **`.run` 파일**     | 완전 독립, 유연      | 혼용 불가 / 수동 설정 필요 |

> 설치 후 `nvidia-smi`, `nvcc -V` 명령으로 드라이버·CUDA 호환성 검증 필수.

---

## 3. 설치 절차 (온라인 환경)

### 3.1 Keyring + APT 방식 (권장)

```bash
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2404/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt update
sudo apt install cuda-toolkit-12-9
```

> 🔹 `ubuntu2404` 대신 Ubuntu 버전에 맞는 레포지토리 경로 사용
> 🔹 APT 방식은 패키지 종속성 및 보안 키 자동 갱신 지원

---

### 3.2 로컬 `.deb` 설치 (인터넷 일시 필요)

```bash
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2404/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt-get update
sudo apt-get -y install cuda-toolkit-13-0

```

https://developer.nvidia.com/cuda-downloads?target_os=Linux&target_arch=x86_64&Distribution=Ubuntu&target_version=24.04&target_type=deb_network

> 🔸 폐쇄망 대응 용도이며, 설치 후 `.deb` 파일만 보관 하면 재설치 가능

---

## 4. 설치 절차 (폐쇄망 / Run 파일 직접 설치)

### 4.1 외부 PC에서 다운로드 (공식 경로 확인 완료)

```bash
wget https://developer.download.nvidia.com/compute/cuda/13.0.2/local_installers/cuda_13.0.2_580.95.05_linux.run
sudo sh cuda_13.0.2_580.95.05_linux.run
```
https://developer.nvidia.com/cuda-downloads?target_os=Linux&target_arch=x86_64&Distribution=Ubuntu&target_version=24.04&target_type=runfile_local

---

### 4.2 파일 전송 및 마운트 예시

```bash
# SCP로 폐쇄망 서버에 전송
scp *.run user@offline-host:/tmp/

# USB 마운트 예시
sudo mkdir -p /mnt/usb
sudo mount /dev/sdb1 /mnt/usb
cd /mnt/usb
```

---

### 4.3 설치 순서

```bash
# 1️⃣ 드라이버 먼저 설치
sudo chmod +x NVIDIA-Linux-x86_64-575.51.06.run
sudo ./NVIDIA-Linux-x86_64-575.51.06.run --silent --dkms

# 2️⃣ CUDA Toolkit 설치
sudo chmod +x cuda_12.9.1_575.51.06_linux.run
sudo ./cuda_12.9.1_575.51.06_linux.run --silent --toolkit --no-opengl-libs
```

> 🔹 이미 드라이버가 있다면 `--driver` 옵션 제외
> 🔹 서버 환경에서는 `--no-opengl-libs` 필수 (그래픽 충돌 방지)

---

### 4.4 `.run` 파일 옵션 정리 (검증 완료)

| 옵션                  | 필수 | 설명                      |
| ------------------- | -- | ----------------------- |
| `--silent`          | ✅  | 대화 없는 자동 설치             |
| `--toolkit`         | ✅  | CUDA Toolkit 만 설치       |
| `--driver`          | ❌  | 드라이버 포함 (중복 주의)         |
| `--samples`         | ❌  | 샘플 코드 추가                |
| `--toolkitpath=/경로` | ❌  | 설치 경로 변경                |
| `--samplespath=/경로` | ❌  | 샘플 코드 경로                |
| `--tmpdir=/경로`      | ❌  | 임시 디렉토리 변경              |
| `--override`        | ❌  | 기존 설치 덮어쓰기              |
| `--no-opengl-libs`  | ❌  | OpenGL 라이브러리 제외 (서버 필수) |

> **추천 설치 예시 (서버 환경):**
>
> ```bash
> sudo ./cuda_12.9.1_575.51.06_linux.run --silent --toolkit --no-opengl-libs
> ```

---

## 5. 버전 관리 전략

### 5.1 CUDA 버전 구조 개념

CUDA는 `/usr/local/cuda-<version>` 형태로 설치되며,
여러 버전이 공존할 수 있습니다.
→ 기본 참조 심볼릭 링크(`/usr/local/cuda`) 관리 필수.

---

### 5.2 온라인 환경 (APT 설치 시)

#### 방법 1: update-alternatives 관리

```bash
sudo update-alternatives --install /usr/local/cuda cuda /usr/local/cuda-12.9 90
sudo update-alternatives --config cuda
```

#### 방법 2: 심볼릭 링크 직접 설정

```bash
sudo ln -sfn /usr/local/cuda-12.9 /usr/local/cuda
```

---

### 5.3 폐쇄망 환경 (환경변수 직접 설정)

```bash
export CUDA_HOME=/opt/cuda-12.9
export PATH=$CUDA_HOME/bin:$PATH
export LD_LIBRARY_PATH=$CUDA_HOME/lib64:$LD_LIBRARY_PATH
```

> `.bashrc` 또는 `/etc/profile.d/cuda.sh` 에 영구 등록 권장

---

## 6. Docker / NVIDIA Container Toolkit 테스트

```bash
docker run --gpus all \
       nvcr.io/nvidia/cuda:12.9.1-runtime-ubuntu22.04 nvidia-smi
```

> 결과에 GPU 정보가 표시되면 컨테이너 런타임 연동 정상.
> (`nvidia-container-toolkit` 12.4+ 버전 필요)

---
