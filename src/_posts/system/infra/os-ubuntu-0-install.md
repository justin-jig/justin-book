---
title: "ubuntu 설치"
date: 2025-10-17
---
<p>version: ubuntu-24.04.2<p>

# 1. 설치 이미지(ISO) 다운로드

- 링크: https://ubuntu.com/download/server  
- 버전: Ubuntu 24.04 LTS SERVER amd64  
- 안정성: LTS 버전은 5년간 보안 업데이트 제공  
- AI 프레임워크 호환성: LTS 버전 기준으로 패키지 지원

![alt text](/justin-book/images/cs/infra/설치1.png)
---

# 2. ISO 이미지를 USB에 구워서 설치

- 툴: [Rufus](https://rufus.ie)
- 준비물:
  - 8GB 이상 USB 메모리
  - ubuntu-24.04.2-live-server-amd64.iso

- **Rufus 설정 예시** (GPT + UEFI 설정 권장):
  - 파티션 방식: GPT
  - 파일 시스템: FAT32
  - ISO 모드: 표준 ISO 이미지 모드

> **GPT 방식 권장 시점**
> - 디스크 용량이 2TB 이상
> - UEFI 기반 시스템
> - 안정성과 유연한 파티션 구성 필요
> - 대부분 NVMe SSD 조합 시 GPT + UEFI 최적

---

# 3. 부팅 순서 설정

- 부팅 순서에서 USB 장치를 최우선으로 설정
- 부팅 시: `Try or Install Ubuntu Server` 선택

> BIOS 진입 방법:
> - [DEL], [F2] 등 (PC에 따라 다름)
> - [F10] → 부팅 장치 선택
> - Secure Boot 끄기 필수

---

# 4. 언어 선택

- 설치는 기본적으로 `English` 사용 (한글은 추가 설정 필요)
- 키보드 방향키 + Enter 또는 SpaceBar 사용하여 조작
![alt text](/justin-book/images/cs/infra/설치언어선택_1.png)
![alt text](/justin-book/images/cs/infra/설치언어선택_2.png)

---

# 5. Server Type

- `Default` 설치 선택 (minimized가 아닌 기본 설치)

![alt text](/justin-book/images/cs/infra/설치서버타입선택.png)

---

# 6. Ethernet 설정

- DHCP 사용 시 → 바로 `Done`
- 고정 IP 사용 시 수동 설정 필요
- 

## IPv4 설정 방법:

- Method: `Manual` 선택
- 입력값 예시:
  - Subnet: `192.168.1.0/24`
  - Address: `192.168.1.100`
  - Gateway: `192.168.1.1`
  - Name servers: `8.8.8.8, 1.1.1.1` (선택)
  - Search domains: (생략 가능)

![alt text](/justin-book/images/cs/infra/설치Ethernet.png)
![alt text](/justin-book/images/cs/infra/설치Ethernet_2.png)

---

# 7. Proxy 서버 설정

- 특별한 경우가 아니면 `비워두고 넘어감`
  
![alt text](/justin-book/images/cs/infra/설치proxy.png)

---

# 8. Package Mirror 설정

- 기본: `archive.ubuntu.com`
- 국내 미러:
  - 카카오: http://mirror.kakao.com/ubuntu/
  - 카이스트: http://ftp.kaist.ac.kr/ubuntu/

> 폐쇄망 환경일 경우 스킵 가능

![alt text](/justin-book/images/cs/infra/설치_Package_Mirror.png)
---

# 9. Storage Config (스토리지 구성)

- 디스크 파티션 및 파일시스템 설정
- 특별한 요구사항 없으면 기본 설정 그대로 진행

## 구성 요소:
- `ubuntu-vg`: 새로 생성된 LVM 볼륨 그룹
- `free space`: 남은 공간

> 파티션 추가 필요 시:
> - 기존 파티션 unmount → Free space 선택 후 구성

![alt text](/justin-book/images/cs/infra/설치storage선택_1.png)
![alt text](/justin-book/images/cs/infra/설치storage선택_2.png)

---

# 10. 사용자 정보 설정

- Your name: 사용자 전체 이름 (예: Alice Kim)
- Server name: 시스템 호스트명 (예: ubuntu-server)
- Username: 로그인 계정 (예: alice)
- Password & Confirm: 비밀번호 입력

![alt text](/justin-book/images/cs/infra/설치사용자정보.png)

---

# 11. OpenSSH 설치

- OpenSSH 필요 시 Install 항목 체크  
- 일반적으로 [v] 체크함

![alt text](/justin-book/images/cs/infra/설치open_ssl.png)

---

# 12. Featured Snap

- 기본 기능 Snap 패키지 설치 옵션
- **스킵**하고 apt를 통한 수동 설치 권장

![alt text](/justin-book/images/cs/infra/설치Featured.png)

---

# 13. 설치 완료 화면

- 설치 완료 후 자동 업데이트 → `Cancel Update` 가능
- 이후 자동 재부팅

> **주의**: `/cdrom` 관련 오류 발생 시  
> 아무 키나 눌러 수동 재부팅 진행

- 재부팅 후 로그인 화면 등장 → 설정한 계정 정보로 로그인

![alt text](/justin-book/images/cs/infra/설치완료.png)